import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ChatModal from "./components/ChatModal.jsx";
import {Toaster} from "react-hot-toast";
import {AuthContext} from "./context/authContext";

//Page Imports
import Home from "./pages/Shared/Home.jsx";
import WorkoutBuilder from "./pages/Shared/WorkoutBuilder.jsx";
import Coach from "./pages/Coach/Coach.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import FindCoach from "./pages/Shared/FindCoach.jsx";
import WorkoutDashboard from "./pages/Shared/WorkoutDashboard.jsx";
import WorkoutLog from "./pages/Shared/WorkoutLog.jsx";
import WorkoutEdit from "./pages/Shared/WorkoutEdit.jsx";
import WorkoutLibrary from "./pages/Shared/WorkoutLibrary.jsx"
import {useContext, useState} from "react";


function App() {
    return (
        <BrowserRouter>
            <AppLayout />
        </BrowserRouter>
    );
}

function AppLayout() {
    const { pathname } = useLocation();
    const isWorkoutBuilderRoute = pathname.startsWith("/workout-builder/");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className="App">
            <Toaster position="bottom-left" toastOptions={{
                style: {zIndex: 9999, background: "#333", color: "#fff", fontSize: "16px", padding: "10px 20px", borderRadius: "8px",},
            }} />
            <Navbar />
            {isAuthenticated && <button className="floating-chat-btn" onClick={() => setIsChatOpen(true)}>💬</button>}
            <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            <main style={{ padding: isWorkoutBuilderRoute ? 0 : "20px" }}>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/workouts" element={<WorkoutDashboard />} />
                    <Route path="/workout-builder/:day" element={<WorkoutBuilder />} />
                    <Route path="/workout-log" element={<WorkoutLog />} />
                    <Route path="/workout-edit/:planId" element={<WorkoutEdit />} />
                    <Route path="/workout-library" element={<WorkoutLibrary />} />
                    <Route path="/coach" element={<Coach/>} />
                    <Route path="/admin" element={<Admin/>} />
                    <Route path="/FindCoach" element={<FindCoach/>}/>
                </Routes>
            </main>
        </div>
    );
}

export default App;
