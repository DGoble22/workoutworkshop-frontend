import React, { useState, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import EditCoachProfile from "./EditCoachProfile"
import CreateMealPlan from "./CreateMealPlan"
import ChatModal from "../../components/ChatModal"
import Image from "react-bootstrap/Image"
import DefaultProfilePic from "../../images/defaultProfile.jpg"

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

function ClientsTable({ clients, onMealPlan, onChat }) {
    return (
        <table style={TABLE_STYLES}>
            <thead>
            <tr>
                <th style={TH_STYLES}>Name</th>
                <th style={TH_STYLES}>Goal</th>
                <th style={TH_STYLES}>Last Workout</th>
                <th style={{ ...TH_STYLES, paddingLeft: "30px" }}>Workout Plan</th>
                <th style={TH_STYLES}>Chat</th>
                <th style={TH_STYLES}></th>
            </tr>
            </thead>
            <tbody>
            {clients.map(client => (
                <tr key={client.user_id}>
                    <td style={{ ...TD_STYLES, fontWeight: "700" }}>{client.first_name} {client.last_name}</td>
                    <td style={TD_STYLES}>{client.goal_type}</td>
                    <td style={TD_STYLES}>{client.last_workout}</td>
                    <td style={{ ...TD_STYLES, paddingLeft: "30px" }}>
                            <span
                                style={{ fontSize: "1.3rem", cursor: "pointer" }}
                                onClick={() => onMealPlan(client.user_id)}
                            >
                                📋
                            </span>
                    </td>
                    <td style={TD_STYLES}>
                            <span
                                style={{ fontSize: "1.3rem", cursor: "pointer" }}
                                onClick={() => onChat(client.user_id)}
                            >
                                💬
                            </span>
                    </td>
                    <td style={TD_STYLES}>
                        <span style={{ color: "#cb0a0a", fontWeight: "700", cursor: "pointer" }}>›</span>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default function Coach() {
    const { user } = useContext(AuthContext)
    const [view, setView] = useState(VIEWS.DASHBOARD)
    const [requests, setRequests] = useState(DUMMY_REQUESTS)
    const [clients] = useState(DUMMY_CLIENTS)
    const [selectedClient, setSelectedClient] = useState(null)
    const [showChat, setShowChat] = useState(false)
    const [chatClient, setChatClient] = useState(null)

    function handleAccept(request_id) {
        setRequests(prev => prev.filter(r => r.request_id !== request_id))
    }

    function handleReject(request_id) {
        setRequests(prev => prev.filter(r => r.request_id !== request_id))
    }

    function handleMealPlan(user_id) {
        setSelectedClient(user_id)
        setView(VIEWS.MEAL_PLAN)
    }

    function handleChat(user_id) {
        setChatClient(user_id)
        setShowChat(true)
    }

    const handleFindCoach = () => {
        window.location.href = "/FindCoach";
    };

    // if (!user || user.role !== 'C') {
    //     return (
    //         <div className="container mt-4">
    //             <p>This page is only accessible to coaches.</p>
    //         </div>
    //     )
    // }

    if (view === VIEWS.EDIT_PROFILE) {
        return (
            <div className="container mt-4">
                <EditCoachProfile onBack={() => setView(VIEWS.DASHBOARD)} />
            </div>
        )
    }

    if (view === VIEWS.MEAL_PLAN) {
        return (
            <div className="container mt-4">
                <CreateMealPlan
                    client={clients.find(c => c.user_id === selectedClient)}
                    onBack={() => setView(VIEWS.DASHBOARD)}
                />
            </div>
        )
    }

    return (
        <>
        {user.role === 'C' &&(
        <div className="container mt-4">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <div style={{ position: "relative", width: "100%", maxWidth: "700px", textAlign: "center", marginBottom: "28px" }}>
                    <h1 style={{ fontWeight: "800", textDecoration: "underline" }}>Coach</h1>
                    <p style={{ color: "#555" }}>Welcome back, Coach!</p>
                    <button
                        onClick={() => setView(VIEWS.EDIT_PROFILE)}
                        style={{ position: "absolute", top: "0", right: "0", background: "none", border: "none", color: "#cb0a0a", fontWeight: "600", cursor: "pointer" }}
                    >
                        Edit Profile →
                    </button>
                </div>

                <div style={{ width: "100%", maxWidth: "700px" }}>
                    <h4 style={{ fontWeight: "700", marginBottom: "12px" }}>Pending Client Requests</h4>
                    {requests.length === 0 ? (
                        <p style={{ color: "#888" }}>No pending requests.</p>
                    ) : (
                        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                            {requests.map(request => (
                                <RequestCard
                                    key={request.request_id}
                                    request={request}
                                    onAccept={handleAccept}
                                    onReject={handleReject}
                                />
                            ))}
                        </div>
                    )}

                    <h4 style={{ fontWeight: "700", marginTop: "28px", marginBottom: "12px" }}>My Clients</h4>
                    {clients.length === 0 ? (
                        <p style={{ color: "#888" }}>No clients yet.</p>
                    ) : (
                        <ClientsTable
                            clients={clients}
                            onMealPlan={handleMealPlan}
                            onChat={handleChat}
                        />
                    )}
                </div>
            </div>

            <ChatModal
                show={showChat}
                handleClose={() => setShowChat(false)}
                client={clients.find(c => c.user_id === chatClient)}
            />
        </div>
            )}
            {/* Needs to replaced and needs an api call to see if a user has a coach */}
            {user.role === 'U' || user.role === 'A' && (
                handleFindCoach()
            )}
        </>
    )
}
