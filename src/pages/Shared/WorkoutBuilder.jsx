import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import filter from "../../images/FilterButton.png";
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import ExerciseCard from "../../components/ExerciseCard";
import { addDays, format } from 'date-fns';
import { AuthContext } from '../../context/AuthContext';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Styling
const DOTWCARD_STYLES = {
    border: "1px solid #ffffff5a",
    flex: 1,
    margin: "0 5px",
    height: "75%",
    backgroundColor: "#2C2C2C",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    cursor: "pointer"
};

const FilterButton_Styles = {
    display: "flex",
    height: "45px",
    width: "45px",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
    background: "none",
    padding: 0,
    marginLeft: "10px"
};

const HEADERBUTTON_STYLES = {
    border: "none",
    height: "40px",
    padding: "0 20px",
    backgroundColor: "#D9D9D9",
    borderRadius: "15px",
    fontWeight: "bold",
    cursor: "pointer"
};

const APPLYBUTTON_STYLES = {
    border: "none",
    height: "40px",
    padding: "0 20px",
    backgroundColor: "#64E46C",
    borderRadius: "15px",
    fontWeight: "bold",
    cursor: "pointer"
};

const EXERCISECATEGORY_STYLES = {
    display: "flex",
    width: "90%",
    minHeight: "45px",
    backgroundColor: "#4D4343",
    borderRadius: "25px",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "15px",
    padding: "0 20px",
    color: "#ffffff",
    cursor: "pointer",
    flexShrink: 0
};

const EXERCISE_CARD_WRAPPER = {
    display: "flex",
    flexDirection: "column",
    width: "90%",
    backgroundColor: "#4D4343",
    borderRadius: "15px",
    marginTop: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
    flexShrink: 0
};

const EXERCISE_CARD_HEADER = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#BBAEAC",
    color: "#000000",
    padding: "8px 15px",
    fontWeight: "bold",
    fontSize: "1.1rem"
};

const ADD_BUTTON_STYLES = {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "none",
    borderRadius: "50%",
    width: "25px",
    height: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1.2rem",
    paddingBottom: "2px"
};

const EXERCISE_CARD_BODY = {
    padding: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "0.9rem",
    color: "#d9d9d9"
};

const CREATE_WORKOUT_BTN = {
    backgroundColor: "#2C2C2C",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "fit-content",
    marginTop: "auto"
};

// Confirm Modal Styling
const MODAL_OVERLAY = {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
};

const CONFIRM_MODAL_CONTENT = {
    backgroundColor: "#333",
    color: "#fff",
    padding: "25px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "350px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.8)",
    zIndex: 1010
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

const NO_BTN = {
    backgroundColor: "#D9D9D9",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontWeight: "bold",
    cursor: "pointer",
    flex: 1
};

