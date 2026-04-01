import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthModal.css';

export default function DeleteAccountModal({ onClose }) {
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleDelete = async () => {
        setIsDeleting(true);
        setErrorMsg('');

        try {
            const apiBase = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiBase}/user/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                toast.success("Your account has been successfully deleted.");

                // Clear all auth state before navigation.
                localStorage.removeItem('token');
                logout();

                onClose();
                navigate('/');
            } else {
                setErrorMsg(result.message || "Failed to delete account.");
                setIsDeleting(false);
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            setErrorMsg("A network error occurred. Please try again.");
            setIsDeleting(false);
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()} style={{ borderTop: '5px solid #dc3545' }}>
                <button className="auth-close-btn" onClick={onClose}>×</button>
                <h2 className="auth-title" style={{ color: '#dc3545' }}>Delete Account</h2>

                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Are you absolutely sure?</p>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        This action cannot be undone. All of your profile data, goals, and account information will be permanently erased.
                    </p>
                </div>

                {errorMsg && <div style={{ color: '#dc3545', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{errorMsg}</div>}

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '30px' }}>
                    <button
                        type="button"
                        className="auth-submit-btn"
                        style={{ backgroundColor: '#6c757d', flex: 1 }}
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="auth-submit-btn"
                        style={{ backgroundColor: '#dc3545', flex: 1 }}
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                    </button>
                </div>
            </div>
        </div>
    );
}