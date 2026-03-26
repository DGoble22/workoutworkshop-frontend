import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import {Toaster} from "react-hot-toast";
import "./app.css";

//Page Imports
import Home from "./pages/Shared/Home.jsx";
import WorkoutBuilder from "./pages/Shared/WorkoutBuilder.jsx";
import Coach from "./pages/Coach/Coach.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import FindCoach from "./pages/Shared/FindCoach.jsx";

function App() {

    return (
        <BrowserRouter>
            <div className="App">
                <Toaster position="bottom-right" toastOptions={{
                    style: {zIndex: 9999, background: "#333", color: "#fff", fontSize: "16px", padding: "10px 20px", borderRadius: "8px",},
                }} />
                <Navbar />
                <main style={{ padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="/workoutbuilder" element={<WorkoutBuilder/>} />
                        <Route path="/coach" element={<Coach/>} />
                        <Route path="/admin" element={<Admin/>} />
                        <Route path="/FindCoach" element={<FindCoach/>}/>
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;

