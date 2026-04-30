import react, {useEffect} from "react";
import { Modal, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import React, { useState } from "react";
import DOTWvailibility from "./DOTWavailibility.jsx";
import { AuthContext } from '../context/AuthContext';
import axios from "axios";

const BIO_STYLES={
    display:"flex",
    backgroundColor:"#D9D9D9",
    borderRadius:"5%",
    width:"90%",
    height:"100%",
    maxHeight:"240px",
    marginTop:"25px",
    marginLeft:"5%",
    paddingTop: "5px",
    alignItems:"center",
    justifyContent:"center",
    flexDirection: "column"
}

const BIOTEXT_STYLES={
    display:"flex",
    backgroundColor:"#ffffff",
    width:"90%",
    height:"90%",
    maxHeight:"90%",
    borderRadius:"5%",
    marginBottom:"20px",
    paddingTop: "5px",
    paddingLeft:"5px",
    paddingRight:"5px",
    overflowWrap:"breakWord",
    overflowY:"auto"
}

export default function ViewCoachApplicationModal({ show, handleClose, coachId }) {
    const { user, token } = React.useContext(AuthContext);
    const [coach, setCoach] = react.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        // Fetch specific coach application from the API
        const fetchCoachApplication = async () => {
            setLoading(true);
            try {
                const apiBase = import.meta.env.VITE_API_URL;
                const url = `${apiBase}/admin/coach-applications/${coachId}`;
                const response = await fetch( url, {
                    method: 'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch coach application");
                }
                const data = await response.json();
                setCoach(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCoachApplication();
    }, []);

    const [availablility, setAvailability] = useState([])

    const apiBase = import.meta.env.VITE_API_URL;
    useEffect(() => {
        axios.get(`${apiBase}/coach/coach-availibility/${coachId}`)
            .then(res => {setAvailability(res.data["data"])})
            .catch(err => console.log(err))
    }, [])

    function handleAccept() {
        const acceptApplication = async () => {
            try {
                const apiBase = import.meta.env.VITE_API_URL;
                const certificationIds = coach?.certification_ids || [];

                if (certificationIds.length === 0) {
                    toast.error("No certification IDs available to approve.");
                    return;
                }

                for (const certId of certificationIds) {
                    const url = `${apiBase}/admin/coach-applications/${certId}/approve`;
                    const response = await fetch(url, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ admin_id: user.id }),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to approve certification ID: ${certId}`);
                    }
                }

                toast.success("Coach application certifications approved successfully!");
                handleClose();
            } catch (error) {
                toast.error(error.message);
            }
        };

        acceptApplication();
    }

    function handleReject() {
        const rejectApplication = async () => {
            try {
                const apiBase = import.meta.env.VITE_API_URL;
                const certificationIds = coach?.certification_ids || [];

                if (certificationIds.length === 0) {
                    toast.error("No certification IDs available to reject.");
                    return;
                }

                for (const certId of certificationIds) {
                    const url = `${apiBase}/admin/coach-applications/${certId}/reject`;
                    const response = await fetch(url, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ admin_id: user.id }),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to reject certification ID: ${certId}`);
                    }
                }

                toast.success("Coach application certifications rejected successfully!");
                handleClose();
            } catch (error) {
                toast.error(error.message);
            }
        };

        rejectApplication();
    }

    const handleRejectModal = () => {
        setShowRejectModal(true);
    };

    const handleRejectConfirm = () => {
        handleReject();
        console.log("Rejection reason:", rejectReason);
        setShowRejectModal(false);
        handleClose();
    };

    const handleRejectCancel = () => {
        setShowRejectModal(false);
    };

    // Modify the rendering logic to hide the main modal when the reject modal is shown
    return (
        <>
            {/* Main Modal */}
            {!showRejectModal && (
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{coach?.name} ({coach?.payment}/wk)</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={BIO_STYLES}>
                            <h3>BIO</h3>
                            <div style={BIOTEXT_STYLES}>
                                <p>{coach?.bio}</p>
                            </div>
                        </div>
                        <hr></hr>
                        <h3>Availability:</h3>
                        <div style={{display: "flex", backgroundColor:"#D9D9D9", borderRadius: "15px", width:"95%", height:"18%", marginTop:"5%", alignItems:"center", justifyContent:"center"}}>
                            <div style={{display: "flex",width:"95%", height:"100%", alignItems:"center", justifyContent:"center"}}>
                                <DOTWvailibility available={availablility["SUN"]} DOTW={"Sun"}/>
                                <DOTWvailibility available={availablility["M"]} DOTW={"Mon"}/>
                                <DOTWvailibility available={availablility["T"]} DOTW={"Tue"}/>
                                <DOTWvailibility available={availablility["W"]} DOTW={"Wed"}/>
                                <DOTWvailibility available={availablility["TH"]} DOTW={"Thu"}/>
                                <DOTWvailibility available={availablility["F"]} DOTW={"Fri"}/>
                                <DOTWvailibility available={availablility["SAT"]} DOTW={"Sat"}/>
                            </div>
                        </div>
                        <hr></hr>
                        <div>
                            <h3>Certification(s):</h3>
                            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                {coach?.certification_urls && coach.certification_urls.length > 0 ? (
                                    coach.certification_urls.map((url, index) => (
                                        <img key={index} src={url} alt={`Certification ${index + 1}`} style={{ width: "100%", maxWidth: "200px", borderRadius: "10px", marginBottom: "10px" }}/>
                                    ))
                                ) : (
                                    <p>No certifications available.</p>
                                )}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button id="coach-accept" style={{backgroundColor: "#14AE5C", borderColor: "#14AE5C"}} onClick={handleAccept}>
                            Accept
                        </Button>
                        <Button id="coach-reject" style={{backgroundColor: "#711A19", borderColor: "#711A19"}} onClick={handleRejectModal}>
                            Reject
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Reject Reason Modal */}
            <Modal show={showRejectModal} onHide={handleRejectCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Reject Application</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please provide a reason for rejecting this application:</p>
                    <textarea id="rejection-reason" className="form-control" rows="3" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Enter rejection reason here..."/>
                </Modal.Body>
                <Modal.Footer>
                    <Button id="rejection-cancel" variant="secondary" onClick={handleRejectCancel}>
                        Cancel
                    </Button>
                    <Button id="confirm-rejection" style={{backgroundColor: "#711A19", borderColor: "#711A19"}} onClick={handleRejectConfirm}>
                        Confirm Rejection
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}