import React, {useState, useContext, useRef, useEffect} from "react";
import {Link, useLocation} from 'react-router-dom';
import './Navbar.css';
import Login from './Login.jsx';
import Register from './Register.jsx';
import { AuthContext } from '../context/AuthContext';
import UploadProfileModal from './UploadProfileModal.jsx';
import EditUsernameModal from './EditUsernameModal.jsx';
import ChangePasswordModal from './ChangePasswordModal.jsx';
import EditGoalsModal from './EditGoalsModal.jsx';
import DeleteAccountModal from './DeleteAccountModal.jsx';
import EditPaymentDetailsModal from './EditPaymentDetailsModal.jsx';

const Navbar = () => {
    const location = useLocation();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const { isAuthenticated, logout, user } = useContext(AuthContext);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showGoalsModal, setShowGoalsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPaymentDetailsModal, setShowPaymentDetailsModal] = useState(false);

    //Profile Dropdown
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleOpenLogin = () => {
        setShowLogin(true);
        setShowRegister(false);
    };

    const handleOpenRegister = () => {
        setShowRegister(true);
        setShowLogin(false);
    };

    const handleCloseModals = () => {
        setShowLogin(false);
        setShowRegister(false);
    };

    const handleLogout = () => {
        handleCloseModals();
        logout();
        window.location.href = '/'; // Redirect to home page after logout
    };

    const name = (user && (user.first_name))

    // Profile image will default to a placeholder if user doesn't have one
    const defaultAvatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    const profileImage = user?.profile_picture_url || defaultAvatar;

    //Closes menu if the user clicks outside menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    //Handles clicks within the menu
    const handleMenuClick = (action) => {
        setIsMenuOpen(false);

        switch(action) {
            case 'upload':
                setShowUploadModal(true);
                break;
            case 'username':
                setShowUsernameModal(true); // Open the modal
                break;
            case 'password':
                setShowPasswordModal(true); // <--- Open the modal
                break;
            case 'goals':
                setShowGoalsModal(true); // <--- Open the modal
                break;
            case 'payment':
                setShowPaymentDetailsModal(true);
                break;
            case 'delete':
                setShowDeleteModal(true); // <--- Open the modal
                break;
            case 'logout':
                handleLogout();
                break;
            default:
                break;
        }
    };

    return (
        <>
        <nav className="navbar navbar-expand navbar-dark navbar-gradient shadow-lg">
            <div className="container-fluid px-4" style={{ display: 'flex', alignItems: 'center' }}>

                {/* Logo */}
                <Link to="/" className="navbar-brand fw-bold fs-3">Workout Workshop</Link>

                {/* Navbar center links */}
                <div className="collapse navbar-collapse">
                    {isAuthenticated && (
                    <ul className="navbar-nav mx-auto gap-2">
                        <li className="nav-item">
                            <Link to="/" className={`nav-link px-4 py-2 rounded-pill fw-semibold ${location.pathname === '/' ? 'active' : ''}`}>
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/workouts" className={`nav-link px-4 py-2 rounded-pill fw-semibold ${location.pathname === '/workoutbuilder' ? 'active' : ''}`}>
                                Workout Builder
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/coach" className={`nav-link px-4 py-2 rounded-pill fw-semibold ${location.pathname === '/coach' ? 'active' : ''}`}>
                                Coach
                            </Link>
                        </li>
                        {user.role === 'A' && (
                        <li className="nav-item">
                            <Link to="/admin" className={`nav-link px-4 py-2 rounded-pill fw-semibold ${location.pathname === ('/admin') ? 'active' : ''}`}>
                                Admin
                            </Link>
                        </li>
                        )}
                    </ul>
                    )}

                    {/* Conditional rendering of auth buttons / profile icon */}
                    {!isAuthenticated ? (
                        <div className="navbar-auth-right">
                            <button className="nav-button me-2" onClick={handleOpenLogin}>Login</button>
                            <button className="nav-button" onClick={handleOpenRegister}>Register</button>
                        </div>
                    ) : (
                        <div className="profile-menu-container ms-auto" ref={menuRef}>
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="profile-icon shadow"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            />

                            {isMenuOpen && (
                                <div className="profile-dropdown">
                                    <div className="dropdown-header">
                                        Hi, {name}!
                                    </div>
                                    <hr />
                                    <button onClick={() => handleMenuClick('upload')}>Upload Profile Picture</button>
                                    <button onClick={() => handleMenuClick('username')}>Edit Username</button>
                                    <button onClick={() => handleMenuClick('password')}>Change Password</button>
                                    <button onClick={() => handleMenuClick('goals')}>Edit Goals</button>
                                    <button onClick={() => handleMenuClick('payment')}>Change Payment Details</button>
                                    <hr />
                                    <button onClick={() => handleMenuClick('logout')}>Sign Out</button>
                                    <button onClick={() => handleMenuClick('delete')} className="delete-btn">Delete Account</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </nav>
            {showLogin && (
                <Login onClose={handleCloseModals} onSwitchToRegister={handleOpenRegister}/>
            )}
            {showRegister && (
                <Register onClose={handleCloseModals} onSwitchToLogin={handleOpenLogin}/>
            )}
            {showUploadModal && (
                <UploadProfileModal onClose={() => setShowUploadModal(false)} />
            )}
            {showUsernameModal && (
                <EditUsernameModal onClose={() => setShowUsernameModal(false)} />
            )}
            {showPasswordModal && (
                <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
            )}
            {showGoalsModal && (
                <EditGoalsModal onClose={() => setShowGoalsModal(false)} />
            )}
            {showDeleteModal && (
                <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
            )}
            {showPaymentDetailsModal && (
                <EditPaymentDetailsModal onClose={() => setShowPaymentDetailsModal(false)} />
            )}
        </>
    );
};


export default Navbar