import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// Styling
const PAGE_CONTAINER = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    width: "100%",
    minHeight: "100vh",
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
    maxWidth: "450px",
    gap: "20px"
};

const CARD_WRAPPER = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
};

const CARD_HEADER = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#BBAEAC",
    padding: "10px 20px",
    fontSize: "1.2rem",
    color: "#000"
};

const MINUS_BTN = {
    background: "none",
    border: "2px solid #ed1c24",
    color: "#ed1c24",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "1.5rem",
    lineHeight: "0"
};

const CARD_BODY = {
    display: "flex",
    backgroundColor: "#514E4A",
    padding: "15px",
    gap: "15px",
    color: "#fff"
};

const IMAGE_PLACEHOLDER = {
    width: "120px",
    height: "80px",
    backgroundColor: "#333",
    borderRadius: "10px",
    objectFit: "cover"
};

const INPUT_ROW = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
    width: "100%"
};

const INPUT_LABEL = {
    fontSize: "1.1rem",
    width: "70px"
};

const INPUT_FIELD = {
    backgroundColor: "#D9D9D9",
    border: "none",
    borderRadius: "15px",
    padding: "4px 10px",
    width: "200px",
    textAlign: "center",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#000"
};

const BACK_BTN = {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "10px 30px",
    cursor: "pointer",
    fontSize: "1.1rem",
    marginTop: "20px",
    alignSelf: "flex-start"
};

const SAVE_BTN = {
    backgroundColor: "#711A19",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "10px 30px",
    cursor: "pointer",
    fontSize: "1.1rem",
    marginTop: "20px",
    alignSelf: "flex-start"
};

const BUTTON_ROW = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "20px"
};

export default function WorkoutEdit() {
    const { planId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    //grabs date and title location from previous page.
    const headerInfo = location.state || { date: "Loading", title: "..." };

    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkoutDetails = async () => {
            try {
                const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
                const response = await axios.get(`${apiBase}/api/workouts/plan/${planId}`);

                if (response.data.status === 'success') {
                    setExercises(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching workout details:", error);
                toast.error("Failed to load exercises.");
            } finally {
                setLoading(false);
            }
        };

        fetchWorkoutDetails();
    }, [planId]);

    // Handle input changes for reps, sets, and weight
    const handleInputChange = (exerciseId, field, value) => {
        setExercises((prevExercises) =>
            prevExercises.map((ex) =>
                ex.exercise_id === exerciseId ? { ...ex, [field]: value } : ex
            )
        );
    };

    // Goes back one page when "Back" is pressed
    const handleBack = () => {
        navigate(-1);
    };

    // Removes an exercise from the workout plan
    const handleRemoveExercise = async (exerciseId) => {
        // Confirm delete, should be changed later to a modal or something
        const confirmDelete = window.confirm("Remove this exercise from your workout?");
        if (!confirmDelete) return;

        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

            const response = await axios.delete(`${apiBase}/api/workouts/plan/${planId}/exercise/${exerciseId}`);

            if (response.data.status === 'success') {
                setExercises((prevExercises) =>
                    prevExercises.filter((ex) => ex.exercise_id !== exerciseId)
                );
                toast.success("Exercise removed!");
            }
        } catch (error) {
            console.error("Error removing exercise:", error);
            toast.error("Failed to remove exercise.");
        }
    };

    // Saves the updated workout plan to the backend
    const handleSave = async () => {
        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

            //Send payload with updated exercises.
            const payload = { exercises: exercises };
            const response = await axios.put(`${apiBase}/api/workouts/plan/${planId}`, payload);

            if (response.data.status === 'success') {
                toast.success("Workout updated successfully!");
                navigate(-1); // Redirect back to the log
            }
        } catch (error) {
            console.error("Error saving workout:", error);
            toast.error("Failed to save workout.");
        }
    };

    return (
        <div style={PAGE_CONTAINER}>
            {/* Header: "Date | Title" */}
            <h1 style={TITLE_STYLE}>{headerInfo.date} | {headerInfo.title}</h1>

            <div style={LIST_CONTAINER}>
                {loading ? (
                    <p style={{ textAlign: "center" }}>Loading exercises...</p>
                ) : exercises.length === 0 ? (
                    <p style={{ textAlign: "center" }}>No exercises found for this workout.</p>
                ) : (
                    exercises.map((ex, index) => (
                        <div key={index} style={CARD_WRAPPER}>
                            {/* Card Header */}
                            <div style={CARD_HEADER}>
                                <span>{ex.exercise_name}</span>
                                <button style={MINUS_BTN} onClick={() => handleRemoveExercise(ex.exercise_id)}>
                                    -
                                </button>
                            </div>

                            {/* Card Body */}
                            <div style={CARD_BODY}>
                                <img
                                    src={ex.video_url || "https://via.placeholder.com/120x80"}
                                    alt={ex.exercise_name}
                                    style={IMAGE_PLACEHOLDER}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={INPUT_ROW}>
                                        <span style={INPUT_LABEL}>Reps:</span>
                                        <input
                                            type="number"
                                            style={INPUT_FIELD}
                                            value={ex.reps || ""}
                                            onChange={(e) => handleInputChange(ex.exercise_id, 'reps', e.target.value)}
                                        />
                                    </div>

                                    <div style={INPUT_ROW}>
                                        <span style={INPUT_LABEL}>Sets:</span>
                                        <input
                                            type="number"
                                            style={INPUT_FIELD}
                                            value={ex.sets || ""}
                                            onChange={(e) => handleInputChange(ex.exercise_id, 'sets', e.target.value)}
                                        />
                                    </div>

                                    <div style={INPUT_ROW}>
                                        <span style={INPUT_LABEL}>Weight:</span>
                                        <div style={{ position: "relative" }}>
                                            <input
                                                type="number"
                                                style={{...INPUT_FIELD, width: "200px"}}
                                                value={ex.weight || ""}
                                                onChange={(e) => handleInputChange(ex.exercise_id, 'weight', e.target.value)}
                                            />
                                            <span style={{ position: "absolute", right: "25px", top: "4px", color: "#000", fontWeight: "bold" }}>lbs</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Button Row at the bottom */}
                <div style={BUTTON_ROW}>
                    <button style={BACK_BTN} onClick={handleBack}>
                        Back
                    </button>
                    <button style={SAVE_BTN} onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}