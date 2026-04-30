import React, { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

const PAGE_STYLES = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
    paddingBottom: "40px"
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

const INPUT_STYLES = {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: "0.9rem",
    backgroundColor: "transparent"
}

const ADD_BUTTON_STYLES = {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#f5f5f5",
    cursor: "pointer",
    color: "#711A19",
    fontWeight: "600",
    fontSize: "0.9rem"
}

const SAVE_BUTTON_STYLES = {
    display: "flex",
    width: "250px",
    height: "48px",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#711A19",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "20px"
}

const REMOVE_BTN_STYLES = {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#999",
    fontSize: "1rem"
}

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

const EMPTY_DAY = {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snack: []
}

function createEmptyWeek() {
    const week = {}
    DAYS.forEach(d => { week[d.dow] = { ...EMPTY_DAY, Breakfast: [], Lunch: [], Dinner: [], Snack: [] } })
    return week
}

let nextId = 100

function MealSection({ title, items, onAdd, onRemove, onUpdate }) {
    return (
        <div style={SECTION_STYLES}>
            <h5 style={{ fontWeight: "700", marginBottom: "10px" }}>{title}</h5>
            <table style={TABLE_STYLES}>
                <thead>
                    <tr>
                        <th style={TH_STYLES}>Food item</th>
                        <th style={TH_STYLES}>Portion</th>
                        <th style={TH_STYLES}>Calories</th>
                        <th style={TH_STYLES}></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td style={TD_STYLES}>
                                <input
                                    id={`${title}-fooditem`}
                                    style={INPUT_STYLES}
                                    value={item.food}
                                    onChange={e => onUpdate(item.id, "food", e.target.value)}
                                    placeholder="Food item"
                                />
                            </td>
                            <td style={TD_STYLES}>
                                <input
                                    id={`${title}-portion`}
                                    style={INPUT_STYLES}
                                    value={item.portion}
                                    onChange={e => onUpdate(item.id, "portion", e.target.value)}
                                    placeholder="Portion"
                                />
                            </td>
                            <td style={TD_STYLES}>
                                <input
                                    id={`${title}-cal`}
                                    style={{ ...INPUT_STYLES, width: "60px" }}
                                    type="number"
                                    value={item.calories === 0 ? "" : item.calories}
                                    onChange={e => onUpdate(item.id, "calories", e.target.value === "" ? 0 : Number(e.target.value))}
                                    placeholder="0"
                                />
                            </td>
                            <td style={TD_STYLES}>
                                <button id={`${title}-remove`} style={REMOVE_BTN_STYLES} onClick={() => onRemove(item.id)}>✕</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button id={`add-${title}`}style={ADD_BUTTON_STYLES} onClick={onAdd}>+ Add Food Item</button>
        </div>
    )
}

export default function CreateMealPlan({ onBack, client, coachId }) {
    const { token } = useContext(AuthContext)
    const [weekMeals, setWeekMeals] = useState(createEmptyWeek())
    const [selectedDay, setSelectedDay] = useState("M")
    const [saving, setSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState("")
    const [error, setError] = useState("")

    const apiBase = import.meta.env.VITE_API_URL || ""

    useEffect(() => {
        async function loadMealPlan() {
            if (!coachId || !client) return
            try {
                const res = await fetch(`${apiBase}/coach/meal-plan/${coachId}/${client.user_id}`)
                const data = await res.json()
                if (data.status === "success" && data.data) {
                    const loaded = createEmptyWeek()
                    for (const row of data.data) {
                        const dow = row.dow
                        if (loaded[dow]) {
                            try {
                                const parsed = JSON.parse(row.meal)
                                if (parsed.Breakfast) {
                                    loaded[dow].Breakfast = parsed.Breakfast.map(i => ({ ...i, id: nextId++ }))
                                    loaded[dow].Lunch = parsed.Lunch.map(i => ({ ...i, id: nextId++ }))
                                    loaded[dow].Dinner = parsed.Dinner.map(i => ({ ...i, id: nextId++ }))
                                    loaded[dow].Snack = parsed.Snack.map(i => ({ ...i, id: nextId++ }))
                                }
                            } catch (e) {
                                console.error("Failed to parse meal:", e)
                            }
                        }
                    }
                    setWeekMeals(loaded)
                }
            } catch (e) {
                console.error("Failed to load meal plan:", e)
            }
        }
        loadMealPlan()
    }, [coachId, client])

    function addItem(section) {
        setWeekMeals(prev => ({
            ...prev,
            [selectedDay]: {
                ...prev[selectedDay],
                [section]: [...prev[selectedDay][section], { id: nextId++, food: "", portion: "", calories: 0 }]
            }
        }))
    }

    function removeItem(section, id) {
        setWeekMeals(prev => ({
            ...prev,
            [selectedDay]: {
                ...prev[selectedDay],
                [section]: prev[selectedDay][section].filter(item => item.id !== id)
            }
        }))
    }

    function updateItem(section, id, field, value) {
        setWeekMeals(prev => ({
            ...prev,
            [selectedDay]: {
                ...prev[selectedDay],
                [section]: prev[selectedDay][section].map(item => item.id === id ? { ...item, [field]: value } : item)
            }
        }))
    }

    const currentDay = weekMeals[selectedDay]
    const allItems = Object.values(currentDay).flat()
    const totalCalories = allItems.reduce((sum, item) => sum + Number(item.calories), 0)

    async function handleSave() {
        setError("")
        setSaveMessage("")
        setSaving(true)

        const mealsPayload = DAYS.map(({ dow }) => ({
            dow,
            meal: JSON.stringify({
                Breakfast: weekMeals[dow].Breakfast.map(({ food, portion, calories }) => ({ food, portion, calories })),
                Lunch: weekMeals[dow].Lunch.map(({ food, portion, calories }) => ({ food, portion, calories })),
                Dinner: weekMeals[dow].Dinner.map(({ food, portion, calories }) => ({ food, portion, calories })),
                Snack: weekMeals[dow].Snack.map(({ food, portion, calories }) => ({ food, portion, calories }))
            })
        }))

        try {
            const res = await fetch(`${apiBase}/coach/save-meal-plan/${coachId}/${client.user_id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ meals: mealsPayload })
            })
            const data = await res.json()
            if (data.status === "success") {
                setSaveMessage("Meal plan saved!")
            } else {
                setError(data.message || "Failed to save meal plan.")
            }
        } catch (e) {
            setError("Network error. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div style={PAGE_STYLES}>
            <div style={{ width: "100%", marginBottom: "20px", textAlign: "center" }}>
                <h1 style={{ fontWeight: "800", textDecoration: "underline" }}>Create Meal Plan</h1>
                {onBack && (
                    <button id="back-to-dash" onClick={onBack} style={{ background: "none", border: "none", color: "#711A19", cursor: "pointer", fontWeight: "600" }}>
                        ← Back to Dashboard
                    </button>
                )}
            </div>

            <div style={{ width: "100%", marginBottom: "20px" }}>
                <p style={{ margin: 0 }}>Client: <strong>{client ? `${client.first_name} ${client.last_name}` : "Unknown"}</strong></p>
                <p style={{ margin: 0, color: "#666" }}>Goal: <strong>{client ? client.goal_type : ""}</strong></p>
            </div>

            <div style={{ display: "flex", gap: "8px", width: "100%", marginBottom: "20px", flexWrap: "wrap" }}>
                {DAYS.map(({ label, dow }) => (
                    <button
                        id={`dotw-${label}`}
                        key={dow}
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
                    <MealSection
                        key={section}
                        title={section}
                        items={currentDay[section]}
                        onAdd={() => addItem(section)}
                        onRemove={(id) => removeItem(section, id)}
                        onUpdate={(id, field, value) => updateItem(section, id, field, value)}
                    />
                ))}
            </div>

            <div style={{ width: "100%", marginTop: "16px" }}>
                <strong>Total Calories for {DAYS.find(d => d.dow === selectedDay)?.label}: {totalCalories} kcal</strong>
            </div>

            {error && <p style={{ color: "#cb0a0a", marginTop: "10px" }}>{error}</p>}
            {saveMessage && <p style={{ color: "#2e7d32", marginTop: "10px" }}>{saveMessage}</p>}

            <button id="save-meal-plan" style={SAVE_BUTTON_STYLES} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Meal Plan"}
            </button>
        </div>
    )
}