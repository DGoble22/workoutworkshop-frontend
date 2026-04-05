import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

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
    const [savedWorkouts, setSavedWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        //Don't allow the call if the user isn't created yet
        if (!user || !user.id) return;
        const fetchWorkouts = async () => {
            try {
                const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
                const response = await axios.get(`${apiBase}/api/workouts/log/${user.id}`);
                if (response.data.status === 'success') {
                    setSavedWorkouts(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching workout log:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkouts();
    }, [user]);

    const handleEdit = (id, date, title) => {
        navigate(`/workout-edit/${id}`, { state: { date, title } });
    };

    const handleRemove = async (id) => {
        //This window.confirm should be changed at some point to a custom modal.
        const confirmDelete = window.confirm("Are you sure you want to delete this workout?");
        if (!confirmDelete) return;

        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
            const response = await axios.delete(`${apiBase}/api/workouts/log/${id}`);

            if (response.data.status === 'success') {
                setSavedWorkouts((prevWorkouts) =>
                    prevWorkouts.filter((workout) => workout.id !== id)
                );
            }
        } catch (error) {
            console.error("Error deleting workout:", error);
            toast.error("Failed to delete workout. Check the console.");
        }
    };

    const handleBack = () => {
        navigate(-1) //goes back one page
    };

    return (
        <div style={PAGE_CONTAINER}>
            <h1 style={TITLE_STYLE}>Workout Log</h1>

            <div style={LIST_CONTAINER}>
                {loading ? (
                    <p style={{ textAlign: "center", fontSize: "1.2rem" }}>Loading workouts...</p>
                ) : savedWorkouts.length === 0 ? (
                    <p style={{ textAlign: "center", fontSize: "1.2rem" }}>No workouts saved yet.</p>
                ) : (
                    savedWorkouts.map((workout) => (
                        <div key={workout.id} style={ROW_STYLE}>
                            {/* "Date - Workout Title" */}
                            <div style={LOG_BOX}>
                                {workout.date} | {workout.title}
                            </div>

                            <button style={EDIT_BTN} onClick={() => handleEdit(workout.id, workout.date, workout.title)}>
                                Edit
                            </button>
                            <button style={REMOVE_BTN} onClick={() => handleRemove(workout.id)}>
                                Remove
                            </button>
                        </div>
                    ))
                )}

                <button style={BACK_BTN} onClick={handleBack}>
                    Back
                </button>
            </div>
        </div>
    );
}