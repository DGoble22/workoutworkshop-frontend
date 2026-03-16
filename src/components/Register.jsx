import React, { useContext, useState, useEffect, useRef } from "react";
import "./AuthModal.css";
import { AuthContext } from "../context/AuthContext";

export default function Register({ onClose, onSwitchToLogin }) {
    const { setToken, setUser } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        isCoach: false,
        // non-coach fields
        first_name: "",
        last_name: "",
        birthday: "",
        // coach fields
        certifications: [],
        pricing: 50,
        bio: "",
        availability: "",
        // weight step
        current_weight: 150,
        goal_weight: 140,
        goal_type: "",
        // payment
        cardName: "",
        cardNumber: "",
        cardExpMonth: "",
        cardExpYear: "",
        cardCVC: "",
    });

    const certificationOptions = [
      'Coach', 'Nutritionist'
    ];

    // Username availability states
    const [usernameAvailable, setUsernameAvailable] = useState(null); // null = unknown, true/false = known
    const [checkingUsername, setCheckingUsername] = useState(false);
    const usernameDebounceRef = useRef(null);

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
          setFormData({ ...formData, [name]: value });
        }
    };

    // Check username availability (POST to /auth/check-username expecting { available: true/false })
    const checkUsernameAvailability = async (username) => {
        const apiBase = import.meta.env.VITE_API_URL || '';
        if (!username || username.length < 2) {
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
        // clear previous timer
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
                alert('Please complete username and password');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            // If we don't know availability yet, force a check and wait
            if (usernameAvailable === null && !checkingUsername) {
                const avail = await checkUsernameAvailability(formData.username);
                if (avail === false) {
                    alert('Username is already taken');
                    return;
                }
            }

            if (checkingUsername) {
                alert('Checking username availability, please wait');
                return;
            }

            if (usernameAvailable === false) {
                alert('Username is already taken');
                return;
            }
        }

        // validation for step 2
        if (step === 2) {
            if (!formData.first_name || !formData.last_name || !formData.birthday) {
                alert('Please fill first name, last name and birthday');
                return;
            }
            if (formData.isCoach) {
                if (!formData.bio) {
                    if (!confirm('Bio is empty. Continue?')) return;
                }
            }
        }

        setStep(s => s + 1);
    };

    const goBack = () => setStep(s => Math.max(1, s - 1));

    const handleSubmit = async (e) => {
        e && e.preventDefault();

        // final submission: build payload
        const payload = {
            username: formData.username,
            password: formData.password,
            is_coach: !!formData.isCoach,
            first_name: formData.first_name,
            last_name: formData.last_name,
            birthday: formData.birthday,
            certifications: formData.isCoach ? formData.certifications : undefined,
            pricing: formData.isCoach ? formData.pricing : undefined,
            bio: formData.isCoach ? formData.bio : undefined,
            availability: formData.isCoach ? formData.availability : undefined,
            current_weight: formData.current_weight,
            goal_weight: formData.goal_weight,
            goal_type: formData.goal_type,
            // Optional
            payment: formData.cardNumber ? {
                name: formData.cardName,
                number: formData.cardNumber,
                exp_month: formData.cardExpMonth,
                exp_year: formData.cardExpYear,
                cvc: formData.cardCVC,
            } : undefined,
        };

        try {
            const apiBase = import.meta.env.VITE_API_URL || '';
            const endpoint = `${apiBase}/auth/register`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.status === "success") {
                alert("Registration successful!");

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
                    // Fallback to previous behavior when token is not returned
                    if (onSwitchToLogin && typeof onSwitchToLogin === 'function') {
                        onSwitchToLogin();
                    } else if (onClose && typeof onClose === 'function') {
                        onClose();
                    }
                }

                // reset
                setFormData({
                    username: "",
                    password: "",
                    confirmPassword: "",
                    isCoach: false,
                    first_name: "",
                    last_name: "",
                    birthday: "",
                    certifications: [],
                    pricing: 50,
                    bio: "",
                    availability: "",
                    current_weight: 150,
                    goal_weight: 140,
                    goal_type: "",
                    cardName: "",
                    cardNumber: "",
                    cardExpMonth: "",
                    cardExpYear: "",
                    cardCVC: "",
                });
                setStep(1);
            } else {
                alert(result.message || "Registration failed");
            }

        } catch (e) {
            console.error("Registration Failed: ", e);
            alert("An error occurred during registration");
        }
    };

    // Render per-step UI
    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="auth-close-btn" onClick={onClose}>×</button>

                <h2 className="auth-title">Register</h2>

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
                      <button type="button" className="auth-submit-btn" onClick={goNext}>Next</button>
                    </div>
                  </form>
                )}

                {/* Step 2 Firstname, LastName, Birthday Coach:(Certifications, Pricing, Bio, Availability) */}
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

                        <div className="auth-field">
                            <label htmlFor="pricing">Pricing (${formData.pricing} / hr)</label>
                            <input type="range" id="pricing" name="pricing" min="0" max="500" value={formData.pricing} onChange={handleChange} />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="bio">Bio</label>
                            <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell users about yourself" />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="availability">Availability</label>
                            <input type="text" id="availability" name="availability" value={formData.availability} onChange={handleChange} placeholder="e.g., M/W/F 9-11am" />
                        </div>
                      </>
                    )}

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                      <button type="button" className="auth-submit-btn" onClick={goBack}>Back</button>
                      <button type="button" className="auth-submit-btn" onClick={goNext}>Next</button>
                    </div>
                  </form>
                )}

                {/* Step 3 Username, password, coach? */}
                {step === 3 && (
                  <form onSubmit={(e) => { e.preventDefault(); setStep(4); }} className="auth-form">
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
                        {["Strength", "Stamina", "WeightLoss"].map((goal) => (
                          <label key={goal} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input
                              type="checkbox"
                              name="goal_type"
                              value={goal}
                              checked={formData.goal_type === goal}
                              onChange={handleChange}
                            />
                            {goal}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                      <button type="button" className="auth-submit-btn" onClick={goBack}>Back</button>
                      <div>
                        <button
                          type="button"
                          className="auth-submit-btn"
                          onClick={() => {
                            if (!formData.goal_type) {
                              alert('Please select a goal type before continuing.');
                              return;
                            }
                            setStep(4);
                          }}
                        >
                          Next
                        </button>
                        <button
                          type="button"
                          style={{ marginLeft: '8px' }}
                          className="auth-submit-btn"
                          onClick={() => {
                            if (!formData.goal_type) {
                              alert('Please select a goal type before finishing.');
                              return;
                            }
                            handleSubmit();
                          }}
                        >
                          Finish (skip payment)
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {step === 4 && (
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
                            <input type="text" id="cardExpMonth" name="cardExpMonth" value={formData.cardExpMonth} onChange={handleChange} placeholder="MM" />
                        </div>

                        <div className="auth-field" style={{ flex: 1 }}>
                            <label htmlFor="cardExpYear">Expiry Year</label>
                            <input type="text" id="cardExpYear" name="cardExpYear" value={formData.cardExpYear} onChange={handleChange} placeholder="YYYY" />
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
