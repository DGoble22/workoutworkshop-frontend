import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Styling
const MODAL_OVERLAY = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
};

const CONFIRM_MODAL_CONTENT = {
    backgroundColor: "#ffffff",
    color: "#fff",
    padding: "25px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "450px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.8)"
};

const CONFIRM_BTN_GROUP = {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px"
};

const YES_BTN = {
    backgroundColor: "#711A19",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontWeight: "bold",
    cursor: "pointer",
    flex: 1
};

const BACK_BTN = {
    backgroundColor: "#000000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontWeight: "bold",
    cursor: "pointer",
    flex: 1
};

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
        <div style={MODAL_OVERLAY} onClick={onClose}>
            <div style={CONFIRM_MODAL_CONTENT} onClick={(e) => e.stopPropagation()}>

                <p style={{ fontSize: "1.8rem", lineHeight: "1.4", color: "#ccc" }}>
                    <strong style={{ color: "#000000" }}>Are you sure you want to delete your account?</strong>
                </p>

                <p style={{ fontSize: "1rem", lineHeight: "1.4", color: "#828282" }}>
                    This action cannot be reverted.
                </p>

                {errorMsg && (
                    <div style={{ color: '#E46464', marginTop: '10px', fontWeight: 'bold' }}>
                        {errorMsg}
                    </div>
                )}

                <div style={CONFIRM_BTN_GROUP}>
                    <button
                        type="button"
                        style={BACK_BTN}
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        style={YES_BTN}
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                </div>

            </div>
        </div>
    );
}