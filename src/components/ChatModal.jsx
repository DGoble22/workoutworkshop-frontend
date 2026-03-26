import React, { useState } from "react"
import DefaultProfilePic from "../images/DefaultProfile.jpg"
import Image from "react-bootstrap/Image"

const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
}

const MODAL_STYLES = {
    position: "fixed",
    display: "flex",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FFF",
    width: "55vw",
    height: "70vh",
    borderRadius: "3%",
    flexDirection: "column",
    zIndex: 1000,
    overflow: "hidden"
}

const CHAT_HEADER_STYLES = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid #ccc",
    backgroundColor: "#ffffff"
}

const MESSAGES_STYLES = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    gap: "10px"
}

const INPUT_ROW_STYLES = {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    borderTop: "1px solid #ccc",
    gap: "10px"
}

const CLOSE_BUTTON_STYLES = {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#999"
}

const DUMMY_MESSAGES = {
    1: [
        { id: 1, sender: "coach", content: "How's the workout split working out for you?" },
        { id: 2, sender: "client", content: "Lovin' it!" },
        { id: 3, sender: "coach", content: "Good to hear!" }
    ],
    2: [
        { id: 1, sender: "coach", content: "How are you feeling after today's session?" },
        { id: 2, sender: "client", content: "Pretty sore but good!" }
    ],
    3: [
        { id: 1, sender: "coach", content: "Keep up the great work!" }
    ]
}

export default function ChatModal({ show, handleClose, client }) {
    const [messages, setMessages] = useState(DUMMY_MESSAGES)
    const [newMessage, setNewMessage] = useState("")

    function handleSend() {
        if (!newMessage.trim()) return
        const clientId = client.user_id
        const msg = {
            id: Date.now(),
            sender: "coach",
            content: newMessage.trim()
        }
        setMessages(prev => ({
            ...prev,
            [clientId]: [...(prev[clientId] || []), msg]
        }))
        setNewMessage("")
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleSend()
    }

    if (!show || !client) { return null }

    const currentMessages = messages[client.user_id] || []

    return (
        <div style={OVERLAY_STYLES}>
            <div style={MODAL_STYLES}>
                <div style={CHAT_HEADER_STYLES}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Image
                            src={client.profile_picture_url || DefaultProfilePic}
                            roundedCircle
                            style={{ width: "36px", height: "36px", objectFit: "cover" }}
                        />
                        <strong>{client.first_name} {client.last_name}</strong>
                    </div>
                    <button style={CLOSE_BUTTON_STYLES} onClick={handleClose}>✕</button>
                </div>

                <div style={MESSAGES_STYLES}>
                    {currentMessages.map(msg => (
                        <div
                            key={msg.id}
                            style={{
                                display: "flex",
                                justifyContent: msg.sender === "coach" ? "flex-end" : "flex-start"
                            }}
                        >
                            <div style={{
                                backgroundColor: msg.sender === "coach" ? "#4a90d9" : "#e8e8e8",
                                color: msg.sender === "coach" ? "#ffffff" : "#2C2C2C",
                                padding: "10px 14px",
                                borderRadius: "18px",
                                maxWidth: "65%",
                                fontSize: "0.95rem"
                            }}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={INPUT_ROW_STYLES}>
                    <input
                        type="text"
                        placeholder="Message"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{
                            flex: 1,
                            padding: "10px 14px",
                            border: "1px solid #ccc",
                            borderRadius: "20px",
                            outline: "none",
                            fontSize: "0.95rem"
                        }}
                    />
                    <button
                        onClick={handleSend}
                        style={{
                            backgroundColor: "#2C2C2C",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "50%",
                            width: "36px",
                            height: "36px",
                            cursor: "pointer",
                            fontSize: "1rem"
                        }}
                    >
                        ↑
                    </button>
                </div>
            </div>
        </div>
    )
}