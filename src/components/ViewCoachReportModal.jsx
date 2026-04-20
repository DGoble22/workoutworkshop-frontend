import react, {useEffect} from "react";
import { Modal, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import React, { useState, useContext } from "react";
import CoachInfoModal from "./CoachInfoModal";
import { AuthContext } from '../context/AuthContext';
import ReactDOM from "react-dom";

//star images for ratings
import onestars from "../images/1_star_NOBG.png"
import twostars from "../images/2_star_NOBG.png"
import threestars from "../images/3_star_NOBG.png"
import fourstars from "../images/4_star_NOBG.png"
import fivestars from "../images/5_star_NOBG.png"

const modalStyles = `
    .report-modal-backdrop { z-index: 440 !important; }
    .report-modal-window { z-index: 450 !important; }
`;

export default function ViewCoachReportModal({show, handleClose, reportID}) {
    const { user , token} = useContext(AuthContext);
    const [report, setReport] = react.useState(null);
    const [coach, setCoach] = react.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [showCoachInfoModal, setShowCoachInfoModal] = useState(false);
    const [showDisableModal, setShowDisableModal] = useState(false);
    const [showBanModal, setShowBanModal] = useState(false);
    const [disableReason, setDisableReason] = useState("");
    const [disableDuration, setDisableDuration] = useState({ day: "", month: "", year: "" });
    const [banReason, setBanReason] = useState("");
    const [category, setCategory] = useState("");
    const [stars, setStars] = useState([]);

    useEffect(() => {
        // Fetch specific coach report from the API
        const fetchCoachReport = async () => {
            setLoading(true);
            try {
                const apiBase = import.meta.env.VITE_API_URL;
                const url = `${apiBase}/admin/coach-reports/${reportID}`;
                const response = await fetch( url, {
                    method: 'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    console.error("Failed to fetch coach report");
                    return;
                }
                const data = await response.json();
                setReport(data);
                setCoach(data.coach);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        }

        if (show) {
            fetchCoachReport();
        }
    }, [reportID, show]);

    function handleDismissReport() {
        const dismissReport = async () => {
            try {
                const apiBase = import.meta.env.VITE_API_URL;
                const url = `${apiBase}/admin/coach-reports/${reportID}/dismiss`;
                const response = await fetch( url, {
                    method: 'PUT',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    console.error("Failed to dismiss coach report");
                    return;
                }
                toast.success("Coach report dismissed successfully!");
                handleClose();
            } catch (error) {
                toast.error(error.message);
            }
        };

        dismissReport();
    }

    const handleViewCoachInfo = () => {
        let categoryValue = "Strength";
        if (coach.is_nutritionist) {
            categoryValue = "Strength, Nutrition";
        }
        setCategory(categoryValue);
        let stars
        if(coach.rating){
            if (coach.rating >= 4.5){stars = fivestars}
            else if (coach.rating >= 3.5){stars = fourstars}
            else if (coach.rating >= 2.5){stars = threestars}
            else if (coach.rating >= 1.5){stars = twostars}
            else{stars = onestars}
        }
        setStars(stars);
        setShowCoachInfoModal(true);
    };

    const handleCloseCoachInfoModal = () => {
        setShowCoachInfoModal(false);
    };

    const handleDisableModal = () => {
        setShowDisableModal(true);
    };

    const handleBanModal = () => {
        setShowBanModal(true);
    };

    const handleDisableConfirm = () => {
        handleDisable();
        console.log("Disable reason:", disableReason);
        console.log("Disable duration:", disableDuration);
        setShowDisableModal(false);
    };

    function handleDisable() {
        const disableCoach = async () => {
            try {
                const apiBase = import.meta.env.VITE_API_URL;
                const url = `${apiBase}/admin/coach-reports/${reportID}/disable`;
                const response = await fetch(url, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({user_id: user.id ,reason: disableReason, day: disableDuration.day, month: disableDuration.month, year: disableDuration.year }),
                });
                if (!response.ok) {
                    console.error("Failed to disable coach");
                    return;
                }
                toast.success("Coach disabled successfully!");
                handleClose();
            }
            catch (error) {
                toast.error(error.message);
            }
        };

        disableCoach();
    }

    const handleBanConfirm = () => {
        handleBan();
        console.log("Ban reason:", banReason);
        setShowBanModal(false);
    };

    function handleBan() {
        const banCoach = async () => {
            try {
                const apiBase = import.meta.env.VITE_API_URL;
                const url = `${apiBase}/admin/coach-reports/${reportID}/ban`;
                const response = await fetch(url, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({user_id: user.id, reason: banReason }),
                });
                if (!response.ok) {
                    console.error("Failed to ban coach");
                    return;
                }
                toast.success("Coach banned successfully!");
                handleClose();
            }
            catch (error) {
                toast.error(error.message);
            }
        }

        banCoach();
    }

    const handleModalClose = () => {
        setShowDisableModal(false);
        setShowBanModal(false);
    };


    if (loading || !report || !coach) {
        return (
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body>
                    <p>Loading...</p>
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <>
            <style>{modalStyles}</style>
            {/* Main modal */}
            <Modal show={show} onHide={handleClose} centered keyboard={false} className="report-modal-window" backdropClassName="report-modal-backdrop">
                <div onClick={(e) => e.stopPropagation()}>
                    <Modal.Header closeButton>
                        <Modal.Title>{coach?.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Button id="coach-profile" onClick={handleViewCoachInfo} style={{ display: 'block', margin: '0 auto' ,backgroundColor: "#ff0000", borderColor: "#ff0000"}}>View Profile</Button>
                        <h3 style={{textAlign: "center", marginTop: "10px"}}>Report Details</h3>
                        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginTop: '16px' }}>
                            <p>"{report?.reason}"</p>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button id="dismiss-report" style={{backgroundColor: "#14AE5C", borderColor: "#14AE5C"}} onClick={handleDismissReport}>
                            Dismiss Report
                        </Button>
                        <Button id="disable-coach" style={{backgroundColor: "#ff0000", borderColor: "#ff0000"}} onClick={handleDisableModal}>
                            Disable Coach
                        </Button>
                        <Button id="ban-coach" style={{backgroundColor: "#ff0000", borderColor: "#ff0000"}} onClick={handleBanModal}>
                            Ban Coach
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

            {/* disable account modal */}
            <Modal show={showDisableModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Disable Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please provide the duration for disabling the account:</p>
                    <div className="d-flex justify-content-between">
                        <input id="disable-day" type="number" className="form-control me-2" placeholder="Day" value={disableDuration.day} onChange={(e) => setDisableDuration({ ...disableDuration, day: e.target.value })}/>
                        <input id="disable-month" type="number" className="form-control me-2" placeholder="Month" value={disableDuration.month} onChange={(e) => setDisableDuration({ ...disableDuration, month: e.target.value })}/>
                        <input id="disable-year" type="number" className="form-control" placeholder="Year" value={disableDuration.year} onChange={(e) => setDisableDuration({ ...disableDuration, year: e.target.value })}/>
                    </div>
                    <p className="mt-3">Reason for disabling the account:</p>
                    <textarea id="diable-reason" className="form-control" rows="3" value={disableReason} onChange={(e) => setDisableReason(e.target.value)} placeholder="Enter reason here..."/>
                </Modal.Body>
                <Modal.Footer>
                    <Button id="disable-cancel" variant="secondary" onClick={handleModalClose}>
                        Cancel
                    </Button>
                    <Button id="disable-confirm" style={{backgroundColor: "#ff0000", borderColor: "#ff0000"}} onClick={handleDisableConfirm}>
                        Confirm Disable
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Ban account modal */}
            <Modal show={showBanModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Ban Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please provide a reason for banning the account:</p>
                    <textarea id="ban-reason" className="form-control" rows="3" value={banReason} onChange={(e) => setBanReason(e.target.value)} placeholder="Enter reason here..."/>
                </Modal.Body>
                <Modal.Footer>
                    <Button id="cancel-ban" variant="secondary" onClick={handleModalClose}>
                        Cancel
                    </Button>
                    <Button id="confirm-ban" style={{backgroundColor: "#ff0000", borderColor: "#ff0000"}} onClick={handleBanConfirm}>
                        Confirm Ban
                    </Button>
                </Modal.Footer>
            </Modal>

            {showCoachInfoModal && (
                <CoachInfoModal
                    show={showCoachInfoModal}
                    handleClose={handleCloseCoachInfoModal}
                    name={coach?.name}
                    URL={coach?.profile_picture}
                    price={coach?.pricing}
                    category={category}
                    id={coach?.coach_id}
                    bio={coach?.bio}
                    rating={stars}
                    adminView={true}
                    style={{ zIndex: 2000, position: 'relative' }}
                />
            )}
        </>
    )
}