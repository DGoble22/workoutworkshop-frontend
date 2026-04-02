import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Styling
const PAGE_CONTAINER = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    width: "100%",
    height: "100vh",
    fontFamily: "sans-serif"
};

const TITLE_STYLE = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#000"
};

const LIST_CONTAINER = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "600px",
    gap: "15px"
};

const ROW_STYLE = {
    display: "flex",
    width: "100%",
    gap: "15px"
};

const LOG_BOX = {
    flex: 1,
    backgroundColor: "#D9D9D9",
    borderRadius: "15px",
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    color: "#000",
    fontSize: "1rem"
};

const EDIT_BTN = {
    backgroundColor: "#8c8c8c",
    color: "#000",
    border: "none",
    borderRadius: "12px",
    padding: "0 25px",
    cursor: "pointer",
    fontSize: "1rem"
};

const REMOVE_BTN = {
    backgroundColor: "#711A19",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "0 20px",
    cursor: "pointer",
    fontSize: "1rem"
};

const BACK_BTN = {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "10px 30px",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "20px",
    alignSelf: "flex-start"
};

export default function WorkoutLog() {
    const navigate = useNavigate();
    // Dummy data for now
    const [savedWorkouts, setSavedWorkouts] = useState([
        { id: 1, date: "2/24/26", title: "Chest" },
        { id: 2, date: "2/23/26", title: "Arms" },
        { id: 3, date: "2/21/26", title: "Legs" },
        { id: 4, date: "2/19/26", title: "Back" }
    ]);

    const handleEdit = (id) => {
        console.log("Editing workout:", id);
    };

    const handleRemove = (id) => {
        console.log("Removing workout:", id);
        // In the future, this will send a DELETE request to Flask
    };

    const handleBack = () => {
        navigate(-1) //goes back on page
    };

    return (
        <div style={PAGE_CONTAINER}>
            <h1 style={TITLE_STYLE}>Workout Log</h1>

            <div style={LIST_CONTAINER}>
                {savedWorkouts.map((workout) => (
                    <div key={workout.id} style={ROW_STYLE}>
                        {/* Here is the {date} - {title} format! */}
                        <div style={LOG_BOX}>
                            {workout.date} - {workout.title}
                        </div>

                        <button style={EDIT_BTN} onClick={() => handleEdit(workout.id)}>
                            Edit
                        </button>
                        <button style={REMOVE_BTN} onClick={() => handleRemove(workout.id)}>
                            Remove
                        </button>
                    </div>
                ))}

                <button style={BACK_BTN} onClick={handleBack}>
                    Back
                </button>
            </div>
        </div>
    );
}