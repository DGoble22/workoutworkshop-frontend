import React, { useContext, useState, useEffect, useRef } from "react";
import "./AuthModal.css";
import { AuthContext } from "../context/AuthContext";
import CoachAvailabilityEditor from "./CoachAvailabilityEditor";
import toast from "react-hot-toast";

export default function Register({ onClose, onSwitchToLogin }) {
    const { setToken, setUser } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        isCoach: false,
        first_name: "",
        last_name: "",
        birthday: "",
        // coach fields
        certifications: [],
        certificationFiles: [], // Add field for certification files
        pricing: 50,
        bio: "",
        availability: [],
        // goal step
        current_weight: 150,
        goal_weight: 140,
        goal_type: "",
        goal_text: "",
        // payment
        cardName: "",
        cardNumber: "",
        cardExpMonth: "",
        cardExpYear: "",
        cardCVC: "",
    });

    const certificationOptions = ['Coach', 'Nutritionist'];
    const goalType = ["Strength", "Stamina", "WeightLoss"];

    // Username availability states
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [checkingUsername, setCheckingUsername] = useState(false);
    const usernameDebounceRef = useRef(null);

    //Master form change handler
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox' && name === 'isCoach') {
          setFormData({ ...formData, [name]: checked });
        } else if (type === 'checkbox' && name === 'certifications') {
          // certification multi-select checkboxes
          const prev = formData.certifications || [];
          if (checked) setFormData({ ...formData, certifications: [...prev, value] });
          else setFormData({ ...formData, certifications: prev.filter(c => c !== value) });
        } else if (type === 'checkbox' && name === 'goal_type') {
          // single-select goal checkboxes
          setFormData({ ...formData, goal_type: checked ? value : "" });
        } else {
            // Default
          setFormData({ ...formData, [name]: value });
        }
    };

    // Specific handler for coach availability editor
    const handleAvailabilityChange = (nextAvailability) => {
        setFormData((prev) => ({ ...prev, availability: nextAvailability }));
    };

    // Validation helper for coach availability step
    const hasInvalidAvailability = (slots) => {
        if (!Array.isArray(slots) || slots.length === 0) return true; //empty
        return slots.some((slot) => {
            if (!slot || !slot.dow || !slot.start_time || !slot.end_time) return true; // missing fields
            return slot.start_time >= slot.end_time;
        });
    };

    // Determine total steps and display step number based on whether user is registering as a coach
    const totalSteps = formData.isCoach ? 5 : 4;
    const displayStep = formData.isCoach ? step : (step >= 4 ? step - 1 : step);

    // Check username availability (POST to /auth/check-username expecting { available: true/false })
    const checkUsernameAvailability = async (username) => {
        const apiBase = import.meta.env.VITE_API_URL;
        if (!username) {
            setUsernameAvailable(null);
            setCheckingUsername(false);
            return null;
        }

        setCheckingUsername(true);
        setUsernameAvailable(null);
        try {
            const endpoint = `${apiBase}/auth/check-username`;
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
            const data = await res.json();
            const avail = !!(data && data.available);
            setUsernameAvailable(avail);
            setCheckingUsername(false);
            return avail;
        } catch (err) {
            console.error('Username check failed', err);
            setUsernameAvailable(null);
            setCheckingUsername(false);
            return null;
        }
    };

    // Debounced effect when username changes
    useEffect(() => {
        if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current);

        const username = formData.username && formData.username.trim();
        if (!username) {
            setUsernameAvailable(null);
            setCheckingUsername(false);
            return;
        }

        // debounce before checking
        usernameDebounceRef.current = setTimeout(() => {
            checkUsernameAvailability(username);
        }, 500);

        return () => {
            if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current);
        };
    }, [formData.username]);

    // Modal navigation handlers
    const goNext = async () => {

        // basic validation on step 1
        if (step === 1) {
            if (!formData.username || !formData.password || !formData.confirmPassword) {
                toast.error('Please complete username and password');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }
            if (usernameAvailable === null && !checkingUsername) {
                const avail = await checkUsernameAvailability(formData.username);
                if (avail === false) {
                    toast.error('Username is already taken');
                    return;
                }
            }
            if (checkingUsername) {
                toast.error('Checking username availability, please wait');
                return;
            }
            if (usernameAvailable === false) {
                toast.error('Username is already taken');
                return;
            }
            setStep(2);
            return;
        }

        // validation for step 2
        if (step === 2) {
            if (!formData.first_name || !formData.last_name || !formData.birthday) {
                toast.error('Please fill first name, last name and birthday');
                return;
            }

            if (formData.isCoach) {
                // certifications: at least one
                if (!formData.certifications || formData.certifications.length === 0) {
                    toast.error('Please select at least one certification');
                    return;
                }
                if (formData.certifications.some((_, index) => !formData.certificationFiles[index])) {
                    toast.error('Please upload proof for all selected certifications');
                    return;
                }
                if (formData.pricing === undefined || formData.pricing === null || formData.pricing === '') {
                    toast.error('Please set your pricing');
                    return;
                }
                // bio required for coach
                if (!formData.bio || !formData.bio.trim()) {
                    toast.error('Please enter a bio');
                    return;
                }
                setStep(3);
                return;
            }
            setStep(4);
            return;
        }

        // validation for step 3 (coach availability)
        if (step === 3) {
            if (formData.isCoach && hasInvalidAvailability(formData.availability)) {
                toast.error('Please add at least one valid availability time slot');
                return;
            }
            setStep(4);
            return;
        }

        // validation for step 4 (goals)
        if (step === 4) {
            if (!formData.goal_type) {
                toast.error('Please select a goal type before continuing.');
                return;
            }
            const current = Number(formData.current_weight);
            const goal = Number(formData.goal_weight);
            if (!current || isNaN(current)) {
                toast.error('Please set your current weight');
                return;
            }
            if (!goal || isNaN(goal)) {
                toast.error('Please set your goal weight');
                return;
            }
            setStep(5);
        }
    };

    const goBack = () => {
        if (step === 5) {
            setStep(4);
            return;
        }
        if (step === 4) {
            setStep(formData.isCoach ? 3 : 2);
            return;
        }
        if (step === 3) {
            setStep(2);
            return;
        }
        if (step === 2) {
            setStep(1);
            return;
        }
        setStep(1);
    };

    const handleFileUploadChange = (index, file) => {
        setFormData((prev) => {
            const updatedFiles = [...prev.certificationFiles];
            updatedFiles[index] = file;
            return { ...prev, certificationFiles: updatedFiles };
        });
    };

    const normalizeAvailability = (availability) => {
        return availability.map(({ dow, start_time, end_time }) => ({
            dow,
            start_time: `${start_time}:00`, // Ensure time format includes seconds
            end_time: `${end_time}:00`,
        }));
    };

    const handleSubmit = async (e) => {
        e && e.preventDefault();

        // Payment fields validation: if any payment field is present, require all and validate
        const { cardName, cardNumber, cardExpMonth, cardExpYear, cardCVC } = formData;
        const anyPayment = (cardName || cardNumber || cardExpMonth || cardExpYear || cardCVC);
        if (anyPayment) {
            if (!cardName || !cardNumber || !cardExpMonth || !cardExpYear || !cardCVC) {
                toast.error('Please complete all payment fields or leave all blank to skip payment');
                return;
            }
            // number checks
            const cleaned = (cardNumber || '').replace(/\s+/g, '');
            if (!/^\d{12,19}$/.test(cleaned)) {
                toast.error('Please enter a valid card number (12-19 digits)');
                return;
            }
            const month = parseInt(cardExpMonth, 10);
            if (isNaN(month) || month < 1 || month > 12) {
                toast.error('Please enter a valid expiry month (1-12)');
                return;
            }
            const year = parseInt(cardExpYear, 10);
            const nowYear = new Date().getFullYear();
            if (isNaN(year) || year < nowYear) {
                toast.error('Please enter a valid expiry year (current year or later)');
                return;
            }
            if (!/^\d{3,4}$/.test(cardCVC)) {
                toast.error('Please enter a valid CVC (3 or 4 digits)');
                return;
            }
        }

        const normalizedAvailability = normalizeAvailability(formData.availability);

        // build payload
        const payload = {
            username: formData.username,
            password: formData.password,
            is_coach: !!formData.isCoach,
            first_name: formData.first_name,
            last_name: formData.last_name,
            birthday: formData.birthday,
            certifications: formData.certifications,
            certificationFiles: formData.certificationFiles.map((file) => file ? file.name : null), // Include file names
            pricing: formData.isCoach ? formData.pricing : undefined,
            bio: formData.isCoach ? formData.bio : undefined,
            availability: normalizedAvailability,
            current_weight: formData.current_weight,
            goal_weight: formData.goal_weight,
            goal_type: formData.goal_type,
            goal_text: formData.goal_text,
            // Optional
            // payment
            cardName: formData.cardName,
            cardNumber: formData.cardNumber,
            cardExpMonth: formData.cardExpMonth,
            cardExpYear: formData.cardExpYear,
            cardCVC: formData.cardCVC,
        };

        const formDataToSend = new FormData();
        Object.keys(payload).forEach((key) => {
            if (key === "availability") {
                formDataToSend.append(key, JSON.stringify(payload[key]));
            } else if (Array.isArray(payload[key])) {
                payload[key].forEach((item) => formDataToSend.append(key, item));
            } else if (payload[key] !== undefined) {
                formDataToSend.append(key, payload[key]);
            }
        });

        formData.certificationFiles.forEach((file, index) => {
            if (file) {
                formDataToSend.append(`certificationFile_${index}`, file);
            }
        });

        // Call Register API (expecting token and user in response for auto-login, but can work without)
        try {
            const apiBase = import.meta.env.VITE_API_URL || '';
            const endpoint = `${apiBase}/auth/register`;

            const response = await fetch(endpoint, {
                method: "POST",
                body: formDataToSend,
            });

            const result = await response.json();
            if (result.status === "success") {
                toast.success("Registration successful! You are now logged in.");

                // Auto-login if register response includes token/user like login
                if (result.token) {
                    setToken(result.token);
                    if (result.user) {
                        setUser(result.user);
                    }
                    if (onClose && typeof onClose === 'function') {
                        onClose();
                    }
                } else {
                    // token is not returned
                    if (onSwitchToLogin && typeof onSwitchToLogin === 'function') {
                        onSwitchToLogin();
                    } else if (onClose && typeof onClose === 'function') {
                        onClose();
                    }
                }

                // reset form data
                setFormData({
                    username: "",
                    password: "",
                    confirmPassword: "",
                    isCoach: false,
                    first_name: "",
                    last_name: "",
                    birthday: "",
                    certifications: [],
                    certificationFiles: [],
                    pricing: 50,
                    bio: "",
                    availability: [],
                    current_weight: 150,
                    goal_weight: 140,
                    goal_type: "",
                    goal_text: "",
                    cardName: "",
                    cardNumber: "",
                    cardExpMonth: "",
                    cardExpYear: "",
                    cardCVC: "",
                });
                setStep(1);
            } else {
                toast.error(result.message || "Registration failed");
            }

        } catch (e) {
            console.error("Registration Failed: ", e);
            toast.error("An error occurred during registration");
        }
    };

    // Render per-step UI
    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="auth-close-btn" onClick={onClose}>×</button>

                <h2 className="auth-title">Register ({displayStep} of {totalSteps})</h2>

                {/* Step 1 Username, password, coach? */}
                {step === 1 && (
                  <form onSubmit={(e) => { e.preventDefault(); goNext(); }} className="auth-form">
                    <div className="auth-field">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required placeholder="Enter a username"/>
                        <div style={{ height: '20px', marginTop: '6px' }}>
                          {checkingUsername && <span style={{ color: '#666' }}>Checking availability...</span>}
                          {!checkingUsername && usernameAvailable === true && <span style={{ color: 'green' }}>Username available</span>}
                          {!checkingUsername && usernameAvailable === false && <span style={{ color: 'red' }}>Username already taken</span>}
                        </div>
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Enter your password"/>
                    </div>

                    <div className="auth-field">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm your password"/>
                    </div>

                    <div className="auth-field" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row' }}>
                        <input type="checkbox" id="isCoach" name="isCoach" checked={formData.isCoach} onChange={handleChange} />
                        <label htmlFor="isCoach">I am a coach</label>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button type="button" className="auth-submit-btn" onClick={goNext} disabled={checkingUsername}>Next</button>
                    </div>
                  </form>
                )}

                {/* Step 2 Firstname, LastName, Birthday Coach:(Certifications, Pricing, Bio) */}
                {step === 2 && (
                  <form onSubmit={(e) => { e.preventDefault(); goNext(); }} className="auth-form">
                    <div className="auth-field">
                        <label htmlFor="first_name">First Name</label>
                        <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required placeholder="First name"/>
                    </div>
                    <div className="auth-field">
                        <label htmlFor="last_name">Last Name</label>
                        <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required placeholder="Last name"/>
                    </div>
                    <div className="auth-field">
                        <label htmlFor="birthday">Birthday</label>
                        <input type="date" id="birthday" name="birthday" value={formData.birthday} onChange={handleChange} required />
                    </div>

                      {/*Coach Specific Questions*/}
                    {formData.isCoach && (
                      <>
                        <div className="auth-field">
                            <label>Certifications</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {certificationOptions.map(opt => (
                                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <input type="checkbox" name="certifications" value={opt} checked={formData.certifications.includes(opt)} onChange={handleChange} /> {opt}
                                </label>
                              ))}
                            </div>
                        </div>

                        {formData.certifications.map((cert, index) => (
                          <div key={index} className="auth-field">
                            <label htmlFor={`cert-upload-${index}`}>Upload proof for {cert}</label>
                            <input
                              type="file"
                              id={`cert-upload-${index}`}
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  // Validate file type and size
                                  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                                    toast.error("Invalid file format. Please upload a JPEG or PNG.");
                                    return;
                                  }
                                  if (file.size > 5 * 1024 * 1024) {
                                    toast.error("File is too large. Maximum size is 5MB.");
                                    return;
                                  }
                                  handleFileUploadChange(index, file);
                                }
                              }}
                            />
                          </div>
                        ))}

                        <div className="auth-field">
                            <label htmlFor="pricing">Pricing (${formData.pricing} / wk)</label>
                            <input type="range" id="pricing" name="pricing" min="0" max="500" value={formData.pricing} onChange={handleChange} />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="bio">Bio</label>
                            <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell users about yourself" />
                        </div>
                      </>
                    )}

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                      <button type="button" className="auth-submit-btn" onClick={goBack}>Back</button>
                      <button type="button" className="auth-submit-btn" onClick={goNext}>Next</button>
                    </div>
                  </form>
                )}

                {/* Step 3 Coach Availability */}
                {step === 3 && formData.isCoach && (
                  <form onSubmit={(e) => { e.preventDefault(); goNext(); }} className="auth-form">
                    <div className="auth-field">
                        <label>Availability</label>
                        <CoachAvailabilityEditor
                            value={formData.availability}
                            onChange={handleAvailabilityChange}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                      <button type="button" className="auth-submit-btn" onClick={goBack}>Back</button>
                      <button type="button" className="auth-submit-btn" onClick={goNext}>Next</button>
                    </div>
                  </form>
                )}

                {/* Step 4 Current Weight, Goal Weight, Goal */}
                {step === 4 && (
                  <form onSubmit={(e) => { e.preventDefault(); goNext(); }} className="auth-form">
                    <div className="auth-field">
                        <label htmlFor="current_weight">Current Weight: {formData.current_weight} lbs</label>
                        <input type="range" id="current_weight" name="current_weight" min="60" max="400" value={formData.current_weight} onChange={handleChange} />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="goal_weight">Goal Weight: {formData.goal_weight} lbs</label>
                        <input type="range" id="goal_weight" name="goal_weight" min="60" max="400" value={formData.goal_weight} onChange={handleChange} />
                    </div>

                    <div className="auth-field">
                      <label>Goal Type (required)</label>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {goalType.map((goal) => (
                          <label key={goal} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <input type="radio" name="goal_type" value={goal} checked={formData.goal_type === goal} onChange={handleChange} style={{ marginRight: '6px' }}/>
                            {goal}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="auth-field">
                        <label htmlFor="goal_text">Goal Notes (optional)</label>
                        <input type="text" id="goal_text" name="goal_text" value={formData.goal_text} onChange={handleChange} placeholder="e.g., Lose 15 lbs by summer"/>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                      <button type="button" className="auth-submit-btn" onClick={goBack}>Back</button>
                      <div>
                        <button type="button" className="auth-submit-btn" onClick={goNext}>Next</button>

                        <button type="button" style={{ marginLeft: '8px' }} className="auth-submit-btn" onClick={() => {
                            if (!formData.goal_type) {
                              toast.error('Please select a goal type before finishing.');
                              return;
                            }
                            handleSubmit();
                        }}>Finish (skip payment)</button>

                      </div>
                    </div>
                  </form>
                )}

                {/* Optional Payment details */}
                {step === 5 && (
                  <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field">
                        <label htmlFor="cardName">Name on Card</label>
                        <input type="text" id="cardName" name="cardName" value={formData.cardName} onChange={handleChange} placeholder="Full name" />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="cardNumber">Card Number</label>
                        <input type="text" id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="4111 1111 1111 1111" />
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div className="auth-field" style={{ flex: 1 }}>
                            <label htmlFor="cardExpMonth">Expiry Month</label>
                            <input id="cardExpMonth" name="cardExpMonth" className="expiry-input" value={formData.cardExpMonth} onChange={handleChange} placeholder="MM" />
                        </div>

                        <div className="auth-field" style={{ flex: 1 }}>
                            <label htmlFor="cardExpYear">Expiry Year</label>
                            <input id="cardExpYear" name="cardExpYear" className="expiry-input" value={formData.cardExpYear} onChange={handleChange} placeholder="YYYY" />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label htmlFor="cardCVC">CVC</label>
                        <input type="text" id="cardCVC" name="cardCVC" value={formData.cardCVC} onChange={handleChange} placeholder="CVC" />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                        <button type="button" className="auth-submit-btn" onClick={goBack}>Back</button>
                        <button type="submit" className="auth-submit-btn">Finish</button>
                    </div>
                  </form>
                )}

            </div>
        </div>
    );
}
