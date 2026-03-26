import React, { useState, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import EditCoachProfile from "./EditCoachProfile"
import CreateMealPlan from "./CreateMealPlan"
import ChatModal from "../../components/ChatModal"
import Image from "react-bootstrap/Image"
import DefaultProfilePic from "../../images/DefaultProfile.jpg"

const VIEWS = {
    DASHBOARD: "dashboard",
    EDIT_PROFILE: "edit_profile",
    MEAL_PLAN: "meal_plan"
}

const DUMMY_REQUESTS = [
    {
        request_id: 1,
        first_name: "Jane",
        last_name: "Doe",
        goal_type: "Weightloss",
        experience: "Beginner",
        profile_picture_url: null
    },
    {
        request_id: 2,
        first_name: "John",
        last_name: "Doe",
        goal_type: "Muscle Gain",
        experience: "Intermediate",
        profile_picture_url: null
    }
]

const DUMMY_CLIENTS = [
    {
        user_id: 1,
        first_name: "John",
        last_name: "G",
        goal_type: "Strength",
        last_workout: "Yesterday"
    },
    {
        user_id: 2,
        first_name: "John",
        last_name: "E",
        goal_type: "Weightloss",
        last_workout: "Today"
    },
    {
        user_id: 3,
        first_name: "John",
        last_name: "M",
        goal_type: "Muscle Gain",
        last_workout: "2 days ago"
    }
]

const REQUEST_CARD_STYLES = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: "340px"
}

const ACCEPT_BUTTON_STYLES = {
    backgroundColor: "#2C2C2C",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 20px",
    fontWeight: "700",
    cursor: "pointer",
    flex: 1
}

const REJECT_BUTTON_STYLES = {
    backgroundColor: "#cb0a0a",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 20px",
    fontWeight: "700",
    cursor: "pointer",
    flex: 1
}

const TABLE_STYLES = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "8px"
}

const TH_STYLES = {
    padding: "10px 14px",
    textAlign: "left",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ccc",
    fontWeight: "600",
    fontSize: "0.9rem",
    color: "#444"
}

const TD_STYLES = {
    padding: "12px 14px",
    borderBottom: "1px solid #eee",
    fontSize: "0.95rem"
}

function RequestCard({ request, onAccept, onReject }) {
    const imgURL = request.profile_picture_url || DefaultProfilePic
    return (
        <div style={REQUEST_CARD_STYLES}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                <Image src={imgURL} roundedCircle style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                <div>
                    <strong>{request.first_name} {request.last_name}</strong>
                    <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>{request.goal_type}</p>
                </div>
            </div>
            <p style={{ marginBottom: "12px" }}>Experience: {request.experience}</p>
            <div style={{ display: "flex", gap: "10px" }}>
                <button style={ACCEPT_BUTTON_STYLES} onClick={() => onAccept(request.request_id)}>ACCEPT</button>
                <button style={REJECT_BUTTON_STYLES} onClick={() => onReject(request.request_id)}>REJECT</button>
            </div>
        </div>
    )
}
