import React, { useState, useContext, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext"
import EditCoachProfile from "./EditCoachProfile"
import CreateMealPlan from "./CreateMealPlan"
import ClientDetail from "./ClientDetail"
import ChatModal from "../../components/ChatModal"
import Image from "react-bootstrap/Image"
import DefaultProfilePic from "../../images/defaultProfile.jpg"

const VIEWS = {
    DASHBOARD: "dashboard",
    EDIT_PROFILE: "edit_profile",
    MEAL_PLAN: "meal_plan",
    CLIENT_DETAIL: "client_detail"
}

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
    backgroundColor: "#711A19",
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
            <p style={{ marginBottom: "12px" }}>Goal: {request.goal_type}</p>
            <div style={{ display: "flex", gap: "10px" }}>
                <button id={`request-accept-${request.first_name} ${request.last_name}`} style={ACCEPT_BUTTON_STYLES} onClick={() => onAccept(request.request_id)}>ACCEPT</button>
                <button id={`request-reject-${request.first_name} ${request.last_name}`} style={REJECT_BUTTON_STYLES} onClick={() => onReject(request.request_id)}>REJECT</button>
            </div>
        </div>
    )
}

function ClientsTable({ clients, onMealPlan, onChat, onDetail, isNutritionist }) {
    return (
        <table style={TABLE_STYLES}>
            <thead>
                <tr>
                    <th style={TH_STYLES}>Name</th>
                    <th style={TH_STYLES}>Goal</th>
                    <th style={TH_STYLES}>Last Workout</th>
                    <th style={{ ...TH_STYLES, paddingLeft: "30px" }}>Meal Plan</th>
                    <th style={TH_STYLES}>Chat</th>
                    <th style={TH_STYLES}></th>
                </tr>
            </thead>
            <tbody>
                {clients.map(client => (
                    <tr key={client.user_id}>
                        <td style={{ ...TD_STYLES, fontWeight: "700" }}>{client.first_name} {client.last_name}</td>
                        <td style={TD_STYLES}>{client.goal_type}</td>
                        <td style={TD_STYLES}>{client.last_workout || "N/A"}</td>
                        <td style={{ ...TD_STYLES, paddingLeft: "30px" }}>
                            {isNutritionist ? (
                                <span
                                id={`mealplan-${client.first_name} ${client.last_name}`}
                                style={{ fontSize: "1.3rem", cursor: "pointer" }}
                                onClick={() => onMealPlan(client.user_id)}
                                >
                                📋
                                </span>
                            ) : (
                                <span style={{ color: "#ccc", fontSize: "0.8rem" }}>N/A</span>
                            )}
                            </td>
                        <td style={TD_STYLES}>
                            <span
                                id={`clientchat-${client.first_name} ${client.last_name}`}
                                style={{ fontSize: "1.3rem", cursor: "pointer" }}
                                onClick={() => onChat()}
                            >
                                💬
                            </span>
                        </td>
                        <td style={TD_STYLES}>
                            <span
                                id={`details-${client.first_name} ${client.last_name}`}
                                style={{ color: "#711A19", fontWeight: "700", cursor: "pointer" }}
                                onClick={() => onDetail(client.user_id)}
                            >
                                ›
                            </span>
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
    const [requests, setRequests] = useState([])
    const [clients, setClients] = useState([])
    const [coachId, setCoachId] = useState(null)
    const [selectedClient, setSelectedClient] = useState(null)
    const [detailClient, setDetailClient] = useState(null)
    const [showChat, setShowChat] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isNutritionist, setIsNutritionist] = useState(false)

    const apiBase = import.meta.env.VITE_API_URL || ""

    async function getLastWorkout(user_id) {
        try {
            const res = await fetch(`${apiBase}/api/workouts/log/${user_id}`)
            const data = await res.json()
            if (data.status === "success" && data.data.length > 0) {
                const lastDate = data.data[0].date
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const workout = new Date(lastDate)
                workout.setHours(0, 0, 0, 0)
                const diffDays = Math.floor((today - workout) / (1000 * 60 * 60 * 24))
                if (diffDays === 0) return "Today"
                if (diffDays === 1) return "Yesterday"
                return lastDate
            }
            return "N/A"
        } catch (e) {
            return "N/A"
        }
    }

    useEffect(() => {
        async function loadCoachData() {
            try {
                const coachIdRes = await fetch(`${apiBase}/coach/coach-id/${user.id}`)
                const coachIdData = await coachIdRes.json()
                if (coachIdData.status !== "success") return
                const cid = coachIdData.coach_id
                setCoachId(cid)

                const profileRes = await fetch(`${apiBase}/coach/profile/${cid}`)
                const profileData = await profileRes.json()
                if (profileData.status === "success") {
                    setIsNutritionist(profileData.data.is_nutritionist === 1)
                }

                const requestsRes = await fetch(`${apiBase}/coach/requests/${cid}`)
                const requestsData = await requestsRes.json()
                if (requestsData.status === "success") setRequests(requestsData.data)

                const clientsRes = await fetch(`${apiBase}/coach/clients/${cid}`)
                const clientsData = await clientsRes.json()
                if (clientsData.status === "success") {
                    const clientsWithWorkouts = await Promise.all(
                        clientsData.data.map(async client => ({
                            ...client,
                            last_workout: await getLastWorkout(client.user_id)
                        }))
                    )
                    setClients(clientsWithWorkouts)
                }

            } catch (e) {
                console.error("Failed to load coach data:", e)
            } finally {
                setLoading(false)
            }
        }
        loadCoachData()
    }, [])

    async function handleAccept(request_id) {
        try {
            const res = await fetch(`${apiBase}/coach/requests/${request_id}/decision`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ decision: "accepted", coach_id: coachId })
            })
            const data = await res.json()
            if (data.status === "success") {
                setRequests(prev => prev.filter(r => r.request_id !== request_id))
            }
        } catch (e) {
            console.error("Failed to accept request:", e)
        }
    }

    async function handleReject(request_id) {
        try {
            const res = await fetch(`${apiBase}/coach/requests/${request_id}/decision`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ decision: "rejected", coach_id: coachId })
            })
            const data = await res.json()
            if (data.status === "success") {
                setRequests(prev => prev.filter(r => r.request_id !== request_id))
            }
        } catch (e) {
            console.error("Failed to reject request:", e)
        }
    }

    function handleMealPlan(user_id) {
        setSelectedClient(user_id)
        setView(VIEWS.MEAL_PLAN)
    }

    function handleChat() {
        setShowChat(true)
    }

    function handleClientDetail(user_id) {
        setDetailClient(clients.find(c => c.user_id === user_id))
        setView(VIEWS.CLIENT_DETAIL)
    }

    if (!user || user.role !== 'C') {
        return (
            <div className="container mt-4">
                <p>This page is only accessible for coaches.</p>
            </div>
        )
    }

    if (view === VIEWS.EDIT_PROFILE) {
        return (
            <div className="container mt-4">
                <EditCoachProfile onBack={() => setView(VIEWS.DASHBOARD)} coachId={coachId} />
            </div>
        )
    }

    if (view === VIEWS.MEAL_PLAN) {
        return (
            <div className="container mt-4">
                <CreateMealPlan
                    client={clients.find(c => c.user_id === selectedClient)}
                    onBack={() => setView(VIEWS.DASHBOARD)}
                    coachId={coachId}
                />
            </div>
        )
    }

    if (view === VIEWS.CLIENT_DETAIL) {
        return (
            <div className="container mt-4">
                <ClientDetail
                    client={detailClient}
                    onBack={() => setView(VIEWS.DASHBOARD)}
                />
            </div>
        )
    }

    if (loading) {
        return <div className="container mt-4"><p>Loading...</p></div>
    }

    return (
        <>
            {user.role === 'C' && (
                <div className="container mt-4">
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                        <div style={{ position: "relative", width: "100%", maxWidth: "700px", textAlign: "center", marginBottom: "28px" }}>
                            <h1 style={{ fontWeight: "800", textDecoration: "underline" }}>Coach</h1>
                            <p style={{ color: "#555" }}>Welcome back, {user.first_name}!</p>
                            <button
                                id="edit-coach-profile"
                                onClick={() => setView(VIEWS.EDIT_PROFILE)}
                                style={{ position: "absolute", top: "0", right: "0", background: "none", border: "none", color: "#711A19", fontWeight: "600", cursor: "pointer" }}
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
                                    onDetail={handleClientDetail}
                                    isNutritionist={isNutritionist}
                                />
                            )}
                        </div>
                    </div>

                    <ChatModal
                        isOpen={showChat}
                        onClose={() => setShowChat(false)}
                    />
                </div>
            )}
        </>
    )
}