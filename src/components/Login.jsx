import React, { useState, useContext } from "react";
import "./AuthModal.css";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login({ onClose, onSwitchToRegister }) {
    const { setToken, setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const apiBase = import.meta.env.VITE_API_URL;
            const url = `${apiBase}/auth/login`;

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: formData.username, password: formData.password })
            });

            const result = await response.json();
            if (result.status === "success" && result.token) {
                // store JWT in context (and persist)
                setToken(result.token);

                // store backend-provided user object in context/localStorage
                if (result.user) {
                    setUser(result.user);
                }

                toast.success("Login successful!");
                onClose();
            } else {
                toast.error(result.message || "Login failed");
            }
        } catch (e) {
            console.error("Login Failed: ", e);
            toast.error("An error occurred during login");
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
                <button  id="close-login" className="auth-close-btn" onClick={onClose}>×</button>

                <h2 className="auth-title">Login</h2>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field">
                        <label htmlFor="username">Username</label>
                        <input type="username" id="login-username" name="username" value={formData.username} onChange={handleChange} required placeholder="Enter your username"/>
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="login-password" name="password" value={formData.password} onChange={handleChange} required placeholder="Enter your password"/>
                    </div>

                    <button id="login-submit" type="submit" className="auth-submit-btn">Login</button>
                </form>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <span id="login-register" className="auth-link" onClick={() => onSwitchToRegister && onSwitchToRegister()}>
                        Register here
                    </span>
                </p>

            </div>
        </div>
    );
}
