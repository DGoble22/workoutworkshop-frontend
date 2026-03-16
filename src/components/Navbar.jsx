import {React, useState, useContext} from "react";
import {Link, useLocation} from 'react-router-dom';
import './Navbar.css';
import Login from './Login.jsx';
import Register from './Register.jsx';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const { isAuthenticated, logout, user } = useContext(AuthContext);

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
    };

    const name = (user && (user.first_name))

    return (
        <>
        <nav className="navbar navbar-expand navbar-dark navbar-gradient shadow-lg">
            <div className="container-fluid px-4" style={{ display: 'flex', alignItems: 'center' }}>

                {/* Logo */}
                <Link to="/" className="navbar-brand fw-bold fs-3">Workout Workshop</Link>

                {/* Navbar center links */}
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mx-auto gap-2">
                        <li className="nav-item">
                            <Link to="/" className={`nav-link px-4 py-2 rounded-pill fw-semibold ${location.pathname === '/' ? 'active' : ''}`}>
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/workoutbuilder" className={`nav-link px-4 py-2 rounded-pill fw-semibold ${location.pathname === '/workoutbuilder' ? 'active' : ''}`}>
                                Workout Builder
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/coach" className={`nav-link px-4 py-2 rounded-pill fw-semibold ${location.pathname === '/coach' ? 'active' : ''}`}>
                                Coach
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/admin" className={`nav-link px-4 py-2 rounded-pill fw-semibold ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
                                Admin
                            </Link>
                        </li>
                    </ul>

                    {/* Conditional rendering of auth buttons */}
                    {!isAuthenticated ? (
                        <>
                            <button className="nav-button me-2" onClick={handleOpenLogin}>Login</button>
                            <button className="nav-button" onClick={handleOpenRegister}>Register</button>
                        </>
                    ) : (
                        <>
                            <div className="navbar-greeting" style={{ marginRight: '12px', color: '#fff', fontWeight: 600 }}>Hello, {name}</div>
                            <button className="nav-button" onClick={handleLogout}>Logout</button>
                        </>
                    )}
                </div>
                <div style={{ width: "100px" }} className="d-none d-lg-block"></div>

            </div>
        </nav>
            {showLogin && (
                <Login onClose={handleCloseModals} onSwitchToRegister={handleOpenRegister}/>
            )}
            {showRegister && (
                <Register onClose={handleCloseModals} onSwitchToLogin={handleOpenLogin}/>
            )}
        </>
    );
};

export default Navbar