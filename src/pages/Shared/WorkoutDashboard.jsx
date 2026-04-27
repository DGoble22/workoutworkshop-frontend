import React from "react";
import { useNavigate } from "react-router-dom";


// Styles
const PAGE_WRAPPER = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
};

const TOP_BAR_STYLES = {
    display: "flex",
    width: "100%",
    borderRadius: "15px",
    backgroundColor: "#c9c9c9",
    padding: "20px 10px",
    justifyContent: "space-between",
};

const DOTWCARD_STYLES = {
    backgroundColor: "#333333",
    color: "#ffffff",
    border: "none",
    height: "60px",
    flex: 1,
    margin: "0 8px",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "transform 0.2s"
};

const MAIN_CONTAINER = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: "40px 0"
};

const MENU_BUTTON_STYLES = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "400px",
    height: "120px",
    backgroundColor: "#ffffff",
    border: "1px solid #000000",
    borderRadius: "15px",
    margin: "15px 0",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#000000",
    gap: "20px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)"
};

export default function WorkoutDashboard() {
    const navigate = useNavigate();

    const handleDayClick = (day) => {
        //Navigate to the builder with day
        navigate(`/workout-builder/${day}`, {state:{"day": day}});
    };

    const handleMenuClick = (menuItem) => {
        navigate(menuItem);
    };

    return (
        <div style={PAGE_WRAPPER}>

            {/* Days of the Week */}
            <div style={TOP_BAR_STYLES}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <button
                        id={`nav-${day}`}
                        key={day}
                        style={DOTWCARD_STYLES}
                        onClick={() => handleDayClick(day)}
                        onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Main Menu Buttons */}
            <div style={MAIN_CONTAINER}>

                <button id="calendar" style={MENU_BUTTON_STYLES} onClick={() => handleMenuClick("/calendar")}>
                    {/* Calendar Icon */}
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                        <circle cx="8" cy="15" r="1.5" fill="currentColor" stroke="none"></circle>
                        <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none"></circle>
                        <circle cx="16" cy="15" r="1.5" fill="currentColor" stroke="none"></circle>
                    </svg>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.2" }}>
                        <span>Calendar</span>
                        <span>Viewer</span>
                    </div>
                </button>

                <button id="get-coaching" style={MENU_BUTTON_STYLES} onClick={() => handleMenuClick("/findCoach")}>
                    GET COACHING
                </button>

                <button id="workout-log" style={MENU_BUTTON_STYLES} onClick={() => handleMenuClick("/workout-log")}>
                    WORKOUT LOG
                </button>

                <button id="workout-library" style={MENU_BUTTON_STYLES} onClick={() => handleMenuClick("/workout-library")}>
                    WORKOUT LIBRARY
                </button>

            </div>
        </div>
    );
}