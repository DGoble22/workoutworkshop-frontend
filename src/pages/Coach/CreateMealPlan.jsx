import React, { useState } from "react"

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
    color: "#cb0a0a",
    fontWeight: "600",
    fontSize: "0.9rem"
}

const SAVE_BUTTON_STYLES = {
    display: "flex",
    width: "250px",
    height: "48px",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cb0a0a",
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

const INITIAL_MEALS = {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snack: []
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
                                    style={INPUT_STYLES}
                                    value={item.food}
                                    onChange={e => onUpdate(item.id, "food", e.target.value)}
                                    placeholder="Food item"
                                />
                            </td>
                            <td style={TD_STYLES}>
                                <input
                                    style={INPUT_STYLES}
                                    value={item.portion}
                                    onChange={e => onUpdate(item.id, "portion", e.target.value)}
                                    placeholder="Portion"
                                />
                            </td>
                            <td style={TD_STYLES}>
                                <input
                                    style={{ ...INPUT_STYLES, width: "60px" }}
                                    type="number"
                                    value={item.calories}
                                    onChange={e => onUpdate(item.id, "calories", Number(e.target.value))}
                                    placeholder="0"
                                />
                            </td>
                            <td style={TD_STYLES}>
                                <button style={REMOVE_BTN_STYLES} onClick={() => onRemove(item.id)}>✕</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button style={ADD_BUTTON_STYLES} onClick={onAdd}>+ Add Food Item</button>
        </div>
    )
}

export default function CreateMealPlan({ onBack, client }) {
    const [meals, setMeals] = useState(INITIAL_MEALS)
    const [saved, setSaved] = useState(false)

    function addItem(section) {
        setMeals(prev => ({
            ...prev,
            [section]: [...prev[section], { id: nextId++, food: "", portion: "", calories: 0 }]
        }))
    }

    function removeItem(section, id) {
        setMeals(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }))
    }

    function updateItem(section, id, field, value) {
        setMeals(prev => ({
            ...prev,
            [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
        }))
    }

    const allItems = Object.values(meals).flat()
    const totalCalories = allItems.reduce((sum, item) => sum + Number(item.calories), 0)

    function handleSave() {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div style={PAGE_STYLES}>
            <div style={{ width: "100%", marginBottom: "20px", textAlign: "center" }}>
                <h1 style={{ fontWeight: "800", textDecoration: "underline" }}>Create Meal Plan</h1>
                {onBack && (
                    <button onClick={onBack} style={{ background: "none", border: "none", color: "#cb0a0a", cursor: "pointer", fontWeight: "600" }}>
                        ← Back to Dashboard
                    </button>
                )}
            </div>

            <div style={{ width: "100%", marginBottom: "20px" }}>
                <p style={{ margin: 0 }}>Client: <strong>{client ? `${client.first_name} ${client.last_name}` : "Unknown"}</strong></p>
                <p style={{ margin: 0, color: "#666" }}>Goal: <strong>{client ? client.goal_type : ""}</strong></p>
                <p style={{ margin: 0, color: "#666" }}>Daily Calorie target: 1800 kcal</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", width: "100%" }}>
                {Object.keys(meals).map(section => (
                    <MealSection
                        key={section}
                        title={section}
                        items={meals[section]}
                        onAdd={() => addItem(section)}
                        onRemove={(id) => removeItem(section, id)}
                        onUpdate={(id, field, value) => updateItem(section, id, field, value)}
                    />
                ))}
            </div>

            <div style={{ width: "100%", marginTop: "16px" }}>
                <strong>Total Calories: {totalCalories} kcal</strong>
            </div>

            {saved && <p style={{ color: "#2e7d32", marginTop: "10px" }}>Meal plan saved!</p>}

            <button style={SAVE_BUTTON_STYLES} onClick={handleSave}>
                Save Meal Plan
            </button>
        </div>
    )
}