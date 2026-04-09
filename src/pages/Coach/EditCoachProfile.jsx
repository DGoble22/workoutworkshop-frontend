import React, { useState, useEffect } from "react"
import CoachAvailabilityEditor from "../../components/CoachAvailabilityEditor"

const PAGE_STYLES = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "700px",
    margin: "0 auto",
    paddingBottom: "40px"
}

const SECTION_STYLES = {
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginBottom: "20px",
    overflow: "hidden"
}

const SECTION_HEADER_STYLES = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 18px",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ccc",
    fontWeight: "700",
    fontSize: "1.1rem"
}

const SECTION_BODY_STYLES = {
    padding: "16px 18px",
    backgroundColor: "#ffffff"
}

const LABEL_STYLES = {
    fontSize: "0.85rem",
    color: "#666",
    marginBottom: "8px",
    display: "block"
}

const INPUT_STYLES = {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "0.95rem",
    boxSizing: "border-box"
}

const ROW_STYLES = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px"
}

const DOLLAR_STYLES = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e9ecef",
    border: "1px solid #ccc",
    borderRadius: "6px 0 0 6px",
    padding: "8px 10px",
    color: "#555",
    fontWeight: "600"
}

const PRICE_INPUT_STYLES = {
    flex: 1,
    padding: "8px 10px",
    border: "1px solid #ccc",
    borderLeft: "none",
    borderRadius: "0 6px 6px 0",
    fontSize: "0.95rem"
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
    marginTop: "10px"
}

export default function EditCoachProfile({ onBack, coachId }) {
    const [availability, setAvailability] = useState([])
    const [bio, setBio] = useState("")
    const [pricing, setPricing] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState("")
    const [error, setError] = useState("")

    const apiBase = import.meta.env.VITE_API_URL || ""

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch(`${apiBase}/coach/profile/${coachId}`)
                const data = await res.json()
                if (data.status === "success") {
                    setAvailability(data.data.availability || [])
                    setBio(data.data.bio || "")
                    setPricing(data.data.pricing || "")
                }
            } catch (e) {
                console.error("Failed to load coach profile:", e)
            } finally {
                setLoading(false)
            }
        }
        if (coachId) fetchProfile()
    }, [coachId])

    async function handleSave() {
        setError("")
        setSaveMessage("")

        if (pricing !== "" && (isNaN(Number(pricing)) || Number(pricing) < 0)) {
            setError("Please enter a valid price.")
            return
        }

        for (const slot of availability) {
            if (slot.start_time >= slot.end_time) {
                setError(`End time must be after start time for day: ${slot.dow}`)
                return
            }
        }

        const body = {
            bio: bio.trim(),
            pricing: pricing !== "" ? Number(pricing) : undefined,
            availability
        }

        setSaving(true)
        try {
            const res = await fetch(`${apiBase}/coach/profile/${coachId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })
            const data = await res.json()
            if (data.status === "success") {
                setSaveMessage("Profile updated successfully!")
            } else {
                setError(data.message || "Failed to update profile.")
            }
        } catch (e) {
            setError("Network error. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div style={{ textAlign: "center", padding: "40px" }}>Loading profile...</div>
    }

    return (
        <div style={PAGE_STYLES}>
            <div style={{ width: "100%", marginBottom: "24px", textAlign: "center" }}>
                <h1 style={{ fontWeight: "800", textDecoration: "underline", marginBottom: "4px" }}>
                    Edit Coach Profile
                </h1>
                {onBack && (
                    <button onClick={onBack} style={{ background: "none", border: "none", color: "#cb0a0a", cursor: "pointer", fontWeight: "600" }}>
                        ← Back to Dashboard
                    </button>
                )}
            </div>

            <div style={SECTION_STYLES}>
                <div style={SECTION_HEADER_STYLES}>▾ Availability</div>
                <div style={SECTION_BODY_STYLES}>
                    <span style={LABEL_STYLES}>Check off your available time slots for coaching sessions</span>
                    <CoachAvailabilityEditor value={availability} onChange={setAvailability} disabled={saving} />
                </div>
            </div>

            <div style={SECTION_STYLES}>
                <div style={SECTION_HEADER_STYLES}>▾ Pricing</div>
                <div style={SECTION_BODY_STYLES}>
                    <span style={LABEL_STYLES}>Your weekly rate</span>
                    <div style={ROW_STYLES}>
                        <span style={DOLLAR_STYLES}>$</span>
                        <input
                            style={PRICE_INPUT_STYLES}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={pricing}
                            onChange={e => setPricing(e.target.value)}
                            disabled={saving}
                        />
                        <span style={{ color: "#888", fontSize: "0.85rem", whiteSpace: "nowrap" }}>/ week</span>
                    </div>
                </div>
            </div>

            <div style={SECTION_STYLES}>
                <div style={SECTION_HEADER_STYLES}>▾ Bio</div>
                <div style={SECTION_BODY_STYLES}>
                    <span style={LABEL_STYLES}>Tell clients about yourself</span>
                    <textarea
                        style={{ ...INPUT_STYLES, height: "100px", resize: "vertical" }}
                        placeholder="Write a short bio..."
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        disabled={saving}
                    />
                </div>
            </div>

            {error && <p style={{ color: "#cb0a0a", marginBottom: "10px" }}>{error}</p>}
            {saveMessage && <p style={{ color: "#2e7d32", marginBottom: "10px" }}>{saveMessage}</p>}

            <button style={SAVE_BUTTON_STYLES} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Update Profile"}
            </button>
        </div>
    )
}