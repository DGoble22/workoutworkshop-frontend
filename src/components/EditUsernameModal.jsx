import React, {useState, useContext, useEffect, useRef} from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import './AuthModal.css';

export default function EditUsernameModal({ onClose }) {
    const { token, user, setUser } = useContext(AuthContext);
    const [newUsername, setNewUsername] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (newUsername.trim().length <= 3 ) {
            setErrorMsg("Username must be at least 4 characters.");
            return;
        }
        if(newUsername === user.username) {
            setErrorMsg("Username already cannot be the same as the current username.");
            return;
        }
        if(!usernameAvailable){
            setErrorMsg("Username already taken.");
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
                toast.success("Username updated successfully!");
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

    // Username availability states
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [checkingUsername, setCheckingUsername] = useState(false);
    const usernameDebounceRef = useRef(null);

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

        const username = newUsername && newUsername.trim();
        if (!username || username.length <= 3) {
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
    }, [newUsername]);

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
                            id="new-username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            maxLength={50}
                        />
                    </div>

                    {newUsername !== "" && (
                        <div style={{ height: '20px', marginTop: '6px' }}>
                            {checkingUsername && <span style={{ color: '#666' }}>Checking availability...</span>}
                            {!checkingUsername && usernameAvailable === true && <span style={{ color: 'green' }}>Username available</span>}
                            {!checkingUsername && usernameAvailable === false && <span style={{ color: 'red' }}>Username already taken</span>}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', marginTop: '20px' }}>
                        <button id="username-cancel" type="button" className="auth-submit-btn" style={{ backgroundColor: '#6c757d' }} onClick={onClose}>Cancel</button>
                        <button id="username-submit" type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}