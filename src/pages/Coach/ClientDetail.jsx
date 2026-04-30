import React, { useState, useEffect, useCallback } from "react"
import Image from "react-bootstrap/Image"
import DefaultProfilePic from "../../images/defaultProfile.jpg"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const PAGE_STYLES = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
    paddingBottom: "40px"
}

const CLIENT_CARD_STYLES = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    backgroundColor: "#ffffff",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "20px"
}

const PLAN_CARD_STYLES = {
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginBottom: "16px",
    overflow: "hidden"
}

const PLAN_HEADER_STYLES = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 18px",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ccc",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer"
}

const TABLE_STYLES = {
    width: "100%",
    borderCollapse: "collapse"
}

const TH_STYLES = {
    padding: "8px 12px",
    textAlign: "left",
    backgroundColor: "#fafafa",
    borderBottom: "1px solid #eee",
    fontWeight: "600",
    fontSize: "0.85rem",
    color: "#555"
}

const TD_STYLES = {
    padding: "8px 12px",
    borderBottom: "1px solid #eee",
    fontSize: "0.9rem"
}

const INPUT_STYLES = {
    width: "60px",
    padding: "4px 6px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "0.85rem",
    textAlign: "center"
}

const SAVE_BTN_STYLES = {
    backgroundColor: "#711A19",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "6px 14px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.85rem"
}

const DELETE_BTN_STYLES = {
    backgroundColor: "#2C2C2C",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "6px 14px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.85rem"
}

const ADD_EXERCISE_BTN_STYLES = {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px",
    border: "none",
    borderTop: "1px solid #eee",
    backgroundColor: "#f5f5f5",
    cursor: "pointer",
    color: "#711A19",
    fontWeight: "600",
    fontSize: "0.9rem"
}

const MODAL_OVERLAY_STYLES = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
}

const MODAL_STYLES = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "24px",
    width: "500px",
    maxHeight: "500px",
    overflowY: "auto"
}

const FIELD_STYLES = {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
    fontSize: "0.95rem"
}

