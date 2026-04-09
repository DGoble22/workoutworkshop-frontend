import React, { useState, useEffect, useContext, useRef } from 'react';
import ReactDOM from 'react-dom';
import { AuthContext } from '../context/AuthContext';
import './ChatModal.css';

const ChatModal = ({ isOpen, onClose }) => {
    const { socket, user, isAuthenticated } = useContext(AuthContext);
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch Contact List
    useEffect(() => {
        if (isOpen && user?.id) {
            const apiBase = import.meta.env.VITE_API_URL;
            const url = `${apiBase}/api/contacts/${user.id}`;
            fetch(url)
                .then(res => res.json())
                .then(data => setContacts(data))
                .catch(err => console.error("Error fetching contacts:", err));
        }
    }, [isOpen, user?.id]);

    // Fetch History when a contact is selected
    useEffect(() => {
        if (selectedContact && user?.id) {
            const apiBase = import.meta.env.VITE_API_URL;
            const url = `${apiBase}/chat/history/${user.id}/${selectedContact.user_id}`;
            fetch(url)
                .then(res => res.json())
                .then(data => setMessages(data))
                .catch(err => console.error("Error fetching history:", err));
        }
    }, [selectedContact, user?.id]);

    // live messages
    useEffect(() => {
        if (!socket) return;
        socket.on("receive_message", (data) => {
            if (data.sender_id === selectedContact?.user_id || data.sender_id === user?.id) {
                setMessages((prev) => [...prev, data]);
            } else {
                console.log("New message from another user:", data.sender_id);
            }
        });
        socket.on("admin_announcement", (data) => {
            alert(`SYSTEM ALERT: ${data.message}`);
        });
        return () => {
            socket.off("receive_message");
            socket.off("admin_announcement");
        };
    }, [socket, selectedContact, user?.id]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;
        if (!socket || !socket.connected) return;
        const messageData = {
            sender_id: user.id,
            receiver_id: selectedContact.user_id,
            text: newMessage
        };
        socket.emit("send_message", messageData);

        // Update UI
        setMessages((prev) => [...prev, messageData]);
        setNewMessage("");
    };

    // Logic to stop background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen || !isAuthenticated) return null;

    return ReactDOM.createPortal(
        <div className="chat-overlay" onClick={onClose}>
            <div className="chat-container" onClick={(e) => e.stopPropagation()}>

                {/* Contact Sidebar */}
                <div className="chat-sidebar">
                    <h3>Messages</h3>
                    <div className="contact-list">
                        {contacts.map(c => (
                            <div key={c.user_id} className={`contact-item ${selectedContact?.user_id === c.user_id ? 'active' : ''}`} onClick={() => setSelectedContact(c)}>
                                {c.role === "C" && "Coach: "}
                                {c.role === "U" && user.role === "C" && `Client: `}
                                {c.full_name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="chat-main">
                    <div className="chat-header">
                        {selectedContact ? `Chat with ${selectedContact.full_name}` : "Select a contact"}
                        <button className="close-btn" onClick={onClose}>&times;</button>
                    </div>
                    <div className="chat-messages">
                        {messages.length === 0 && selectedContact && (
                            <p className="no-messages">No messages yet. Say hello!</p>
                        )}
                        {messages.map((m, i) => (
                            <div key={i} className={`message-bubble ${m.sender_id === user.id ? 'me' : 'them'}`}>
                                {m.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chat-input" onSubmit={sendMessage}>
                        <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." disabled={!selectedContact}/>
                        <button type="submit" disabled={!selectedContact || !socket}>{socket ? "Send" : "Connecting..."}</button>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ChatModal;

