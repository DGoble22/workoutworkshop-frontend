import React, { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

const DAYS = [
    { label: "Monday", dow: "M" },
    { label: "Tuesday", dow: "T" },
    { label: "Wednesday", dow: "W" },
    { label: "Thursday", dow: "TH" },
    { label: "Friday", dow: "F" },
    { label: "Saturday", dow: "SAT" },
    { label: "Sunday", dow: "SUN" }
]

const MEAL_SECTIONS = ["Breakfast", "Lunch", "Dinner", "Snack"]

const PAGE_STYLES = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
    paddingBottom: "40px",
    paddingTop: "20px"
}

const SECTION_STYLES = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    backgroundColor: "#ffffff",
    width: "100%"
}

const TABLE_STYLES = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "10px"
}

const TH_STYLES = {
    padding: "8px 12px",
    textAlign: "left",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ccc",
    fontWeight: "600",
    fontSize: "0.9rem",
    color: "#444"
}

const TD_STYLES = {
    padding: "8px 12px",
    borderBottom: "1px solid #eee",
    fontSize: "0.9rem"
}

export default function UserMealPlan() {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [weekMeals, setWeekMeals] = useState(null)
    const [selectedDay, setSelectedDay] = useState("M")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const apiBase = import.meta.env.VITE_API_URL || ""

    useEffect(() => {
        async function loadMealPlan() {
            try {
                const coachRes = await fetch(`${apiBase}/coach/my-coach/${user.id}`)
                const coachData = await coachRes.json()

                if (!coachData.coach_id) {
                    setError("You don't have a coach yet.")
                    setLoading(false)
                    return
                }

                const mealRes = await fetch(`${apiBase}/coach/meal-plan/${coachData.coach_id}/${user.id}`)
                const mealData = await mealRes.json()

                if (mealData.status === "success" && mealData.data) {
                    const loaded = {}
                    DAYS.forEach(d => {
                        loaded[d.dow] = { Breakfast: [], Lunch: [], Dinner: [], Snack: [] }
                    })

                    for (const row of mealData.data) {
                        const dow = row.dow
                        if (loaded[dow]) {
                            try {
                                const parsed = JSON.parse(row.meal)
                                if (parsed.Breakfast !== undefined) {
                                    loaded[dow].Breakfast = parsed.Breakfast
                                    loaded[dow].Lunch = parsed.Lunch
                                    loaded[dow].Dinner = parsed.Dinner
                                    loaded[dow].Snack = parsed.Snack
                                }
                            } catch (e) {
                                console.error("Failed to parse meal:", e)
                            }
                        }
                    }
                    setWeekMeals(loaded)
                } else {
                    setError("No meal plan found. Ask your coach to create one!")
                }
            } catch (e) {
                console.error("Failed to load meal plan:", e)
                setError("Failed to load meal plan.")
            } finally {
                setLoading(false)
            }
        }
        loadMealPlan()
    }, [])

    if (loading) return <div style={{ textAlign: "center", padding: "40px" }}>Loading meal plan...</div>

    if (error) return (
        <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: "#888" }}>{error}</p>
            <button id="back" onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#cb0a0a", cursor: "pointer", fontWeight: "600" }}>
                ← Back
            </button>
        </div>
    )

    const currentDay = weekMeals[selectedDay]
    const allItems = Object.values(currentDay).flat()
    const totalCalories = allItems.reduce((sum, item) => sum + Number(item.calories || 0), 0)

    return (
        <div className="container mt-4">
            <div style={PAGE_STYLES}>
                <div style={{ width: "100%", marginBottom: "20px", textAlign: "center" }}>
                    <h1 style={{ fontWeight: "800", textDecoration: "underline" }}>My Meal Plan</h1>
                    <button id="back" onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#711A19", cursor: "pointer", fontWeight: "600" }}>
                        ← Back
                    </button>
                </div>

                <div style={{ display: "flex", gap: "8px", width: "100%", marginBottom: "20px", flexWrap: "wrap" }}>
                    {DAYS.map(({ label, dow }) => (
                        <button
                            key={dow}
                            id={`mealplan-${dow}`}
                            onClick={() => setSelectedDay(dow)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "20px",
                                border: "1px solid #ccc",
                                backgroundColor: selectedDay === dow ? "#711A19" : "#ffffff",
                                color: selectedDay === dow ? "#ffffff" : "#333",
                                fontWeight: selectedDay === dow ? "700" : "400",
                                cursor: "pointer",
                                fontSize: "0.9rem"
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", width: "100%" }}>
                    {MEAL_SECTIONS.map(section => (
                        <div key={section} style={SECTION_STYLES}>
                            <h5 style={{ fontWeight: "700", marginBottom: "10px" }}>{section}</h5>
                            {currentDay[section].length === 0 ? (
                                <p style={{ color: "#888", fontSize: "0.9rem" }}>No items planned.</p>
                            ) : (
                                <table style={TABLE_STYLES}>
                                    <thead>
                                        <tr>
                                            <th style={TH_STYLES}>Food item</th>
                                            <th style={TH_STYLES}>Portion</th>
                                            <th style={TH_STYLES}>Calories</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentDay[section].map((item, idx) => (
                                            <tr key={idx}>
                                                <td style={TD_STYLES}>{item.food}</td>
                                                <td style={TD_STYLES}>{item.portion}</td>
                                                <td style={TD_STYLES}>{item.calories}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ width: "100%", marginTop: "16px" }}>
                    <strong>Total Calories for {DAYS.find(d => d.dow === selectedDay)?.label}: {totalCalories} kcal</strong>
                </div>
            </div>
        </div>
    )
}