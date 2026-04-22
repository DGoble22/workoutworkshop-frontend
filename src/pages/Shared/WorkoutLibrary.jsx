//imports
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { addDays, format } from "date-fns";

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

const WORKOUT_BTN = {
    width: "100%",
    backgroundColor: "#D9D9D9",
    border: "none",
    borderRadius: "15px",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#000",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
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

// Modal Styling
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

const MODAL_CONTENT = {
    backgroundColor: "#514E4A",
    color: "#fff",
    padding: "30px",
    borderRadius: "15px",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "80vh",
    overflowY: "auto",
    position: "relative",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
};

const MODAL_CLOSE_BTN = {
    position: "absolute",
    top: "15px",
    right: "20px",
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "1.5rem",
    fontWeight: "bold",
    cursor: "pointer"
};

const DESC_BOX = {
    backgroundColor: "#D9D9D9",
    color: "#000",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "10px",
    marginBottom: "20px",
    fontSize: "0.95rem",
    lineHeight: "1.4"
};

const EXERCISE_ROW = {
    backgroundColor: "#333",
    padding: "12px 15px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
};

export default function WorkoutLibrary() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // State
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [dbExercises, setDbExercises] = useState([]);
    const [selectedDay, setSelectedDay] = useState("Mon");

    // Fetch DB exercises on load to map names to IDs
    useEffect(() => {
        if (!user || !user.id) return;
        const fetchExercises = async () => {
            try {
                const apiBase = import.meta.env.VITE_API_URL || '';
                const response = await axios.get(`${apiBase}/api/workouts/exercises`);
                if (response.data && response.data.data) {
                    setDbExercises(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching database exercises.", error);
            }
        };
        fetchExercises();
    }, [user]);

    //Workouts with title, description, and exercises (name, sets, reps)
    const libraryData = [
        {
            id: 1,
            title: "Push Day",
            time: "Estimated Time: 45min - 1hr. ",
            description: "A push day will target the chest, triceps and shoulders. This workout focuses on pressing movements. ",
            exercises: [
                { name: "Bench Press", sets: 4, reps: 8 },
                { name: "Incline Dumbbell Press", sets: 3, reps: 10 },
                { name: "Overhead Press", sets: 3, reps: 8 },
                { name: "Tricep Pushdown", sets: 3, reps: 12 }
            ]
        },
        {
            id: 2,
            title: "Pull Day",
            time: "Estimated Time: 45min - 1hr. ",
            description: "A pull day will target the back, biceps, and forearms. This workout focuses on pulling movements.",
            exercises: [
                { name: "Deadlift", sets: 3, reps: 5 },
                { name: "Lat Pulldown", sets: 3, reps: 10 },
                { name: "Barbell Row", sets: 3, reps: 8 },
                { name: "Bicep Curls", sets: 4, reps: 12 }
            ]
        },
        {
            id: 3,
            title: "Leg Day",
            time: "Estimated Time: 45min - 1hr. ",
            description: "This workout will target all muscles on the lower body like the quads, hamstrings, glutes, and calves. It focuses on compound movements that engage multiple muscle groups.",
            exercises: [
                { name: "Barbell Squat", sets: 4, reps: 6 },
                { name: "Romanian Deadlift (RDL)", sets: 3, reps: 8 },
                { name: "Leg Press", sets: 3, reps: 10 },
                { name: "Calf Raises", sets: 4, reps: 15 }
            ]
        },
        {
            id: 4,
            title: "Upper Body Day",
            time: "Estimated Time: 1hr 15min - 1hr 30min. ",
            description: "This workout will work out every muscle in the upper body. It will be less sets for each exercise to limit fatigue. " +
                "This workout will target the chest, triceps, shoulders, back, biceps, and forearms. It focuses on compound movements that engage multiple muscle groups.",
            exercises: [
                { name: "Incline Dumbbell Press", sets: 2, reps: 6 },
                { name: "Chest Flies", sets: 2, reps: 8 },
                { name: "Overhead Tricep Extensions", sets: 3, reps: 10 },
                { name: "Lateral Raises", sets: 3, reps: 10 },
                { name: "Lat Pulldown", sets: 2, reps: 6 },
                { name: "Cable Row", sets: 2, reps: 8 },
                { name: "Preacher Curls", sets: 3, reps: 10 }
            ]
        }
    ];

    // Assign a workout to a day of the week
    const handleAssignWorkout = async () => {
        if (!user || !user.id) {
            toast.error("You must be logged in to save a workout.");
            return;
        }

        // Calculate the date for the selected day
        const daysArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const index = daysArray.indexOf(selectedDay);
        const today = new Date();
        const dayofweek = today.getDay();
        const difference = (index - dayofweek + 7) % 7;
        const wDay = addDays(today, difference);
        const formattedDate = format(wDay, "MM-dd-yyyy");

        // Map exercises from library to DB exercise IDs
        let missingExercises = [];
        const payloadExercises = selectedWorkout.exercises.map(libEx => {
            // Find matching exercise in DB by name
            const matchedDbEx = dbExercises.find(
                dbEx => dbEx.name.toLowerCase().trim() === libEx.name.toLowerCase().trim()
            );

            if (!matchedDbEx) {
                missingExercises.push(libEx.name);
            }

            return {
                exercise_id: matchedDbEx ? matchedDbEx.exercise_id : null,
                name: libEx.name,
                sets: libEx.sets,
                reps: libEx.reps,
                weight: 135
            };
        });

        // Fail-safe in case names don't match DB entries
        if (missingExercises.length > 0) {
            toast.error(`Error: Could not find these exercises in the database: ${missingExercises.join(", ")}`);
            return;
        }

        // Payload structure expected by backend
        const payload = {
            user_id: user.id,
            date: formattedDate,
            workout_name: selectedWorkout.title,
            exercises: payloadExercises
        };

        // Send paylos to backend
        try {
            const apiBase = import.meta.env.VITE_API_URL || '';
            await axios.post(`${apiBase}/api/workouts/save`, payload);
            toast.success(`${selectedWorkout.title} successfully added to ${selectedDay}!`);
            setSelectedWorkout(null);
        } catch (error) {
            console.error("Error assigning workout:", error);
            toast.error("Failed to assign workout. Please try again.");
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div style={PAGE_CONTAINER}>
            <h1 style={TITLE_STYLE}>Workout Library</h1>

            <div style={LIST_CONTAINER}>
                {/* Render the list of wide buttons */}
                {libraryData.map((workout) => (
                    <button
                        key={workout.id}
                        style={WORKOUT_BTN}
                        onClick={() => setSelectedWorkout(workout)}
                    >
                        <span>{workout.title}</span>
                        <span>›</span>
                    </button>
                ))}

                <button style={BACK_BTN} onClick={handleBack}>
                    Back
                </button>
            </div>

            {/* Workout Modal */}
            {selectedWorkout && (
                <div style={MODAL_OVERLAY} onClick={() => setSelectedWorkout(null)}>
                    <div style={MODAL_CONTENT} onClick={(e) => e.stopPropagation()}>
                        <button style={MODAL_CLOSE_BTN} onClick={() => setSelectedWorkout(null)}>
                            ×
                        </button>

                        <h2 style={{ marginTop: 0, paddingRight: "20px" }}>
                            {selectedWorkout.title}
                        </h2>

                        <h6 style={{ marginTop: 0, paddingRight: "20px", color: "#ccc" }}>
                            {selectedWorkout.time}
                        </h6>

                        <div style={DESC_BOX}>
                            {selectedWorkout.description}
                        </div>

                        <h3 style={{ borderBottom: "1px solid #777", paddingBottom: "5px" }}>
                            Exercises
                        </h3>

                        <div>
                            {selectedWorkout.exercises.map((ex, index) => (
                                <div key={index} style={EXERCISE_ROW}>
                                    <span style={{ fontWeight: "bold" }}>{ex.name}</span>
                                    <span>{ex.sets} Sets × {ex.reps} Reps</span>
                                </div>
                            ))}
                        </div>

                        {/* Assign workout bar */}
                        <div style={{ marginTop: "25px", display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#333", padding: "15px", borderRadius: "10px" }}>
                            <label htmlFor="daySelect" style={{ fontWeight: "bold" }}>Assign to:</label>

                            <select
                                id="daySelect"
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                                style={{ padding: "8px", borderRadius: "5px", border: "none", backgroundColor: "#D9D9D9", color: "#000", fontWeight: "bold", outline: "none", cursor: "pointer" }}
                            >
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>

                            <button
                                onClick={handleAssignWorkout}
                                style={{ marginLeft: "auto", padding: "10px 20px", backgroundColor: "#64E46C", color: "#000", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}
                            >
                                Add to Calendar
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}