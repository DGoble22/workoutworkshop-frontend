import React, {useState, useContext, useEffect, useRef} from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import './AuthModal.css';

export default function ChangePasswordModal({ onClose }) {
    const { token, user, setUser } = useContext(AuthContext);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!newPassword || !confirmNewPassword || !oldPassword) {
            setErrorMsg("All fields are required.");
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            toast.error('Password must be at least 8 characters, include an uppercase, lowercase and a number');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setErrorMsg("New passwords do not match.");
            return;
        }
        setIsSubmitting(true);

        //Sends the current and new passowrd to the backend to update the user's password. If successful, updates the user context and closes the modal
        try {
            const apiBase = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiBase}/auth/change-password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ current_password: oldPassword, new_password: newPassword })
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                toast.success("Password updated successfully!");
                onClose();
            } else {
                setErrorMsg(result.message || "Failed to update password.");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            setErrorMsg("A network error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Password integrity checks
    const pwd = newPassword;
    const reqLength = pwd.length >= 8;
    const reqUpper = /[A-Z]/.test(pwd);
    const reqLower = /[a-z]/.test(pwd);
    const reqNum = /\d/.test(pwd);

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="auth-close-btn" onClick={onClose}>×</button>
                <h2 className="auth-title">Change Password</h2>

                {errorMsg && <div style={{ color: '#dc3545', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{errorMsg}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field">
                        <label>Old Password</label>
                        <input type="password" required placeholder="Enter current password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} maxLength={50}/>
                    </div>

                    <div className="auth-field">
                        <label >New Password</label>
                        <input type="password" required placeholder="Enter your new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                    </div>

                    {/* Real-time Password Checklist */}
                    <div style={{ marginTop: '8px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ color: reqLength ? 'green' : '#666' }}>
                                {reqLength ? '✓' : '○'} At least 8 characters
                            </span>
                        <span style={{ color: reqUpper ? 'green' : '#666' }}>
                                {reqUpper ? '✓' : '○'} One uppercase letter
                            </span>
                        <span style={{ color: reqLower ? 'green' : '#666' }}>
                                {reqLower ? '✓' : '○'} One lowercase letter
                            </span>
                        <span style={{ color: reqNum ? 'green' : '#666' }}>
                                {reqNum ? '✓' : '○'} One number
                            </span>
                    </div>

                    <div className="auth-field">
                        <label>Confirm New Password</label>
                        <input type="password" required placeholder="Confirm your new password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}/>
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