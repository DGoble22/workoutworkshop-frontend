import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Login from "../../components/Login";
import Register from "../../components/Register";
import "./Home.css";

export default function Home() {
    const { isAuthenticated, user , token} = useContext(AuthContext);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [dailyRating, setDailyRating] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toDateString());

    const todayDate = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (isAuthenticated) {
            // Fetch the daily rating if it exists for today
            const fetchDailyRating = async () => {
                try {
                    const apiBase = import.meta.env.VITE_API_URL;
                    const url = `${apiBase}/user/check-survey`;
                    const response = await fetch(`${url}?date=${todayDate}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token // Include user token for backend to identify user
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.rating) {
                            setDailyRating(data.rating);
                        }
                    } else {
                        console.error("Failed to fetch daily rating.");
                    }
                } catch (error) {
                    console.error("Error fetching daily rating:", error);
                }
            };

            fetchDailyRating();
        }
    }, [isAuthenticated, selectedDate]);

    const handleOpenLogin = () => {
        setShowLogin(true);
        setShowRegister(false);
    };

    const handleOpenRegister = () => {
        setShowRegister(true);
        setShowLogin(false);
    };

    const handleCloseModals = () => {
        setShowLogin(false);
        setShowRegister(false);
    };

    const handleStarClick = async (rating) => {
        const today = new Date().toISOString().split('T')[0];
        try {
            const apiBase = import.meta.env.VITE_API_URL;
            const url = `${apiBase}/user/daily-survey`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({ date: today, rating }),
            });

            if (response.ok) {
                const data = await response.json();
                setDailyRating(data.rating); // Update the daily rating with the response data
            } else {
                console.error("Failed to update daily rating.");
            }
        } catch (error) {
            console.error("Error updating daily rating:", error);
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`star ${dailyRating >= i ? "selected" : ""}`} onClick={() => handleStarClick(i)}>
                    ★
                </span>
            );
        }
        return stars;
    };

    const handleFindCoach = () => {
        window.location.href = "/FindCoach";
    };

    const firstName = user?.first_name;

    return (
        <div className="home-page">
            {!isAuthenticated ? (
                <section className="home-hero container">
                    <div className="home-hero-card text-center">
                        <p className="home-kicker">Train smarter</p>
                        <h1 className="home-title">Welcome to Workout Workshop</h1>
                        <p className="home-subtitle">Build plan, track goals, and connect with coaches.</p>

                        <div className="home-actions">
                            <button type="button" className="home-auth-btn home-auth-btn-login" onClick={handleOpenLogin}>
                                Login
                            </button>
                            <button type="button" className="home-auth-btn home-auth-btn-register" onClick={handleOpenRegister}>
                                Register
                            </button>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="home-dashboard container">
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Dashboard</h1>
                        <p className="dashboard-subtitle">Welcome back, {firstName}</p>
                    </div>

                    <div className="dashboard-column">
                        <div className="dashboard-card">
                            <h3>Workout Plan</h3>
                            <p>You have no selected workout plan.</p>
                            <div className="dashboard-card-actions">
                                <button>Create a Plan</button>
                                <button onClick={handleFindCoach}>Hire a Coach</button>
                            </div>
                        </div>

                        <div className="dashboard-card">
                            <h3>Daily Survey</h3>
                            <p>Track how you feel each day (1-5) after training.</p>
                            <div className="daily-survey-stars">
                                {renderStars()}
                            </div>
                        </div>

                        <div className="dashboard-card">
                            <h3>Progress Metrics</h3>
                            <p>Review trends in performance, weight, and goal progress over time.</p>
                        </div>
                    </div>
                </section>
            )}

            {showLogin && (
                <Login
                    onClose={handleCloseModals}
                    onSwitchToRegister={handleOpenRegister}
                />
            )}
            {showRegister && (
                <Register
                    onClose={handleCloseModals}
                    onSwitchToLogin={handleOpenLogin}
                />
            )}
        </div>
    );
}