// Main Component
export default function WorkoutBuilder() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // State variables
    const [exercises, setExercises] = useState([]);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [workoutPlan, setWorkoutPlan] = useState([]);
    const [filterType, setFilterType] = useState("Muscle Group");

    const [manage, setManage] = useState(false);
    const [apply, setApply] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [workoutName, setWorkoutName] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);

    const [showOverwriteModal, setShowOverwriteModal] = useState(false);
    const [existingPlanId, setExistingPlanId] = useState(null);

    let initialdate = useLocation();

    // Grab exercises from the Flask backend when component mounts
    useEffect(() => {
        if (!user || !user.id) return;
        const fetchExercises = async () => {
            try {
                const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
                const response = await axios.get(`${apiBase}/api/workouts/exercises`);

                if (response.data && response.data.data) {
                    setExercises(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching exercises.", error);
            }
        };

        fetchExercises();
        findDate(initialdate.state.day);

    }, [user, initialdate.state.day]);

    // Group exercises dynamically based on filterType
    const groupedExercises = exercises.reduce((groups, exercise) => {
        let group = "Other";
        if (filterType === "Muscle Group") {
            group = exercise.muscle_group || "Other";
        } else if (filterType === "Equipment") {
            group = exercise.equipment_needed || "Bodyweight";
        }

        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(exercise);
        return groups;
    }, {});

    const toggleCategory = (category) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    const addToWorkout = (exercise) => {
        setWorkoutPlan([...workoutPlan, exercise]);
    };

    const removeFromWorkout = async (indexToRemove, exercise_id, plan_id) => {
        if (!plan_id) {
            setWorkoutPlan(workoutPlan.filter((_, index) => index !== indexToRemove));
            return;
        }

        let data = {
            "plan_id": plan_id,
            "exercise_id": exercise_id
        };

        try {
            const apiBase = import.meta.env.VITE_API_URL || '';
            const url = `${apiBase}/api/workouts/remove`;

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setWorkoutPlan(workoutPlan.filter((_, index) => index !== indexToRemove));
            } else {
                toast.error("Failed to remove workout");
            }
        } catch (error) {
            console.error("Error removing exercise:", error);
        }
    };

    const handleUpdateExercise = (indexToUpdate, field, value) => {
        setWorkoutPlan((prevPlan) =>
            prevPlan.map((ex, index) => {
                if (index === indexToUpdate) {
                    return { ...ex, [field]: value };
                }
                return ex;
            })
        );
    };

    const handleManage = () => {
        if (manage) {
            setApply(true);
            setTimeout(() => { setApply(false) }, 1500);
            setManage(false);
        } else {
            setManage(true);
        }
    };

    const findDate = (day) => {
        let index = -1;
        switch (day) {
            case 'Sun': index = 0; break;
            case 'Mon': index = 1; break;
            case 'Tue': index = 2; break;
            case 'Wed': index = 3; break;
            case 'Thu': index = 4; break;
            case 'Fri': index = 5; break;
            case 'Sat': index = 6; break;
            default: console.log("error with retrieving index");
        }

        let today = new Date();
        let dayofweek = today.getDay();
        let difference = (index - dayofweek + 7) % 7;
        let wDay = addDays(today, difference);
        wDay = format(wDay, "MM-dd-yyyy");

        setSelectedDate(wDay);

        const apiBase = import.meta.env.VITE_API_URL || '';
        axios.get(`${apiBase}/api/workouts/daily-plan/${user.id}/${wDay}`)
            .then(res => { setWorkoutPlan(res.data["data"]); })
            .catch(err => console.log(err));
    };

    // Initiate save by checking if a workout already exists for that day
    const handleInitiateSave = async () => {
        if (!selectedDate) {
            toast.error("Please select a day of the week first!");
            return;
        }
        if (workoutPlan.length === 0) {
            toast.error("Please add some exercises to your workout!");
            return;
        }

        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
            const checkResponse = await axios.get(`${apiBase}/api/workouts/daily-plan/${user.id}/${selectedDate}`);

            // If a workout exists, open the overwrite modal
            if (checkResponse.data.hasPlan) {
                setExistingPlanId(checkResponse.data.data[0].plan_id);
                setShowOverwriteModal(true);
            } else {
                // If no workout exists, go straight to naming it
                setExistingPlanId(null);
                setShowModal(true);
            }
        } catch (error) {
            console.error("Error checking plan:", error);
            toast.error("Failed to check daily plan.");
        }
    };

    // User confirms they want to overwrite
    const handleConfirmOverwrite = () => {
        setShowOverwriteModal(false);
        setShowModal(true);
    };

    // Saving workout
    const handleSaveWorkout = async () => {
        if (!workoutName.trim()) {
            toast.error("Please enter a workout name.");
            return;
        }

        const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

        try {
            // If they agreed to overwrite, delete the old plan first before saving the new one
            if (existingPlanId) {
                await fetch(`${apiBase}/api/workouts/plan/${existingPlanId}`, {
                    method: 'DELETE'
                });
            }

            const payload = {
                user_id: user.id,
                date: selectedDate,
                workout_name: workoutName,
                exercises: workoutPlan
            };

            await axios.post(`${apiBase}/api/workouts/save`, payload);
            toast.success("Workout saved successfully!");

            // Close modals and reset states
            setShowModal(false);
            setWorkoutName("");
            setExistingPlanId(null);

        } catch (error) {
            console.error("Error saving workout", error);
            toast.error("Failed to save workout.");
        }
    };

    return (
        <div style={{ display: "flex", width: "100%", height: "calc(100vh - 65px)", flexDirection: "column", overflow: "hidden" }}>

            {/* Days of the week */}
            <div style={{ display: "flex", width: "100%", height: "15%", backgroundColor: "#a3a1a1", alignItems: "center", padding: "0 10px" }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => {
                    let today = new Date();
                    let dayofweek = today.getDay();
                    let difference = (index - dayofweek + 7) % 7;
                    let wDay = addDays(today, difference);
                    let formattedDate = format(wDay, "MM-dd");

                    const isActive = day === initialdate.state?.day;

                    const dynamicStyle = {
                        ...DOTWCARD_STYLES,
                        height: isActive ? "95%" : "75%",
                        transition: "all 0.2s ease-in-out",
                        backgroundColor: isActive ? "#4a4a4a" : "#2C2C2C",
                        boxShadow: isActive ? "0 4px 8px rgba(0,0,0,0.4)" : "none"
                    };
                    return (
                        <button
                            id={`btn-${day}`}
                            onClick={() => { navigate(`/workout-builder/${day}`, { state: { "day": day } }) }}
                            key={day}
                            style={dynamicStyle}
                        >
                            <span style={{ fontSize: "1.1rem" }}>{day}</span>
                            <span style={{ fontSize: "0.8rem", color: "#aaaaaa", marginTop: "4px" }}>{formattedDate}</span>
                        </button>
                    )
                })}
            </div>

            <div style={{ display: "flex", flex: 1, width: "100%", overflow: "hidden" }}>

                {/* Find Workouts */}
                <div style={{ display: "flex", width: "35%", backgroundColor: "#a3a1a1", flexDirection: "column", padding: "10px 0" }}>
                    <div style={{ display: "flex", width: "90%", margin: "0 auto 10px auto", alignItems: "center", justifyContent: "flex-end" }}>
                        <span style={{ color: "#4D4343", fontSize: "1.2rem", marginRight: "10px" }}>
                            Filter: {filterType}
                        </span>

                        <Dropdown>
                            <Dropdown.Toggle style={FilterButton_Styles} variant="success" id="dropdown-basic">
                                <Image src={filter} alt="filter" style={{ height: "100%", width: "100%", objectFit: "contain" }} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item id="muscle-group" onClick={() => {
                                    setFilterType("Muscle Group");
                                    setExpandedCategory(null);
                                }}>
                                    Muscle Group
                                </Dropdown.Item>

                                <Dropdown.Item id="equipment" onClick={() => {
                                    setFilterType("Equipment");
                                    setExpandedCategory(null);
                                }}>
                                    Equipment
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div style={{ display: "flex", flex: 1, width: "100%", flexDirection: "column", alignItems: "center", overflowY: "auto", paddingBottom: "20px" }}>
                        {Object.keys(groupedExercises).map(category => (
                            <React.Fragment key={category}>
                                <div id={`dropdown-${category}`}style={EXERCISECATEGORY_STYLES} onClick={() => toggleCategory(category)}>
                                    <div style={{ fontWeight: "bold" }}>{category}</div>
                                    <div>{expandedCategory === category ? "Λ" : "V"}</div>
                                </div>

                                {expandedCategory === category && groupedExercises[category]?.map(exercise => (
                                    <div key={exercise.exercise_id} style={EXERCISE_CARD_WRAPPER}>
                                        <div style={EXERCISE_CARD_HEADER}>
                                            <span>{exercise.name}</span>
                                            <button
                                                id={`add-${exercise.name}`}
                                                style={ADD_BUTTON_STYLES}
                                                onClick={() => addToWorkout(exercise)}
                                                title="Add to workout"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div style={EXERCISE_CARD_BODY}>
                                            <span>Equipment: {exercise.equipment_needed || "None"}</span>
                                        </div>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}

                        {Object.keys(groupedExercises).length === 0 && (
                            <div style={{ color: "#4D4343", marginTop: "20px", textAlign: "center", width: "80%" }}>
                                Loading exercises
                            </div>
                        )}
                    </div>
                </div>

                {/* Manage Workouts */}
                <div style={{ display: "flex", flex: 1, flexDirection: "column", overflow: "hidden" }}>
                    <div style={{ display: "flex", width: "100%", height: "10%", backgroundColor: "#711A19", alignItems: "center", justifyContent: "flex-end", paddingRight: "20px", gap: "15px" }}>
                        {!manage ? <button id="manage" onClick={() => handleManage()} style={HEADERBUTTON_STYLES}>Manage</button> : <button id="apply" onClick={() => handleManage()} style={APPLYBUTTON_STYLES}>Apply</button>}
                    </div>

                    <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {workoutPlan.length === 0 ? (
                            <p style={{ color: "#aaa", textAlign: "center", marginTop: "20px" }}>No exercises added yet.</p>
                        ) : (
                            workoutPlan.map((exercise, index) => (
                                <ExerciseCard
                                    key={index}
                                    name={exercise.name}
                                    equipment={exercise.equipment_needed}
                                    URL={exercise.video_url}
                                    manage={manage}
                                    reps={exercise.reps}
                                    sets={exercise.sets}
                                    weight={exercise.weight}
                                    plan_id={exercise.plan_id}
                                    exercise_id={exercise.exercise_id}
                                    apply={apply}
                                    thumbnail={exercise.thumbnail}
                                    handleDelete={() => removeFromWorkout(index, exercise.exercise_id, exercise.plan_id)}
                                    handleUpdate={(field, value) => handleUpdateExercise(index, field, value)}
                                />
                            ))
                        )}
                    </div>

                    <div style={{ padding: "20px", display: "flex", justifyContent: "flex-start", backgroundColor: "#D9D9D9" }}>
                        {/* Update the onClick to handleInitiateSave instead of opening Name modal directly */}
                        <button id="create-workout" style={CREATE_WORKOUT_BTN} onClick={handleInitiateSave}>Create Workout</button>
                    </div>
                </div>

                {/* Overwrite Confirm Modal */}
                {showOverwriteModal && (
                    <div style={MODAL_OVERLAY}>
                        <div style={CONFIRM_MODAL_CONTENT}>
                            <h3 style={{ marginTop: 0 }}>Overwrite Workout?</h3>
                            <p style={{ fontSize: "1rem", lineHeight: "1.4", color: "#ccc" }}>
                                A workout already exists for <strong>{initialdate.state?.day}</strong>.
                                Are you sure you want to overwrite it?
                            </p>
                            <div style={CONFIRM_BTN_GROUP}>
                                <button id="cancel-overwrite" style={NO_BTN} onClick={() => {
                                    setShowOverwriteModal(false);
                                    setExistingPlanId(null);
                                }}>
                                    Cancel
                                </button>
                                <button id="overwrite" style={YES_BTN} onClick={handleConfirmOverwrite}>
                                    Yes, Overwrite
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Name workout modal */}
                {showModal && (
                    <div style={MODAL_OVERLAY}>
                        <div style={{ backgroundColor: "#514E4A", padding: "30px", borderRadius: "15px", width: "350px", color: "#fff", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>

                            <h3 style={{ margin: 0, textAlign: "center" }}>Name Your Workout</h3>

                            <input
                                id="workout-name"
                                type="text"
                                maxLength="20"
                                value={workoutName}
                                onChange={(e) => setWorkoutName(e.target.value)}
                                placeholder="e.g., Upper Body"
                                style={{ padding: "12px", borderRadius: "8px", border: "none", outline: "none", backgroundColor: "#D9D9D9", color: "#000", fontSize: "1rem" }}
                            />

                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                                <button id="cancel-save-workout" onClick={() => {
                                    setShowModal(false);
                                    setExistingPlanId(null);
                                }} style={{ padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: "#a3a1a1", fontWeight: "bold" }}>Cancel</button>
                                <button id="save-workout" onClick={handleSaveWorkout} style={{ padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: "#711A19", color: "#fff", fontWeight: "bold" }}>Save Workout</button>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}