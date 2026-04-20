import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Admin.css";
import toast from "react-hot-toast";
import ViewCoachApplicationModal from "../../components/ViewCoachApplicationModal.jsx";
import ViewCoachReportModal from "../../components/ViewCoachReportModal.jsx";
import {Button} from "react-bootstrap";
import AdminExerciseModal from '../../components/AdminExerciseModal';

export default function Admin() {
    const { isAuthenticated, user , token} = useContext(AuthContext);
    const firstName = user?.first_name;

    // State for ViewCoachApplicationModal
    const [showViewCoachApplicationModal, setShowViewCoachApplicationModal] = useState(false);
    const [selectedCoachApplication, setSelectedCoachApplication] = useState(null);

    const handleOpenViewCoachApplicationModal = (coach) => {
        setSelectedCoachApplication(coach);
        setShowViewCoachApplicationModal(true);
    };

    const handleCloseViewCoachApplicationModal = () => {
        setShowViewCoachApplicationModal(false);
        setSelectedCoachApplication(null);
    };

    // States for User Search / Pagination
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPageUsers, setCurrentPageUsers] = useState(1);
    const [totalPagesUsers, setTotalPagesUsers] = useState(1);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const usersPerPage = 10;

    useEffect(() => {
        // Fetch users from the API
        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                const apiBase = import.meta.env.VITE_API_URL;
                const url = `${apiBase}/admin/fetch-users?page=${currentPageUsers}&limit=${usersPerPage}&search=${searchQuery}`;
                const response = await fetch( url, {
                    method: 'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    console.error("Failed to fetch users");
                }
                const data = await response.json();
                setUsers(data.users);
                setTotalPagesUsers(data.totalPages);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, [currentPageUsers, searchQuery]);

    const handleUserSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPageUsers(1); // Reset to the first page on new search
    };

    const handlePageChangeUsers = (newPage) => {
        setCurrentPageUsers(newPage);
    };

    // States for Coach Applications / Pagination
    const [coachApplications, setCoachApplications] = useState([]);
    const [currentPageCoachApplications, setCurrentPageCoachApplications] = useState(1); // Default to page 1
    const [totalPagesCoachApplications, setTotalPagesCoachApplications] = useState(1);
    const [loadingCoachApplications, setLoadingCoachApplications] = useState(false);
    const coachApplicationsPerPage = 10; // Default to 10 applications per page

    useEffect(() => {
        // Fetch coach applications from the API
        const fetchCoachApplications = async () => {
            setLoadingCoachApplications(true);
            try {
                const apiBase = import.meta.env.VITE_API_URL;
                const url = `${apiBase}/admin/coach-applications?page=${currentPageCoachApplications}&limit=${coachApplicationsPerPage}`;
                const response = await fetch( url, {
                    method: 'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    console.error("Failed to fetch coach applications");
                }
                const data = await response.json();
                setCoachApplications(data.applications);
                setTotalPagesCoachApplications(data.totalPages);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingCoachApplications(false);
            }
        };

        fetchCoachApplications();
    }, [currentPageCoachApplications]);

    const handlePageChangeCoachApplications = (newPage) => {
        setCurrentPageCoachApplications(newPage);
    };

    // States for CoachReports/ Pagination
    const [coachReports, setCoachReports] = useState([]);
    const [currentPageCoachReports, setCurrentPageCoachReports] = useState(1);
    const [totalPagesCoachReports, setTotalPagesCoachReports] = useState(1);
    const [loadingCoachReports, setLoadingCoachReports] = useState(false);
    const coachReportsPerPage = 10;

    useEffect(() => {
        // Fetch coach reports from the API
        const fetchCoachReports = async () => {
            setLoadingCoachReports(true);
            try {
                const apiBase = import.meta.env.VITE_API_URL;
                const url = `${apiBase}/admin/coach-reports?page=${currentPageCoachReports}&limit=${coachReportsPerPage}`;
                const response = await fetch( url, {
                    method: 'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    console.error("Failed to fetch coach reports");
                }
                const data = await response.json();
                setCoachReports(data.reports);
                setTotalPagesCoachReports(data.totalPages);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingCoachReports(false);
            }
        };

        fetchCoachReports();
    }, [currentPageCoachReports]);

    const handlePageChangeCoachReports = (newPage) => {
        setCurrentPageCoachReports(newPage);
    };

    // Add state for ViewCoachReportModal
    const [showViewCoachReportModal, setShowViewCoachReportModal] = useState(false);
    const [selectedReportID, setSelectedReportID] = useState(null);

    const handleOpenViewCoachReportModal = (reportID) => {
        setSelectedReportID(reportID);
        setShowViewCoachReportModal(true);
    };

    const handleCloseViewCoachReportModal = () => {
        setShowViewCoachReportModal(false);
        setSelectedReportID(null);
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

    const [collapsedTables, setCollapsedTables] = useState({
        Back: true,
        Cardio: true,
        Chest: true,
        Core: true,
        Legs: true,
        Arms: true,
    });

    const toggleTable = (muscleGroup) => {
        setCollapsedTables((prevState) => ({
            ...prevState,
            [muscleGroup]: !prevState[muscleGroup],
        }));
    };

    // Add state to manage the modal visibility and selected exercise
    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);

    // Function to handle opening the modal
    const handleOpenExerciseModal = (exercise = null) => {
        if (exercise) {
            const transformedExercise = {
                ...exercise,
                muscleGroup: exercise.muscle_group, // manual mapping because it wouldent work without
            };
            setSelectedExercise(transformedExercise);
        } else {
            setSelectedExercise(null);
        }
        setShowExerciseModal(true);
    };

    // Function to handle closing the modal
    const handleCloseExerciseModal = () => {
        setShowExerciseModal(false);
        setSelectedExercise(null);
    };

    // Add state for platform metrics
    const [platformMetrics, setPlatformMetrics] = useState({ total_users: 0, total_subscriptions: 0, total_revenue: 0 });
    const [loadingMetrics, setLoadingMetrics] = useState(false);

    useEffect(() => {
        // Fetch platform metrics from the API
        const fetchPlatformMetrics = async () => {
            setLoadingMetrics(true);
            try {
                const apiBase = import.meta.env.VITE_API_URL;
                const url = `${apiBase}/admin/platform-metrics`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    console.error("Failed to fetch platform metrics");
                }
                const data = await response.json();
                setPlatformMetrics(data.data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingMetrics(false);
            }
        };

        fetchPlatformMetrics();
    }, []);

    return (
        <>
        {!isAuthenticated || user.role !== 'admin' && (
        <section className="admin-dashboard container">
            <div className="admin-dasboard-header">
                <h1 className="admin-dashboard-title">Admin Dashboard</h1>
                <p className="admin-dashboard-subtitle">Welcome back, {firstName}</p>
            </div>

            <div className="admin-dashboard-column">
                <div className="admin-dashboard-card">
                    {loadingMetrics ? (
                        <p>Loading metrics...</p>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className="pill">
                                <h4>Total Users</h4>
                                <p>{platformMetrics.total_users}</p>
                            </div>
                            <div className="pill">
                                <h4>Total Subscriptions</h4>
                                <p>{platformMetrics.total_subscriptions}</p>
                            </div>
                            <div className="pill">
                                <h4>Total Revenue</h4>
                                <p>${platformMetrics.total_revenue.toFixed(2)}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="admin-dashboard-card">
                    <div style={{ position: 'relative' }}>
                        <h3>Users</h3>
                        <p>All current users of Workout Workshop</p>
                    </div>
                    <input id="search-users" type="text" placeholder="Search users..." value={searchQuery} onChange={handleUserSearch} className="search-input"/>
                    {loadingUsers ? (
                        <p>Loading...</p>
                    ) : (
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Role</th>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Banned</th>
                                    <th>Disabled</th>
                                    <th>Create Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.role}</td>
                                        <td>{user.first_name + " " + user.last_name}</td>
                                        <td>{user.username}</td>
                                        <td>{user.is_banned ? 'Yes' : 'No'}</td>
                                        <td>{user.is_disabled ? 'Yes' : 'No'}</td>
                                        <td>{new Date(user.create_date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div className="pagination">
                        <button
                            id="user-previous"
                            onClick={() => handlePageChangeUsers(currentPageUsers - 1)}
                            disabled={currentPageUsers === 1}
                        >
                            Previous
                        </button>
                        <span>Page {currentPageUsers} of {totalPagesUsers}</span>
                        <button
                            id="user-next"
                            onClick={() => handlePageChangeUsers(currentPageUsers + 1)}
                            disabled={currentPageUsers === totalPagesUsers}
                        >
                            Next
                        </button>
                    </div>
                </div>

                <div className="admin-dashboard-card">
                    <h3>Coach Applications</h3>
                    <p>Current pending coach applications</p>
                    {loadingCoachApplications ? (
                        <p>Loading...</p>
                    ) : (
                        <table className="user-table">
                            <thead>
                            <tr>
                                <th>Coach ID</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>View Application</th>
                            </tr>
                            </thead>
                            <tbody>
                            {coachApplications.length > 0 ? (
                                coachApplications.map((coach) => (
                                    <tr key={coach.coach_id}>
                                        <td>{coach.coach_id}</td>
                                        <td>{coach.name}</td>
                                        <td>{coach.status}</td>
                                        <td><Button id={`application-${coach.name}`}onClick={() => handleOpenViewCoachApplicationModal(coach)}>View</Button></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="no-data-row">No coach applications found</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                    <div className="pagination">
                        <button
                            id="coach-previous"
                            onClick={() => handlePageChangeCoachApplications(currentPageCoachApplications - 1)}
                            disabled={currentPageCoachApplications === 1}
                        >
                            Previous
                        </button>
                        <span>Page {currentPageCoachApplications} of {totalPagesCoachApplications}</span>
                        <button
                            id="coach-next"
                            onClick={() => handlePageChangeCoachApplications(currentPageCoachApplications+ 1)}
                            disabled={currentPageCoachApplications === totalPagesCoachApplications}
                        >
                            Next
                        </button>
                    </div>
                </div>

                <div className="admin-dashboard-card">
                    <h3>Coach Reports</h3>
                    <p>Current pending coach reports</p>
                    {loadingCoachReports ? (
                        <p>Loading...</p>
                    ) : (
                        <table className="user-table">
                            <thead>
                            <tr>
                                <th>Report ID</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>View Report</th>
                            </tr>
                            </thead>
                            <tbody>
                            {coachReports.length > 0 ? (
                                coachReports.map((report) => (
                                    <tr key={report.report_id}>
                                        <td>{report.report_id}</td>
                                        <td>{report.name}</td>
                                        <td>{report.status}</td>
                                        <td><Button id={`report-${report.name}`} onClick={() => handleOpenViewCoachReportModal(report.report_id)}>View</Button></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="no-data-row">No coach reports found</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )} 
                    <div className="pagination">
                        <button
                            id="report-previous"
                            onClick={() => handlePageChangeCoachReports(currentPageCoachReports - 1)}
                            disabled={currentPageCoachReports === 1}
                        >
                            Previous
                        </button>
                        <span>Page {currentPageCoachReports} of {totalPagesCoachReports}</span>
                        <button
                            id="report-next"
                            onClick={() => handlePageChangeCoachReports(currentPageCoachReports+ 1)}
                            disabled={currentPageCoachReports === totalPagesCoachReports}
                        >
                            Next
                        </button>
                    </div>
                </div>

                <div className="admin-dashboard-card">
                    <div style={{ position: 'relative' }}>
                        <h3>Edit exercise library</h3>
                        <p>Add or remove workouts</p>
                        <Button onClick={() => handleOpenExerciseModal(null)} style={{ position: 'absolute', top: '10px', right: '10px' }}>+</Button>
                    </div>
                    <div className="exercise-table">
                        <h3 onClick={() => toggleTable('Chest')} style={{ cursor: 'pointer' }}>
                            Chest Exercises {collapsedTables.Chest ? '▼' : '▲'}
                        </h3>
                        {!collapsedTables.Chest && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Thumbnail</th>
                                        <th>Exercise Name</th>
                                        <th>Equipment</th>
                                        <th>Muscle Group</th>
                                        <th>Video</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Chest.map((exercise) => (
                                        <tr key={exercise.exercise_id}>
                                            <td><img src={exercise.thumbnail} alt={exercise.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: "5px" }} /></td>
                                            <td>{exercise.name}</td>
                                            <td>{exercise.equipment}</td>
                                            <td>{exercise.muscle_group}</td>
                                            <td><a href={exercise.video_url} target="_blank" rel="noopener noreferrer">{exercise.video_url}</a></td>
                                            <td><Button onClick={() => handleOpenExerciseModal(exercise)}>Edit</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="exercise-table">
                        <h3 onClick={() => toggleTable('Arms')} style={{ cursor: 'pointer' }}>
                            Arms Exercises {collapsedTables.Arms ? '▼' : '▲'}
                        </h3>
                        {!collapsedTables.Arms && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Thumbnail</th>
                                        <th>Exercise Name</th>
                                        <th>Equipment</th>
                                        <th>Muscle Group</th>
                                        <th>Video</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Arms.map((exercise) => (
                                        <tr key={exercise.exercise_id}>
                                            <td><img src={exercise.thumbnail} alt={exercise.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: "5px" }} /></td>
                                            <td>{exercise.name}</td>
                                            <td>{exercise.equipment}</td>
                                            <td>{exercise.muscle_group}</td>
                                            <td><a href={exercise.video_url} target="_blank" rel="noopener noreferrer">{exercise.video_url}</a></td>
                                            <td><Button onClick={() => handleOpenExerciseModal(exercise)}>Edit</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="exercise-table">
                        <h3 onClick={() => toggleTable('Legs')} style={{ cursor: 'pointer' }}>
                            Legs Exercises {collapsedTables.Legs ? '▼' : '▲'}
                        </h3>
                        {!collapsedTables.Legs && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Thumbnail</th>
                                        <th>Exercise Name</th>
                                        <th>Equipment</th>
                                        <th>Muscle Group</th>
                                        <th>Video</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Legs.map((exercise) => (
                                        <tr key={exercise.exercise_id}>
                                            <td><img src={exercise.thumbnail} alt={exercise.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: "5px" }} /></td>
                                            <td>{exercise.name}</td>
                                            <td>{exercise.equipment}</td>
                                            <td>{exercise.muscle_group}</td>
                                            <td><a href={exercise.video_url} target="_blank" rel="noopener noreferrer">{exercise.video_url}</a></td>
                                            <td><Button onClick={() => handleOpenExerciseModal(exercise)}>Edit</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="exercise-table">
                        <h3 onClick={() => toggleTable('Back')} style={{ cursor: 'pointer' }}>
                            Back Exercises {collapsedTables.Back ? '▼' : '▲'}
                        </h3>
                        {!collapsedTables.Back && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Thumbnail</th>
                                        <th>Exercise Name</th>
                                        <th>Equipment</th>
                                        <th>Muscle Group</th>
                                        <th>Video</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Back.map((exercise) => (
                                        <tr key={exercise.exercise_id}>
                                            <td><img src={exercise.thumbnail} alt={exercise.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: "5px" }} /></td>
                                            <td>{exercise.name}</td>
                                            <td>{exercise.equipment}</td>
                                            <td>{exercise.muscle_group}</td>
                                            <td><a href={exercise.video_url} target="_blank" rel="noopener noreferrer">{exercise.video_url}</a></td>
                                            <td><Button onClick={() => handleOpenExerciseModal(exercise)}>Edit</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="exercise-table">
                        <h3 onClick={() => toggleTable('Cardio')} style={{ cursor: 'pointer' }}>
                            Cardio Exercises {collapsedTables.Cardio ? '▼' : '▲'}
                        </h3>
                        {!collapsedTables.Cardio && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Thumbnail</th>
                                        <th>Exercise Name</th>
                                        <th>Equipment</th>
                                        <th>Muscle Group</th>
                                        <th>Video</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Cardio.map((exercise) => (
                                        <tr key={exercise.exercise_id}>
                                            <td><img src={exercise.thumbnail} alt={exercise.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: "5px" }} /></td>
                                            <td>{exercise.name}</td>
                                            <td>{exercise.equipment}</td>
                                            <td>{exercise.muscle_group}</td>
                                            <td><a href={exercise.video_url} target="_blank" rel="noopener noreferrer">{exercise.video_url}</a></td>
                                            <td><Button onClick={() => handleOpenExerciseModal(exercise)}>Edit</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="exercise-table">
                        <h3 onClick={() => toggleTable('Core')} style={{ cursor: 'pointer' }}>
                            Core Exercises {collapsedTables.Core ? '▼' : '▲'}
                        </h3>
                        {!collapsedTables.Core && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Thumbnail</th>
                                        <th>Exercise Name</th>
                                        <th>Equipment</th>
                                        <th>Muscle Group</th>
                                        <th>Video</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Core.map((exercise) => (
                                        <tr key={exercise.exercise_id}>
                                            <td><img src={exercise.thumbnail} alt={exercise.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: "5px"}} /></td>
                                            <td>{exercise.name}</td>
                                            <td>{exercise.equipment}</td>
                                            <td>{exercise.muscle_group}</td>
                                            <td><a href={exercise.video_url} target="_blank" rel="noopener noreferrer">{exercise.video_url}</a></td>
                                            <td><Button onClick={() => handleOpenExerciseModal(exercise)}>Edit</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {selectedCoachApplication && (
                <ViewCoachApplicationModal
                    show={showViewCoachApplicationModal}
                    handleClose={handleCloseViewCoachApplicationModal}
                    coachId={selectedCoachApplication?.coach_id}
                />
            )}

            {selectedReportID && (
                <ViewCoachReportModal
                    show={showViewCoachReportModal}
                    handleClose={handleCloseViewCoachReportModal}
                    reportID={selectedReportID}
                />
            )}

            {showExerciseModal && (
                <AdminExerciseModal
                    show={showExerciseModal}
                    handleClose={handleCloseExerciseModal}
                    exercise={selectedExercise}
                    onExerciseChange={fetchWorkouts}
                />
            )}
        </section>
        )}
        {user?.role !== "A" && <h1>Access to this page is forbidden</h1>}
        </>
    );
}
