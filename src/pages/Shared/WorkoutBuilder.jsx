import React, { useState, useEffect } from "react";
import axios from 'axios';
import filter from "../../images/FilterButton.png";
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';

// Styling
const DOTWCARD_STYLES = {
    border: "1px solid #ffffff5a",
    flex: 1,
    margin: "0 5px",
    height: "75%",
    backgroundColor: "#2C2C2C",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    cursor: "pointer"
};

const SEARCHBAR_STYLES = {
    flex: 1,
    border: "none",
    outline: "none",
    height: "45px",
    borderRadius: "50px",
    backgroundColor: "#d9d9d99b",
    paddingLeft: "15px",
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
    cursor: "pointer"
};

const EXERCISE_CARD_WRAPPER = {
    display: "flex",
    flexDirection: "column",
    width: "90%",
    backgroundColor: "#4D4343",
    borderRadius: "15px",
    marginTop: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
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

// Main Component
export default function WorkoutBuilder() {
    //State variables
    const [exercises, setExercises] = useState([]);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [workoutPlan, setWorkoutPlan] = useState([]);

    // Grab exercises from the Flask backend when component mounts
    useEffect(() => {
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
    }, []);

    //Group exercises by muscle group
    const groupedExercises = exercises.reduce((groups, exercise) => {
        const group = exercise.muscle_group;
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(exercise);
        return groups;
    }, {});

    //Expand category, close if same category is clicked again
    const toggleCategory = (category) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    //Search bar, doesn't work yet
    const handleSearch = (e) => {
        console.log("Searching for:", e.target.value);
    };

    //Add exercise to work out
    const addToWorkout = (exercise) => {
        setWorkoutPlan([...workoutPlan, exercise]);
    };

    //Remove exercise from workout
    const removeFromWorkout = (indexToRemove) => {
        setWorkoutPlan(workoutPlan.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div style={{ display: "flex", width: "100%", height: "calc(100vh - 65px)", flexDirection: "column", overflow: "hidden" }}>

            {/* Days of the week */}
            <div style={{ display: "flex", width: "100%", height: "15%", backgroundColor: "#a3a1a1", alignItems: "center", padding: "0 10px" }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <button key={day} style={DOTWCARD_STYLES}>{day}</button>
                ))}
            </div>

            <div style={{ display: "flex", flex: 1, width: "100%", overflow: "hidden" }}>

                {/* Find Workouts */}
                <div style={{ display: "flex", width: "35%", backgroundColor: "#a3a1a1", flexDirection: "column", padding: "10px 0" }}>

                    {/* Search Bar */}
                    <div style={{ display: "flex", width: "90%", margin: "0 auto 10px auto", alignItems: "center" }}>
                        <input type="text" placeholder="Search..." style={SEARCHBAR_STYLES} onChange={handleSearch}/>
                        <Dropdown>
                            <Dropdown.Toggle style={FilterButton_Styles} variant="success" id="dropdown-basic">
                                <Image src={filter} alt="filter" style={{height: "100%", width: "100%", objectFit: "contain"}}/>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {/* Adds exercises from database */}
                                {Object.keys(groupedExercises).map(group => (
                                    <Dropdown.Item key={group}>{group}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    {/* Categories Scroll */}
                    <div style={{ display: "flex", flex: 1, width: "100%", flexDirection: "column", alignItems: "center", overflowY: "auto", paddingBottom: "20px" }}>

                        {Object.keys(groupedExercises).map(category => (
                            <React.Fragment key={category}>
                                {/* Category Header */}
                                <div style={EXERCISECATEGORY_STYLES} onClick={() => toggleCategory(category)}>
                                    <div style={{ fontWeight: "bold" }}>{category}</div>
                                    <div>{expandedCategory === category ? "Λ" : "V"}</div>
                                </div>

                                {/* Exercises in category */}
                                {expandedCategory === category && groupedExercises[category]?.map(exercise => (
                                    <div key={exercise.exercise_id} style={EXERCISE_CARD_WRAPPER}>

                                        {/* Card Header: Name and + Button */}
                                        <div style={EXERCISE_CARD_HEADER}>
                                            <span>{exercise.name}</span>
                                            <button
                                                style={ADD_BUTTON_STYLES}
                                                onClick={() => addToWorkout(exercise)}
                                                title="Add to workout"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Equipment Needed */}
                                        <div style={EXERCISE_CARD_BODY}>
                                            <span>Equipment: {exercise.equipment_needed || "None"}</span>
                                        </div>

                                    </div>
                                ))}
                            </React.Fragment>
                        ))}

                        {/* While exercises are being queried */}
                        {Object.keys(groupedExercises).length === 0 && (
                            <div style={{ color: "#4D4343", marginTop: "20px", textAlign: "center", width: "80%" }}>
                                Loading exercises
                            </div>
                        )}
                    </div>
                </div>

                {/* Manage Workouts */}
                <div style={{ display: "flex", flex: 1, flexDirection: "column", overflow: "hidden" }}>

                    {/* Right Side Header */}
                    <div style={{ display: "flex", width: "100%", height: "10%", backgroundColor: "#711A19", alignItems: "center", justifyContent: "flex-end", paddingRight: "20px", gap: "15px" }}>
                        <button style={HEADERBUTTON_STYLES}>Manage</button>
                        <button style={HEADERBUTTON_STYLES}>Add Group</button>
                    </div>

                    {/* Built Workout */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>

                        {workoutPlan.length === 0 ? (
                            <p style={{ color: "#aaa", textAlign: "center", marginTop: "20px" }}>No exercises added yet.</p>
                        ) : (
                            workoutPlan.map((exercise, index) => (
                                <div key={index} style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#D9D9D9", padding: "15px", borderRadius: "10px", alignItems: "center" }}>
                                    <div>
                                        <strong style={{ fontSize: "1.2rem" }}>{exercise.name}</strong>
                                        <div style={{ fontSize: "0.9rem", color: "#555" }}>{exercise.muscle_group} | {exercise.equipment_needed}</div>
                                    </div>
                                    <button
                                        onClick={() => removeFromWorkout(index)}
                                        style={{ backgroundColor: "#711A19", color: "white", border: "none", borderRadius: "5px", padding: "8px 15px", cursor: "pointer" }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}