function ExercisePickerModal({ exercises, onSelect, onClose }) {
    const [search, setSearch] = useState("")
    const filtered = exercises.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div style={MODAL_OVERLAY_STYLES} onClick={onClose}>
            <div style={MODAL_STYLES} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <h5 style={{ margin: 0, fontWeight: "700" }}>Add Exercise</h5>
                    <button id="add-exercisepicker" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: "1.2rem" }}>✕</button>
                </div>
                <input
                    id="search-exercise"
                    type="text"
                    placeholder="Search exercises..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ ...FIELD_STYLES, marginBottom: "12px" }}
                />
                {filtered.map(ex => (
                    <div
                        id={`select-${ex.name}`}
                        key={ex.exercise_id}
                        onClick={() => onSelect(ex)}
                        style={{ padding: "10px 12px", borderBottom: "1px solid #eee", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                        <span>{ex.name}</span>
                        <span style={{ color: "#888", fontSize: "0.8rem" }}>{ex.muscle_group}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function CreatePlanModal({ exercises, userId, apiBase, onCreated, onClose }) {
    const [date, setDate] = useState("")
    const [title, setTitle] = useState("")
    const [creating, setCreating] = useState(false)

    async function handleCreate() {
        if (!date || !title) return alert("Please fill in all fields.")
        if (exercises.length === 0) return alert("No exercises available.")

        setCreating(true)
        try {
            const [year, month, day] = date.split("-")
            const formattedDate = `${month}-${day}-${year}`

            const res = await fetch(`${apiBase}/api/workouts/add-workout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planned_date: formattedDate,
                    exercise_id: exercises[0].exercise_id,
                    user_id: userId
                })
            })
            const data = await res.json()
            console.log("Create response:", data)
            onCreated(title)
        } catch (e) {
            console.error("Failed to create plan:", e)
            alert("Failed to create plan.")
        } finally {
            setCreating(false)
        }
    }

    return (
        <div style={MODAL_OVERLAY_STYLES} onClick={onClose}>
            <div style={{ ...MODAL_STYLES, maxHeight: "350px" }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <h5 style={{ margin: 0, fontWeight: "700" }}>Create New Workout Plan</h5>
                    <button id="creat-plan-close" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: "1.2rem" }}>✕</button>
                </div>
                <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "0.9rem" }}>Plan Title</label>
                    <input
                        id="createplan-title"
                        type="text"
                        placeholder="e.g. Chest Day"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        style={FIELD_STYLES}
                    />
                </div>
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "0.9rem" }}>Date</label>
                    <input
                        id="createplan-date"
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        style={FIELD_STYLES}
                    />
                </div>
                <button
                    id="createplan-submit"
                    style={{ ...SAVE_BTN_STYLES, width: "100%", padding: "10px" }}
                    onClick={handleCreate}
                    disabled={creating}
                >
                    {creating ? "Creating..." : "Create Plan"}
                </button>
            </div>
        </div>
    )
}

function WorkoutPlan({ plan, exercises, planDetails, onUpdate, onSave, onAddExercise, onRemove, onDeletePlan }) {
    const [open, setOpen] = useState(false)
    const [showPicker, setShowPicker] = useState(false)

    return (
        <div style={PLAN_CARD_STYLES}>
            <div id={`open-${plan.title}`} style={PLAN_HEADER_STYLES} onClick={() => setOpen(o => !o)}>
                <span>{open ? "▾" : "▸"} {plan.title} — {plan.date}</span>
                {open && (
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button
                            id={`delete-${plan.title}`}
                            style={DELETE_BTN_STYLES}
                            onClick={e => {
                                e.stopPropagation();
                                const confirmed = window.confirm("Are you sure you want to delete this plan?");
                                if (confirmed) {
                                    onDeletePlan(plan.id);
                                }
                            }}
                        >
                            Delete Plan
                        </button>
                        <button
                            id={`save-${plan.title}`}
                            style={SAVE_BTN_STYLES}
                            onClick={e => { e.stopPropagation(); onSave(plan.id) }}
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            {open && (
                <>
                    <table style={TABLE_STYLES}>
                        <thead>
                        <tr>
                            <th style={TH_STYLES}>Exercise</th>
                            <th style={TH_STYLES}>Sets</th>
                            <th style={TH_STYLES}>Reps</th>
                            <th style={TH_STYLES}>Weight</th>
                            <th style={TH_STYLES}></th>
                        </tr>
                        </thead>
                        <tbody>
                        {planDetails && planDetails.length > 0 ? (
                            planDetails.map(ex => (
                                <tr key={ex.exercise_id}>
                                    <td style={TD_STYLES}>{ex.exercise_name}</td>
                                    <td style={TD_STYLES}>
                                        <input
                                            id={`sets-${ex.exercise_name}`}
                                            style={INPUT_STYLES}
                                            type="number"
                                            value={ex.sets || ""}
                                            onChange={e => onUpdate(plan.id, ex.exercise_id, "sets", e.target.value)}
                                        />
                                    </td>
                                    <td style={TD_STYLES}>
                                        <input
                                            id={`reps-${ex.exercise_name}`}
                                            style={INPUT_STYLES}
                                            type="number"
                                            value={ex.reps || ""}
                                            onChange={e => onUpdate(plan.id, ex.exercise_id, "reps", e.target.value)}
                                        />
                                    </td>
                                    <td style={TD_STYLES}>
                                        <input
                                            id={`weight-${ex.exercise_name}`}
                                            style={INPUT_STYLES}
                                            type="number"
                                            value={ex.weight || ""}
                                            onChange={e => onUpdate(plan.id, ex.exercise_id, "weight", e.target.value)}
                                        />
                                    </td>
                                    <td style={TD_STYLES}>
                                        <button
                                            id={`remove-${ex.exercise_name}`}
                                            onClick={() => onRemove(plan.id, ex.exercise_id)}
                                            style={{ background: "none", border: "none", cursor: "pointer", color: "#711A19", fontWeight: "700" }}
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ ...TD_STYLES, color: "#888", textAlign: "center" }}>No exercises yet.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <button id="add-exercise" style={ADD_EXERCISE_BTN_STYLES} onClick={() => setShowPicker(true)}>
                        + Add Exercise
                    </button>
                </>
            )}

            {showPicker && (
                <ExercisePickerModal
                    exercises={exercises}
                    onSelect={ex => { onAddExercise(plan.id, plan.date, ex); setShowPicker(false) }}
                    onClose={() => setShowPicker(false)}
                />
            )}
        </div>
    )
}

export default function ClientDetail({ client, onBack }) {
    const [workoutLog, setWorkoutLog] = useState([])
    const [planDetails, setPlanDetails] = useState({})
    const [exercises, setExercises] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreatePlan, setShowCreatePlan] = useState(false)

    // New state variables for progress metrics
    const [graphType, setGraphType] = useState("Weight")
    const [weightLogs, setWeightLogs] = useState([])
    const [workoutStats, setWorkoutStats] = useState([])
    const [calorieLogs, setCalorieLogs] = useState([])
    const [surveyLogs, setSurveyLogs] = useState([])

    const apiBase = import.meta.env.VITE_API_URL || ""

    const refreshData = useCallback(async () => {
        try {
            const logRes = await fetch(`${apiBase}/api/workouts/log/${client.user_id}`)
            const logData = await logRes.json()
            if (logData.status === "success") {
                setWorkoutLog(logData.data)
                for (const plan of logData.data) {
                    const detailRes = await fetch(`${apiBase}/api/workouts/plan/${plan.id}`)
                    const detailData = await detailRes.json()
                    if (detailData.status === "success") {
                        setPlanDetails(prev => ({ ...prev, [plan.id]: detailData.data }))
                    }
                }
            }
        } catch (e) {
            console.error("Failed to refresh data:", e)
        }
    }, [client.user_id, apiBase])

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch Workout Data
                const [logRes, exRes] = await Promise.all([
                    fetch(`${apiBase}/api/workouts/log/${client.user_id}`),
                    fetch(`${apiBase}/api/workouts/exercises`)
                ])
                const logData = await logRes.json()
                const exData = await exRes.json()

                if (logData.status === "success") {
                    setWorkoutLog(logData.data)
                    for (const plan of logData.data) {
                        const detailRes = await fetch(`${apiBase}/api/workouts/plan/${plan.id}`)
                        const detailData = await detailRes.json()
                        if (detailData.status === "success") {
                            setPlanDetails(prev => ({ ...prev, [plan.id]: detailData.data }))
                        }
                    }
                }
                if (exData.status === "success") setExercises(exData.data)

                // Get graph metrics for weight
                fetch(`${apiBase}/user/weight-log/${client.user_id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.data) {
                            const formatted = data.data.map(log => ({
                                date: new Date(log.log_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                                weight: log.weight
                            }));
                            setWeightLogs(formatted);
                        }
                    }).catch(e => console.error(e));

                // Get graph metrics for weekly workouts
                fetch(`${apiBase}/api/workouts/weekly-stats/${client.user_id}`)
                    .then(res => res.json())
                    .then(data => data.status === 'success' && setWorkoutStats(data.data))
                    .catch(e => console.error(e));

                // Get graph metrics for daily calorie intake
                fetch(`${apiBase}/user/calorie-log/${client.user_id}`)
                    .then(res => res.json())
                    .then(data => data.status === 'success' && setCalorieLogs(data.data))
                    .catch(e => console.error(e));

                // Get graph metrics for daily surveys
                fetch(`${apiBase}/user/survey-log/${client.user_id}`)
                    .then(res => res.json())
                    .then(data => data.status === 'success' && setSurveyLogs(data.data))
                    .catch(e => console.error(e));

            } catch (e) {
                console.error("Failed to load data:", e)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [client.user_id, apiBase])

    function handleUpdate(plan_id, exercise_id, field, value) {
        setPlanDetails(prev => ({
            ...prev,
            [plan_id]: prev[plan_id].map(ex =>
                ex.exercise_id === exercise_id ? { ...ex, [field]: value } : ex
            )
        }))
    }

    async function handleSave(plan_id) {
        const exs = planDetails[plan_id]
        if (!exs) return
        try {
            const res = await fetch(`${apiBase}/api/workouts/plan/${plan_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ exercises: exs })
            })
            const data = await res.json()
            if (data.status === "success") alert("Workout saved!")
        } catch (e) {
            console.error("Failed to save:", e)
        }
    }

    async function handleAddExercise(plan_id, planned_date, exercise) {
        try {
            const res = await fetch(`${apiBase}/api/workouts/add-workout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planned_date,
                    exercise_id: exercise.exercise_id,
                    user_id: client.user_id
                })
            })
            const data = await res.json()
            console.log("Add exercise response:", data)
            setPlanDetails(prev => ({
                ...prev,
                [plan_id]: [...(prev[plan_id] || []), {
                    exercise_id: exercise.exercise_id,
                    exercise_name: exercise.name,
                    sets: 0,
                    reps: 0,
                    weight: 0
                }]
            }))
        } catch (e) {
            console.error("Failed to add exercise:", e)
        }
    }

    async function handleRemove(plan_id, exercise_id) {
        try {
            const res = await fetch(`${apiBase}/api/workouts/plan/${plan_id}/exercise/${exercise_id}`, {
                method: "DELETE"
            })
            const data = await res.json()
            if (data.status === "success") {
                setPlanDetails(prev => ({
                    ...prev,
                    [plan_id]: prev[plan_id].filter(ex => ex.exercise_id !== exercise_id)
                }))
            }
        } catch (e) {
            console.error("Failed to remove:", e)
        }
    }

    async function handleDeletePlan(plan_id) {
        try {
            const res = await fetch(`${apiBase}/coach/delete-plan/${plan_id}`, {
                method: "DELETE"
            })
            const data = await res.json()
            if (data.status === "success") {
                setWorkoutLog(prev => prev.filter(p => p.id !== plan_id))
                setPlanDetails(prev => {
                    const next = { ...prev }
                    delete next[plan_id]
                    return next
                })
            }
        } catch (e) {
            console.error("Failed to delete plan:", e)
        }
    }

    if (loading) return <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>

    return (
        <div style={PAGE_STYLES}>
            <div style={{ marginBottom: "20px" }}>
                {onBack && (
                    <button id="back-to-dash" onClick={onBack} style={{ background: "none", border: "none", color: "#711A19", cursor: "pointer", fontWeight: "600" }}>
                        ← Back to Dashboard
                    </button>
                )}
            </div>

            <div style={CLIENT_CARD_STYLES}>
                <Image
                    src={client.profile_picture_url || DefaultProfilePic}
                    roundedCircle
                    style={{ width: "70px", height: "70px", objectFit: "cover" }}
                />
                <div>
                    <h4 style={{ margin: 0, fontWeight: "800" }}>{client.first_name} {client.last_name}</h4>
                    <p style={{ margin: 0, color: "#666" }}>Goal: {client.goal_type}</p>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h5 style={{ fontWeight: "700", margin: 0 }}>Workout Plans</h5>
                <button id="create-plan" style={SAVE_BTN_STYLES} onClick={() => setShowCreatePlan(true)}>
                    + Create New Plan
                </button>
            </div>

            {workoutLog.length === 0 ? (
                <p style={{ color: "#888" }}>This client has no workout plans yet.</p>
            ) : (
                workoutLog.map(plan => (
                    <WorkoutPlan
                        key={plan.id}
                        plan={plan}
                        exercises={exercises}
                        planDetails={planDetails[plan.id]}
                        onUpdate={handleUpdate}
                        onSave={handleSave}
                        onAddExercise={handleAddExercise}
                        onRemove={handleRemove}
                        onDeletePlan={handleDeletePlan}
                    />
                ))
            )}

            {/* Progress metrics section */}
            <div style={{ ...CLIENT_CARD_STYLES, flexDirection: "column", alignItems: "stretch", marginTop: "30px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div>
                        <h5 style={{ margin: 0, fontWeight: "700" }}>Client Progress Metrics</h5>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>Review trends over time.</p>
                    </div>

                    {/* Graph Tabs */}
                    <select
                        value={graphType}
                        onChange={(e) => setGraphType(e.target.value)}
                        style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", outline: "none", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem" }}
                    >
                        <option value="Weight">Weight</option>
                        <option value="Weekly Workouts">Workouts</option>
                        <option value="Calories">Calories</option>
                        <option value="Surveys">Surveys</option>
                    </select>
                </div>

                <div style={{ width: "100%", height: "250px" }}>
                    <ResponsiveContainer width="100%" height="100%">

                        {/* Weight Graph */}
                        {graphType === "Weight" && (
                            <LineChart data={weightLogs} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="date" tick={{fontSize: 12}} />
                                <YAxis width={40} domain={['dataMin-5', 'dataMax+5']} tick={{fontSize: 12}} />
                                <Tooltip />
                                <Line type="monotone" dataKey="weight" stroke="#84d88b" strokeWidth={3} />
                            </LineChart>
                        )}

                        {/* Workout Graph (bar graph) */}
                        {graphType === "Workouts" && (
                            <BarChart data={workoutStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="week" tick={{fontSize: 12}} />
                                <YAxis width={40} allowDecimals={false} tick={{fontSize: 12}} />
                                <Tooltip cursor={{fill: '#f5f5f5'}} />
                                <Bar dataKey="workouts" fill="#711A19" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        )}

                        {/* Calorie Graph */}
                        {graphType === "Calories" && (
                            <LineChart data={calorieLogs} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="date" tick={{fontSize: 12}} />
                                <YAxis width={50} domain={['dataMin-200', 'dataMax+200']} tick={{fontSize: 12}} />
                                <Tooltip />
                                <Line type="monotone" dataKey="calories" stroke="#F4A261" strokeWidth={3} />
                            </LineChart>
                        )}

                        {/* Daily Survey Graph */}
                        {graphType === "Surveys" && (
                            <LineChart data={surveyLogs} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="date" tick={{fontSize: 12}} />
                                <YAxis width={30} domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{fontSize: 12}} />
                                <Tooltip />
                                <Line type="monotone" dataKey="rating" stroke="#2A9D8F" strokeWidth={3} />
                            </LineChart>
                        )}

                    </ResponsiveContainer>
                </div>
            </div>

            {showCreatePlan && (
                <CreatePlanModal
                    exercises={exercises}
                    userId={client.user_id}
                    apiBase={apiBase}
                    onCreated={async (title) => {
                        setShowCreatePlan(false)
                        setTimeout(async () => {
                            await refreshData()
                            const logRes = await fetch(`${apiBase}/api/workouts/log/${client.user_id}`)
                            const logData = await logRes.json()
                            if (logData.status === "success" && logData.data.length > 0) {
                                const newestPlan = logData.data[0]
                                await fetch(`${apiBase}/coach/update-plan-title/${newestPlan.id}`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ title })
                                })
                                refreshData()
                            }
                        }, 500)
                    }}
                    onClose={() => setShowCreatePlan(false)}
                />
            )}
        </div>
    )
}