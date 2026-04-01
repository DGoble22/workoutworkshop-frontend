import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import {Toaster} from "react-hot-toast";

//Page Imports
import Home from "./pages/Shared/Home.jsx";
import WorkoutBuilder from "./pages/Shared/WorkoutBuilder.jsx";
import Coach from "./pages/Coach/Coach.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import FindCoach from "./pages/Shared/FindCoach.jsx";
import WorkoutDashboard from "./pages/Shared/WorkoutDashboard.jsx";

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

    return (
        <div className="App">
            <Toaster position="bottom-left" toastOptions={{
                style: {zIndex: 9999, background: "#333", color: "#fff", fontSize: "16px", padding: "10px 20px", borderRadius: "8px",},
            }} />
            <Navbar />
            <main style={{ padding: isWorkoutBuilderRoute ? 0 : "20px" }}>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/workouts" element={<WorkoutDashboard />} />
                    <Route path="/workout-builder/:day" element={<WorkoutBuilder />} />
                    <Route path="/coach" element={<Coach/>} />
                    <Route path="/admin" element={<Admin/>} />
                    <Route path="/FindCoach" element={<FindCoach/>}/>
                </Routes>
            </main>
        </div>
    );
}

export default App;

