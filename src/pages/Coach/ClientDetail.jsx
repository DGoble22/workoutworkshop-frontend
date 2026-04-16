import React, { useState, useEffect } from "react"
import ExerciseCard from "../../components/ExerciseCard"

const PAGE_STYLES = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
    paddingBottom: "40px"
}

const PLAN_CARD_STYLES = {
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginBottom: "20px",
    overflow: "hidden"
}

const PLAN_HEADER_STYLES = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ccc",
    fontWeight: "700",
    fontSize: "1rem"
}

const PLAN_BODY_STYLES = {
    padding: "16px 18px",
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "center"
}

const SAVE_BUTTON_STYLES = {
    backgroundColor: "#cb0a0a",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "6px 14px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.85rem"
}

export default function ClientDetail({ client, onBack }) {
    const [workoutLog, setWorkoutLog] = useState([])
    const [planDetails, setPlanDetails] = useState({})
    const [apply, setApply] = useState(false)
    const [loading, setLoading] = useState(true)

    const apiBase = import.meta.env.VITE_API_URL || ""

    useEffect(() => {
        async function fetchWorkouts() {
            try {
                const res = await fetch(`${apiBase}/api/workouts/log/${client.user_id}`)
                const data = await res.json()
                if (data.status === "success") {
                    setWorkoutLog(data.data)
                    for (const plan of data.data) {
                        fetchPlanDetails(plan.id)
                    }
                }
            } catch (e) {
                console.error("Failed to load workout log:", e)
            } finally {
                setLoading(false)
            }
        }
        fetchWorkouts()
    }, [])

    async function fetchPlanDetails(plan_id) {
        try {
            const res = await fetch(`${apiBase}/api/workouts/plan/${plan_id}`)
            const data = await res.json()
            if (data.status === "success") {
                setPlanDetails(prev => ({ ...prev, [plan_id]: data.data }))
            }
        } catch (e) {
            console.error("Failed to load plan details:", e)
        }
    }

    function handleUpdate(plan_id, exercise_id, field, value) {
        setPlanDetails(prev => ({
            ...prev,
            [plan_id]: prev[plan_id].map(ex =>
                ex.exercise_id === exercise_id ? { ...ex, [field]: value } : ex
            )
        }))
    }

    async function handleSave(plan_id) {
        const exercises = planDetails[plan_id]
        if (!exercises) return

        try {
            const res = await fetch(`${apiBase}/api/workouts/plan/${plan_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ exercises })
            })
            const data = await res.json()
            if (data.status === "success") {
                alert("Workout plan saved!")
            } else {
                alert("Failed to save workout plan.")
            }
        } catch (e) {
            console.error("Failed to save plan:", e)
        }
    }

    if (loading) {
        return <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
    }

    return (
        <div style={PAGE_STYLES}>
            <div style={{ width: "100%", marginBottom: "24px", textAlign: "center" }}>
                <h1 style={{ fontWeight: "800", textDecoration: "underline", marginBottom: "4px" }}>
                    {client.first_name} {client.last_name}'s Workout Plans
                </h1>
                <p style={{ color: "#666" }}>Goal: {client.goal_type}</p>
                {onBack && (
                    <button onClick={onBack} style={{ background: "none", border: "none", color: "#cb0a0a", cursor: "pointer", fontWeight: "600" }}>
                        ← Back to Dashboard
                    </button>
                )}
            </div>

            {workoutLog.length === 0 ? (
                <p style={{ color: "#888" }}>This client has no workout plans yet.</p>
            ) : (
                workoutLog.map(plan => (
                    <div key={plan.id} style={PLAN_CARD_STYLES}>
                        <div style={PLAN_HEADER_STYLES}>
                            <span>{plan.title} — {plan.date}</span>
                            <button style={SAVE_BUTTON_STYLES} onClick={() => handleSave(plan.id)}>
                                Save Changes
                            </button>
                        </div>
                        <div style={PLAN_BODY_STYLES}>
                            {planDetails[plan.id] ? (
                                planDetails[plan.id].length === 0 ? (
                                    <p style={{ color: "#888" }}>No exercises in this plan.</p>
                                ) : (
                                    planDetails[plan.id].map(ex => (
                                        <ExerciseCard
                                            key={ex.exercise_id}
                                            name={ex.exercise_name}
                                            exercise_id={ex.exercise_id}
                                            plan_id={plan.id}
                                            reps={ex.reps}
                                            sets={ex.sets}
                                            weight={ex.weight}
                                            URL={ex.video_url}
                                            thumbnail={ex.thumbnail}
                                            equipment={ex.equipment_needed}
                                            manage={true}
                                            apply={apply}
                                            handleDelete={() => {}}
                                            handleUpdate={(field, value) => handleUpdate(plan.id, ex.exercise_id, field, value)}
                                        />
                                    ))
                                )
                            ) : (
                                <p style={{ color: "#888" }}>Loading exercises...</p>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}