import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthModal.css';

export default function EditPaymentDetailsModal({ onClose }) {
    const { token, user, setUser } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        cardName: user?.cardName || '',
        cardNumber: user?.cardNumber || '',
        cardExpMonth: user?.cardExpMonth || '',
        cardExpYear: user?.cardExpYear || '',
        cardCVC: user?.cardCVC || ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        const { cardName, cardNumber, cardExpMonth, cardExpYear, cardCVC } = formData;
        const anyPayment = (cardNumber || cardExpMonth || cardExpYear || cardCVC);

        let cleaned, month, year;

        if (anyPayment) {
            if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCVC) {
                toast.error('Please complete all payment fields');
                return;
            }
            cleaned = (cardNumber || '').replace(/\s+/g, '');
            if (!/^\d{12,19}$/.test(cleaned)) {
                toast.error('Please enter a valid card number (12-19 digits)');
                return;
            }
            month = parseInt(cardExpMonth, 10);
            if (isNaN(month) || month < 1 || month > 12) {
                toast.error('Please enter a valid expiry month (1-12)');
                return;
            }
            year = parseInt(cardExpYear, 10);
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

        setIsSubmitting(true);

        try {
            const apiBase = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiBase}/user/update-payment`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    card_number: cleaned,
                    card_month: month,
                    card_year: year,
                    card_cvv: cardCVC
                })
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                setUser({
                    ...user,
                    cardNumber: cleaned,
                    cardExpMonth: month,
                    cardExpYear: year,
                    cardCVC: cardCVC
                });
                toast.success("Payment details updated successfully!");
                onClose();
            } else {
                setErrorMsg(result.message || "Failed to update payment details.");
            }
        } catch (error) {
            console.error("Error updating payment details:", error);
            setErrorMsg("A network error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="auth-close-btn" onClick={onClose}>×</button>
                <h2 className="auth-title">Update Payment Details</h2>

                {errorMsg && <div style={{ color: '#dc3545', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{errorMsg}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field">
                        <label htmlFor="cardName">Name on Card</label>
                        <input type="text" id="cardName" name="cardName" value={formData.cardName} onChange={handleChange} placeholder="Full name" />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="cardNumber">Card Number</label>
                        <input type="text" id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="1234 5678 9123 4567" />
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

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', marginTop: '20px' }}>
                        <button id="cancel" type="button" className="auth-submit-btn" style={{ backgroundColor: '#6c757d' }} onClick={onClose}>Cancel</button>
                        <button id="finish" type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}