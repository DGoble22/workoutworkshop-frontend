import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './AuthModal.css';

export default function EditUsernameModal({ onClose }) {
    const { token, user, setUser } = useContext(AuthContext);
    const [newUsername, setNewUsername] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!newUsername.trim()) {
            setErrorMsg("Username cannot be empty.");
            return;
        }

        setIsSubmitting(true);

        //Sends the new username to the backend to update the user's profile. If successful, updates the user context and closes the modal
        try {
            const apiBase = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiBase}/user/update-username`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ new_username: newUsername })
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                setUser({ ...user, username: newUsername, first_name: newUsername });
                alert("Username updated successfully!");
                onClose();
            } else {
                setErrorMsg(result.message || "Failed to update username.");
            }
        } catch (error) {
            console.error("Error updating username:", error);
            setErrorMsg("A network error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="auth-close-btn" onClick={onClose}>×</button>
                <h2 className="auth-title">Change Username</h2>

                {errorMsg && <div style={{ color: '#dc3545', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{errorMsg}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field">
                        <label>New Username</label>
                        <input
                            type="text"
                            placeholder="Enter new username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            maxLength={50}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', marginTop: '20px' }}>
                        <button type="button" className="auth-submit-btn" style={{ backgroundColor: '#6c757d' }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}