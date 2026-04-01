import React from "react";
import filter from "../../images/FilterButton.png";
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';

const DOTWCARD_STYLES = {
    border: "1px solid #ffffff5a",
    flex: 1,
    margin: "0 5px",
    height: "75%",
    backgroundColor: "#2C2C2C",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    cursor: "pointer"
};

const SEARCHBAR_STYLES = {
    flex: 1,
    border: "none",
    outline: "none",
    height: "45px",
    borderRadius: "50px",
    backgroundColor: "#d9d9d99b",
    paddingLeft: "15px",
};

const FilterButton_Styles = {
    display: "flex",
    height: "45px",
    width: "45px",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
    background: "none",
    padding: 0,
    marginLeft: "10px"
};

const HEADERBUTTON_STYLES = {
    border: "none",
    height: "40px",
    padding: "0 20px",
    backgroundColor: "#D9D9D9",
    borderRadius: "15px",
    fontWeight: "bold",
    cursor: "pointer"
};

const EXERCISECATEGORY_STYLES = {
    display: "flex",
    width: "90%",
    minHeight: "45px",
    backgroundColor: "#4D4343",
    borderRadius: "25px",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "15px",
    padding: "0 20px",
    color: "#ffffff",
    cursor: "pointer"
};

//Main interface
export default function WorkoutBuilder() {
    const handleSearch = (e) => {
        console.log("Searching for:", e.target.value);
    };

    return (
        <div style={{ display: "flex", width: "100%", height: "calc(100vh - 65px)", flexDirection: "column", overflow: "hidden" }}>

            {/* Days of the week */}
            <div style={{ display: "flex", width: "100%", height: "15%", backgroundColor: "#a3a1a1", alignItems: "center", padding: "0 10px" }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <button key={day} style={DOTWCARD_STYLES}>{day}</button>
                ))}
            </div>

            <div style={{ display: "flex", flex: 1, width: "100%", overflow: "hidden" }}>

                {/* Find Workouts */}
                <div style={{ display: "flex", width: "35%", backgroundColor: "#a3a1a1", flexDirection: "column", padding: "10px 0" }}>

                    {/* Search Bar */}
                    <div style={{ display: "flex", width: "90%", margin: "0 auto 10px auto", alignItems: "center" }}>
                        <input type="text" placeholder="Search..." style={SEARCHBAR_STYLES} onChange={handleSearch}/>
                        <Dropdown>
                            <Dropdown.Toggle style={FilterButton_Styles} variant="success" id="dropdown-basic">
                                <Image src={filter} alt="filter" style={{height: "100%", width: "100%", objectFit: "contain"}}/>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {["Arms", "Chest", "Back", "Core", "Legs", "Cardio"].map(group => (
                                    <Dropdown.Item key={group}>{group}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    {/* Categories Scroll */}
                    <div style={{ display: "flex", flex: 1, width: "100%", flexDirection: "column", alignItems: "center", overflowY: "auto", paddingBottom: "20px" }}>
                        {["Chest", "Legs", "Arms", "Back", "Cardio", "Core"].map(category => (
                            <div key={category} style={EXERCISECATEGORY_STYLES}>
                                <div>{category}</div>
                                <div>V</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Manage Workouts */}
                <div style={{ display: "flex", flex: 1, flexDirection: "column", overflow: "hidden" }}>
                    {/* Right Side Header */}
                    <div style={{ display: "flex", width: "100%", height: "10%", backgroundColor: "#711A19", alignItems: "center", justifyContent: "flex-end", paddingRight: "20px", gap: "15px" }}>
                        <button style={HEADERBUTTON_STYLES}>Manage</button>
                        <button style={HEADERBUTTON_STYLES}>Add Group</button>
                    </div>

                    {/* Built Workout */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                        {/* Selected exercises */}
                    </div>
                </div>

            </div>
        </div>
    );
}