import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthModal.css';

export default function EditGoalsModal({ onClose }) {
    const { token, user, setUser } = useContext(AuthContext);

    // Pre-fill the form with the user's existing data
    const [formData, setFormData] = useState({
        current_weight: user?.current_weight || '',
        goal_weight: user?.goal_weight || '',
        goal_type: user?.goal_type || '',
        information: user?.information || ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const goalTypes = ["Strength", "Stamina", "WeightLoss"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        // Validate numbers
        const currentW = parseFloat(formData.current_weight);
        const goalW = parseFloat(formData.goal_weight);

        if (isNaN(currentW) || isNaN(goalW) || currentW <= 0 || goalW <= 0) {
            setErrorMsg("Please enter a valid number greater than 0 for weights.");
            return;
        }

        if (!formData.goal_type) {
            setErrorMsg("Please select a goal type.");
            return;
        }

        setIsSubmitting(true);

        try {
            const apiBase = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiBase}/user/update-goals`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    current_weight: currentW,
                    goal_weight: goalW,
                    goal_type: formData.goal_type,
                    information: formData.information
                })
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                setUser({
                    ...user,
                    current_weight: currentW,
                    goal_weight: goalW,
                    goal_type: formData.goal_type,
                    information: formData.information
                });
                toast.success("Profile updated successfully!");
                onClose();
            } else {
                setErrorMsg(result.message || "Failed to update goals.");
            }
        } catch (error) {
            console.error("Error updating goals:", error);
            setErrorMsg("A network error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="auth-close-btn" onClick={onClose}>×</button>
                <h2 className="auth-title">Update Goals</h2>

                {errorMsg && <div style={{ color: '#dc3545', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{errorMsg}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="modal-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label htmlFor="currentWeight">Current Weight</label>
                                <input
                                    type="number"
                                    id="currentWeight"
                                    name="current_weight"
                                    value={formData.current_weight}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label htmlFor="goalWeight">Goal Weight</label>
                                <input
                                    type="number"
                                    id="goalWeight"
                                    name="goal_weight"
                                    value={formData.goal_weight}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="auth-field">
                        <label>Goal Type</label>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                            {goalTypes.map((goal) => (
                                <label key={goal} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                    <input
                                        id={`goals-${goal}`}
                                        type="radio"
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

                    <div className="auth-field">
                        <label>Goal Notes</label>
                        <textarea
                            id="goal-notes"
                            name="information"
                            value={formData.information}
                            onChange={handleChange}
                            placeholder="e.g., Run a 5k, lift 200lbs..."
                            rows="3"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', marginTop: '20px' }}>
                        <button id="goals-cancel" type="button" className="auth-submit-btn" style={{ backgroundColor: '#6c757d' }} onClick={onClose}>Cancel</button>
                        <button id="goals-submit" type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}