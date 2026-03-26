import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Admin.css";
import toast from "react-hot-toast";

export default function Admin() {
    const { isAuthenticated, user , token} = useContext(AuthContext);
    const firstName = user?.first_name;

    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const usersPerPage = 10;

    useEffect(() => {
        // Fetch users from the API
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const apiBase = import.meta.env.VITE_API_URL;
                const url = `${apiBase}/admin/fetch-users?page=${currentPage}&limit=${usersPerPage}&search=${searchQuery}`;
                const response = await fetch( url);
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const data = await response.json();
                setUsers(data.users);
                setTotalPages(data.totalPages);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage, searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to the first page on new search
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <section className="admin-dashboard container">
            <div className="admin-dasboard-header">
                <h1 className="admin-dashboard-title">Admin Dashboard</h1>
                <p className="admin-dashboard-subtitle">Welcome back, {firstName}</p>
            </div>

            <div className="admin-dashboard-column">
                <div className="admin-dashboard-card">
                    <h3>Users</h3>
                    <p>All current users of Workout Workshop</p>
                    <input type="text" placeholder="Search users..." value={searchQuery} onChange={handleSearch} className="search-input"/>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Banned</th>
                                    <th>Disabled</th>
                                    <th>Create Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.first_name}</td>
                                        <td>{user.last_name}</td>
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
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>

                <div className="admin-dashboard-card">
                    <h3>Coach Applications</h3>
                    <p>Current pending coach applications</p>
                </div>

                <div className="admin-dashboard-card">
                    <h3>Coach Reports</h3>
                    <p>Current pending coach reports</p>
                </div>

                <div className="admin-dashboard-card">
                    <h3>Edit exercise library</h3>
                    <p>Add or remove workouts</p>
                </div>
            </div>
        </section>
    );
}
