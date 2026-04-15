import React, {useContext, useEffect, useState} from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function WorkoutCalendar() {
    // Start with the current date
    const [currentDate, setCurrentDate] = useState(new Date());

    // This will hold the workouts from the database.
    const [workouts, setWorkouts] = useState([]);

    //Will be used to grab user ID
    const { user } = useContext(AuthContext);

    // Fetches workouts from the backend
    useEffect(() => {
        const fetchWorkouts = async () => {
            if (!user || !user.id) return;

            try {
                const response = await fetch(`http://localhost:5000/api/workouts/log/${user.id}`);
                if (!response.ok) {
                    console.error("Backend returned an error:", response.status);
                }

                const data = await response.json();

                if (data.status === 'success') {
                    setWorkouts(data.data);
                    console.log("YUP, got workouts:", data.data);
                }
            } catch (error) {
                console.error("Error fetching calendar workouts:", error);
            }
        };

        fetchWorkouts();
    }, [user]);

    // Gets year and month numbers from current date
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Month name for header
    const monthName = currentDate.toLocaleString('default', { month: 'long' }).toUpperCase();

    // Get the day of the week for the first of the month
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    // Figure out how many days are in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // For navigating different months
    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    // Creates grid array with empty slots for days that aren't in the month
    const blankDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

    // Create slots for the actual days of the month
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Gets the workout for a specific day, if it exists
    const getWorkoutForDay = (day) => {
        // Adds leading zero to month and day for consistent formatting
        const formattedMonth = String(month + 1).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');

        // Builds string in this format: MM-DD-YYYY
        const formattedDate = `${formattedMonth}-${formattedDay}-${year}`;

        return workouts.find(w => w.date === formattedDate || w.planned_date === formattedDate);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh", backgroundColor: "#303030", fontFamily: "sans-serif" }}>

            {/* Month header with arrows */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#847979", padding: "20px 0", color: "white", fontSize: "2.5rem", gap: "20px" }}>
                <button onClick={handlePrevMonth} style={ARROW_BTN}>&lt;</button>
                <span style={{ minWidth: "300px", textAlign: "center", letterSpacing: "2px" }}>{monthName}</span>
                <button onClick={handleNextMonth} style={ARROW_BTN}>&gt;</button>
            </div>

            {/* Calendar Body */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>

                {/* Days of the week row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px", backgroundColor: "white", padding: "10px", borderRadius: "10px" }}>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day} style={{ backgroundColor: "black", color: "white", textAlign: "center", padding: "5px", borderRadius: "20px", fontWeight: "bold" }}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px", flex: 1 }}>

                    {/* Empty boxes */}
                    {blankDays.map(step => (
                        <div key={`blank-${step}`} style={{ backgroundColor: "transparent" }}></div>
                    ))}

                    {/* Rendered boxes */}
                    {monthDays.map(day => {
                        const dailyWorkout = getWorkoutForDay(day);

                        // get today's date for comparison
                        const realToday = new Date();

                        // Check if this day matches the day, month, and year of the real today
                        const isToday =
                            realToday.getDate() === day &&
                            realToday.getMonth() === month &&
                            realToday.getFullYear() === year;

                        // Apply a special style if it's today
                        const currentBoxStyle = {
                            ...DAY_BOX_STYLE,
                            backgroundColor: isToday ? "#847979" : DAY_BOX_STYLE.backgroundColor,
                            border: isToday ? "4px solid #711A19" : "none",
                        };

                        return (
                            <div key={day} style={currentBoxStyle}>
                                <div style={{ fontWeight: "bold", marginBottom: "5px", color: isToday ? "#711A19" : "black" }}>
                                    {day}
                                </div>

                                {/* If a workout exists for this day, display its title */}
                                {dailyWorkout && (
                                    <div style={{ backgroundColor: "#711A29", color: "white", padding: "2px 5px", borderRadius: "5px", fontSize: "0.85rem", textAlign: "center" }}>
                                        {dailyWorkout.title || dailyWorkout.workout_name}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Styles
const ARROW_BTN = {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "2.5rem",
    cursor: "pointer",
    padding: "0 20px"
};

const DAY_BOX_STYLE = {
    backgroundColor: "#CDC8C8",
    borderRadius: "10px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    minHeight: "100px",
    color: "black",
    boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)"
};