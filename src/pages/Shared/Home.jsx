import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Login from "../../components/Login";
import Register from "../../components/Register";
import ProgressTracker from "../../components/ProgressTracker"; // Import feature
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'; // npm install --save react-circular-progressbar
import 'react-circular-progressbar/dist/styles.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // npm i recharts

//star images for ratings
import onestars from "../../images/1_star_NOBG.png"
import twostars from "../../images/2_star_NOBG.png"
import threestars from "../../images/3_star_NOBG.png"
import fourstars from "../../images/4_star_NOBG.png"
import fivestars from "../../images/5_star_NOBG.png"

import DefaultProfilePic from '../../images/DefaultProfile.jpg'
import CoachInfoModal from "../../components/CoachInfoModal";
import toast from "react-hot-toast";

export default function Home() {
    const { isAuthenticated, user , token} = useContext(AuthContext);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [dailyRating, setDailyRating] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
    const [showCoach, setShowCoach] = useState(false);
    const today = format(new Date(), "MM-dd-yyyy");
    const [weightLogs, setWeightLogs] = useState([]);

    //data to handle which home page user sees
    const [hasWorkout, setHasWorkout] = useState(false); //track if user has workout
    const [hasCoach, setHasCoach] = useState(false); //track if user has a coach
    const [coachID, setCoachID] = useState(null); //get id of the user's coach

    const [coachData, setCoachData] = useState([])
    const [imgURL, setImgURL] = useState("")
    const [category, setCategory] = useState("Strength")
    const [showStars, setShowStars] = useState(fivestars)

    //handle showing workout tracker
    const [workoutPlan, setWorkoutPlan] = useState([]); // track user's workout plan
    const [completedExercises, setCompletedExercises] = useState([]); // store complete exercises
    const [inProgress, setInProgress] = useState([]); // store exercises still in progress
    const [percentage, setPercentage] = useState(0);

    const navigate = useNavigate();


    const todayDate = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (isAuthenticated) {
            // Fetch the daily rating if it exists for today
            const fetchDailyRating = async () => {
                try {
                    const apiBase = import.meta.env.VITE_API_URL;
                    const url = `${apiBase}/user/check-survey`;
                    const response = await fetch(`${url}?date=${todayDate}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token // Include user token for backend to identify user
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.rating) {
                            setDailyRating(data.rating);
                        }
                    } else {
                        console.error("Failed to fetch daily rating.");
                    }
                } catch (error) {
                    console.error("Error fetching daily rating:", error);
                }
            };

            //check if user has a workout planned
            const getWorkout = async () => {
                try {
                    
                    const apiBase = import.meta.env.VITE_API_URL;
                    await axios.get(`${apiBase}/api/workouts/daily-plan/${user.id}/${today}`)
                    .then(res => {setWorkoutPlan(res.data["data"]); setHasWorkout(res.data["hasPlan"]);})
                    .catch(err => console.log(err))
                    
                } catch (error) {
                    console.error("Error today's workoutplan", error);
                }
            };

            // get coaching information for the user
            const hasCoach = async () =>{
                try {
                    const apiBase = import.meta.env.VITE_API_URL;
                    await axios.get(`${apiBase}/user/has-coach/${user.id}`)
                    .then(res => { setHasCoach(res.data["hasCoach"]); setCoachID(res.data["coach_id"]); })
                    .catch(err => console.log(err))
                } catch (error){
                    console.log("error fetching coaching information")
                }
            };

            const getWeightLogs = async () => {
                const apiBase = import.meta.env.VITE_API_URL;
                await axios.get(`${apiBase}/user/weight-log/${user.id}`)
                .then(
                    //format data from axios and add it to weightLogs
                    res => {
                        setWeightLogs(res.data["data"].map(log=> ({
                            date: new Date(log.log_date).toLocaleDateString("en-US", {
                                'month': "short",
                                'day': "numeric",
                                'year': "numeric"
                            }),
                            weight: log.weight
                        })) )
                    }
                )
                .catch(err => console.log(err))
            };
            

        fetchDailyRating();
        getWorkout();
        hasCoach();
        getWeightLogs();

        } //end of isAuthenticated
    }, [isAuthenticated, selectedDate]);

    useEffect(()=>{
        //initialize lists
        setCompletedExercises(workoutPlan.filter(exercise => exercise.completed)) 
        setInProgress(workoutPlan.filter(exercise => !exercise.completed))
    }, [workoutPlan])

    useEffect(()=>{
        setPercentage(completedExercises.length/workoutPlan.length)
    }, [workoutPlan, completedExercises])

    useEffect(()=>{
        if(hasCoach){
            const apiBase = import.meta.env.VITE_API_URL;
            axios.get(`${apiBase}/coach/coach-data/${coachID}`)
            .then(res => {setCoachData(res.data["data"][0])})
            .catch(err => console.log(err))
        }
    },[hasCoach])

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

    const handleOpenCoach = () => {
        if (coachData.URL === "error: Field 'null' not found" || !coachData.URL ){
            setImgURL(DefaultProfilePic)
        }
        else{
            setImgURL(coachData.URL );
        }
        
          //handle showing when a coach is a nutritionist
        if(coachData.nutrition){
            setCategory("Strength, Nutritionist")
        }

        let stars
        if(coachData.rating){
            if (coachData.rating >= 4.5){stars = fivestars}
            else if (coachData.rating >= 3.5){stars = fourstars}
            else if (coachData.rating >= 2.5){stars = threestars}
            else if (coachData.rating >= 1.5){stars = twostars}
            else{stars = onestars}
        }
        setShowStars(stars)
        setShowCoach(true)
    }

    const handleCloseCoach = () => {setShowCoach(false)}

    const handleDayClick = (day) => {
        //Navigate to the builder with day
        navigate(`/workout-builder/${day}`, {state:{"day": day}});
    };

    const completeExercise = async (indexToRemove, exercise) => {
        const payload = {
            plan_exercise_id: exercise.plan_exercise_id,
            complete: !exercise.completed
        };


        try{
            const apiBase = import.meta.env.VITE_API_URL;
            await axios.post(`${apiBase}/api/workouts/complete-exercise`, payload);
        
            if (exercise.completed){
                exercise.completed = false
                setInProgress([...inProgress, exercise])
                setCompletedExercises(completedExercises.filter((_, index) => index !== indexToRemove));
            }
            else{
                exercise.completed = true
                setCompletedExercises([...completedExercises, exercise])
                setInProgress(inProgress.filter((_, index) => index !== indexToRemove));
            }
        } catch (error){ console.error("Error saving workout", error);}
        
    }

    const handleStarClick = async (rating) => {
        const today = new Date().toISOString().split('T')[0];
        try {
            const apiBase = import.meta.env.VITE_API_URL;
            const url = `${apiBase}/user/daily-survey`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({ date: today, rating }),
            });

            if (response.ok) {
                const data = await response.json();
                setDailyRating(data.rating); // Update the daily rating with the response data
            } else {
                console.error("Failed to update daily rating.");
        }
        } catch (error) {
            console.error("Error updating daily rating:", error);
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`star ${dailyRating >= i ? "selected" : ""}`} onClick={() => handleStarClick(i)}>
                    ★
                </span>
            );
        }
        return stars;
    };

    const handleFindCoach = () => {
        window.location.href = "/FindCoach";
    };

    const handleMenuClick = (menuItem) => {
        navigate(`/${menuItem.toLowerCase()}`)
    };

    //States and hook for exercises library management
    const [Arms, setArms] = useState([]);
    const [Legs, setLegs] = useState([]);
    const [Chest, setChest] = useState([]);
    const [Back, setBack] = useState([])
    const [Cardio, setCardio] = useState([])
    const [Core, setCore] = useState([])

    const fetchWorkouts = async () => {
        try {
            const apiBase = import.meta.env.VITE_API_URL;
            const url = `${apiBase}/admin/exercises`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) {
                console.error("Failed to fetch exercises");
            }
            const data = await response.json();

            const grouped = data.data || {};
            setArms(grouped.Arms || []);
            setLegs(grouped.Legs || []);
            setChest(grouped.Chest || []);
            setBack(grouped.Back || []);
            setCardio(grouped.Cardio || []);
            setCore(grouped.Core || []);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, [token]);

    const testimonials = [
        {
            name: "Alex Johnson",
            role: "Client",
            text: "Workout Workshop completely changed how I track my lifting. The coach connection is seamless!",
            stars: 5
        },
        {
            name: "Sarah Miller",
            role: "Marathon Runner",
            text: "The progress metrics helped me shave 10 minutes off my PR. Seeing my weight and performance trends in one place is key.",
            stars: 5
        },
        {
            name: "Mike Ross",
            role: "Coach",
            text: "As a coach, this platform allows me to manage 20+ clients without losing track of their individual goals.",
            stars: 5
        }
    ];

    const [isExpanded, setIsExpanded] = useState(false);
    const allExercises = [...Arms, ...Legs, ...Chest, ...Back, ...Cardio, ...Core];
    const visibleExercises = isExpanded ? allExercises : allExercises.slice(0, 6);
    const firstName = user?.first_name;
    return (
        <>
        <div className="home-page">
            {!isAuthenticated ? (
                <>
                    <section className="home-hero container">
                        <div className="home-hero-card text-center">
                            <p className="home-kicker">Train smarter</p>
                            <h1 className="home-title">Welcome to Workout Workshop</h1>
                            <p className="home-subtitle">Build plan, track goals, and connect with coaches.</p>

                            <div className="home-actions">
                                <button id="home-login" type="button" className="home-auth-btn home-auth-btn-login" onClick={handleOpenLogin}>
                                    Login
                                </button>
                                <button id="home-register" type="button" className="home-auth-btn home-auth-btn-register" onClick={handleOpenRegister}>
                                    Register
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* TESTIMONIALS */}
                    <section className="workout-preview-section container" style={{ marginTop: '40px' }}>
                        <div className="preview-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                            <h2 className="home-title" style={{ fontSize: '2rem' }}>What Our Members Say</h2>
                            <p className="home-subtitle" style={{ margin: '0', textAlign: 'left' }}>Hear from our community of athletes and coaches.</p>
                        </div>

                        <div className="workout-grid" style={{ marginTop: '32px' }}>
                            {testimonials.map((t, index) => (
                                <div key={index} className="testimonial-card">
                                    <div className="testimonial-stars">
                                        {"★".repeat(t.stars)}
                                    </div>
                                    <p className="testimonial-text">{t.text}</p>
                                    <div className="testimonial-author">
                                        <strong>{t.name}</strong>
                                        <span className="workout-tag" style={{ marginTop: '8px', display: 'inline-block' }}>{t.role}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* WORKOUT PREVIEW */}
                    <section className="workout-preview-section container">
                        <div className="preview-header">
                            <h2>Explore Our Exercises</h2>
                            {/* Toggle the expanded state instead of navigating */}
                            <button className="view-all-btn" onClick={() => setIsExpanded(!isExpanded)}>
                                {isExpanded ? "Show Less" : "View All Exercises"}
                            </button>
                        </div>

                        <div className="workout-grid">
                            {visibleExercises.length > 0 ? (
                                visibleExercises.map((ex, index) => (
                                    <div key={index} className="workout-preview-card">
                                        <div className="workout-card-image">
                                            <img
                                                src={ex.thumbnail || 'https://via.placeholder.com/300x200?text=No+Thumbnail'}
                                                alt={ex.name}
                                            />
                                        </div>
                                        <div className="workout-card-info">
                                            <h4>{ex.name}</h4>
                                            <span className="workout-tag">{ex.muscle_group}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Loading exercises...</p>
                            )}
                        </div>
                    </section>


                </>
            ) : !hasWorkout ? (
                <section className="home-dashboard container">
                    {/* Days of the Week */}
                    <div className="home-top-bar">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                            <button
                                className="home-DOTW-card"
                                key={day}
                                onClick={() => handleDayClick(day)}
                                onMouseOver={(e) => e.target.style.transform = "scale(1.05)"} 
                                onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Dashboard</h1>
                        <p className="dashboard-subtitle">Welcome back, {firstName}</p>
                    </div>

                    <div className="dashboard-column">
                        <div className="dashboard-card">
                            <h3>Workout Plan</h3>
                            <p>You have no selected workout plan.</p>
                            <div className="dashboard-card-actions">
                                <button>Create a Plan</button>
                                {hasCoach ? (<button id="home-coach" onClick={()=>handleOpenCoach()}>Your Coach</button>) : (<button id="home-coach" onClick={()=>navigate('/findCoach')}>Get Coaching</button>)}
                            </div>
                        </div>

                        {/* PROGRESS TRACKER FEATURE */}
                        <div className="dashboard-card">
                            <ProgressTracker userId={user.id} token={token} />
                        </div>

                        <div className="dashboard-card">
                            <h3>Daily Survey</h3>
                            <p>Track how you feel each day (1-5) after training.</p>
                            <div className="daily-survey-stars">
                                {renderStars()}
                            </div>
                        </div>

                        <div className="dashboard-card-progress-metric">
                            <h3>Progress Metrics</h3>
                            <p>Review trends in performance, weight, and goal progress over time.</p>
                            <div style={{ display: "flex", width: "100%", minWidth: 280, height: 220, alignItems: "center", justifyContent: "center" }}>
                                <ResponsiveContainer width="100%" height={220} minWidth={280}>
                                    <LineChart responsive data={weightLogs} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <XAxis dataKey="date"/>
                                        <YAxis width={40} domain={['dataMin-5', 'dataMax+5']}/>
                                        <Tooltip />
                                        <Line type="monotone" dataKey="weight" stroke="#84d88b" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </section>
            ) : ( 
                <section className="home-dashboard container">
                    
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Workout</h1>
                        {/* Days of the Week */}
                        <div className="home-top-bar">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                <button
                                    className="home-DOTW-card"
                                    key={day}
                                    onClick={() => handleDayClick(day)}
                                    onMouseOver={(e) => e.target.style.transform = "scale(1.05)"} 
                                    onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-column">
                        <div className="dashboard-card-workout">
                            {/*add homepage data here*/}
                            <div className="home-exercise-card"> 
                                <div className="home-exercise-card-header">
                                    Workouts
                                </div>
                                <div className="home-exercise-card-holder">
                                    
                                    <div className="exercise-categories">In Progress</div>
                                    {inProgress.map((exercise,index)=>(
                                        <button key={index} onClick={()=>completeExercise(index, exercise)}className="exercise-inprogress">{exercise.name}  {exercise.sets} X {exercise.reps}</button>
                                    ))}
                                    <div className="exercise-categories">Completed</div>
                                    {completedExercises.map((exercise,index) =>
                                        <button key={index} onClick={()=>completeExercise(index, exercise)} className="exercise-completed">{exercise.name}  {exercise.sets} X {exercise.reps}</button>
                                    )}
                                </div>
                            </div>
                            <div className="home-button-storage">
                                <div
                                    className="dashboard-exercise-tracker-card"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "35px"
                                    }}
                                >
                                    <div style={{ width: "60%", height: "60%" }}>
                                        <CircularProgressbar
                                            styles={buildStyles({ textColor: "#000000", pathColor: "#14AE5C" })}
                                            value={percentage}
                                            maxValue={1}
                                            text={`${completedExercises.length}/${workoutPlan.length}`}
                                        />
                                    </div>
                                    <span>Workouts Completed</span>
                                </div>

                                 <button className="home-menu-button" onClick={() => handleMenuClick("/calendar")}>
                                    {/* Calendar Icon */}
                                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                        <circle cx="8" cy="15" r="1.5" fill="currentColor" stroke="none"></circle>
                                        <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none"></circle>
                                        <circle cx="16" cy="15" r="1.5" fill="currentColor" stroke="none"></circle>
                                    </svg>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.2" }}>
                                        <span>Calendar</span>
                                        <span>Viewer</span>
                                    </div>
                                </button>

                                {hasCoach ? (<button className="home-menu-button" onClick={()=>handleOpenCoach()}>Your Coach</button>) : (<button className="home-menu-button" onClick={()=>navigate('/findCoach')}>Get Coaching</button>)}
                            </div>
                            
                        </div>

                            {/* PROGRESS TRACKER FEATURE (ADDED) */}
                            <div className="dashboard-card">
                                <ProgressTracker userId={user.id} token={token} />
                            </div>

                        <div className="dashboard-card">
                            <h3>Daily Survey</h3>
                            <p>Track how you feel each day (1-5) after training.</p>
                            <div className="daily-survey-stars">
                                {renderStars()}
                            </div>
                        </div>

                        <div className="dashboard-card-progress-metric">
                            <h3>Progress Metrics</h3>
                            <p>Review trends in performance, weight, and goal progress over time.</p>
                            <div style={{ display: "flex", width: "100%", minWidth: 280, height: 220, alignItems: "center", justifyContent: "center" }}>
                                <ResponsiveContainer width="100%" height={220} minWidth={280}>
                                    <LineChart responsive data={weightLogs} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <XAxis dataKey="date"/>
                                        <YAxis width={40} domain={['dataMin-5', 'dataMax+5']}/>
                                        <Tooltip />
                                        <Line type="monotone" dataKey="weight" stroke="#84d88b" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </section>
                // coach info modal here, need to get data to send it and work on opening and closing logic
            )}

            {showLogin && (
                <Login
                    onClose={handleCloseModals}
                    onSwitchToRegister={handleOpenRegister}
                />
            )}
            {showRegister && (
                <Register
                    onClose={handleCloseModals}
                    onSwitchToLogin={handleOpenLogin}
                />
            )}
        </div>
        <CoachInfoModal 
            show={showCoach} 
            handleClose={handleCloseCoach} 
            name={coachData["Name"]} 
            URL={imgURL} 
            price={coachData["pricing"]} 
            category={category} 
            bio={coachData["bio"]} 
            id={coachID} 
            rating={showStars}
        />
    </>
    );
}