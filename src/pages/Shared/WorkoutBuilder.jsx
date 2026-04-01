import React from "react";
import filter from "../../images/FilterButton.png"
import Image from 'react-bootstrap/Image';
import axios from 'axios'
import Dropdown from 'react-bootstrap/Dropdown';
import ExerciseCard from "../../components/ExerciseCard";

const DOTWCARD_STYLES={
    border: "solid #ffffff5a",
    display:"flex",
    height:"75%",
    width:"12%",
    maxWidth:"12%",
    minWidth:"12%",
    minHeight:"75%",
    backgroundColor:"#2C2C2C",
    borderRadius:"5px",
    alignItems:"center",
    justifyContent:"center",
    color:"#ffffff"
}

const FilterButton_Styles={
    display: "flex", 
    height: "45px", 
    width:"45px", 
    background: "none", 
    justifyContent: "center",
    border: "none",
    background: "none",
    paddingLeft:"50px"
}

const SEARCHBAR_STYLES={
    display:"flex",
    border: "none",
    background: "none",
    width: "75%", 
    maxWidth:"75%",
    outline:"none",
    PaddingBottom: "10%",
    borderRadius: "50px",
    border: "none",
    backgroundColor: "#d9d9d99b",
    paddingLeft: "15px",
    alignItems:"center"
}

const HEADERBUTTON_STYLES={
    display:"flex", 
    border:"none", 
    height:"60%", 
    minHeight:"60%",
    maxHeight:"60%",
    width: "20%",
    minWidth:"20%",
    maxWidth:"20%",
    backgroundColor:"#D9D9D9", 
    alignItems:"center", 
    justifyContent:"center",
    borderRadius:"15px",
    marginRight:"35px"
}

const EXERCISECATEGORY_STYLES={
    display:"flex",
    width:"90%",
    minWidth:"90%",
    maxWidth:"90%",
    Height:"45px",
    minHeight:"45px",
    maxHeight:"45px",
    backgroundColor:"#4D4343",
    borderRadius:"25px",
    alignItems:"center",
    justifyContent:"space-between",
    marginTop:"20px",
    paddingLeft:"25px",
    paddingRight:"25px",
    color:"#ffffff"
}

export default function WorkoutBuilder() {
    return (
        <div style={{display:"flex", width:"97vw", height:"100vh", flexDirection:"column", justifyContent:"center", overFlowX:"hidden"}}>
            <div style={{display:"flex", paddingLeft:"10px", paddingRight:"10px", width:"100%", height:"20%", minWidth:"100%", minHeight:"20%", maxheight:"20%", backgroundColor:"#a3a1a1", alignItems:"center", justifyContent:"space-evenly", flexDirection:"row"}}> {/*header*/}
                <button style={DOTWCARD_STYLES}>Sun</button>
                <button style={DOTWCARD_STYLES}>Mon</button>
                <button style={DOTWCARD_STYLES}>Tue</button>
                <button style={DOTWCARD_STYLES}>Wed</button>
                <button style={DOTWCARD_STYLES}>Thu</button>
                <button style={DOTWCARD_STYLES}>Fri</button>
                <button style={DOTWCARD_STYLES}>Sat</button>
            </div> {/* end of header*/}
            <div style={{display:"flex", width:"97vw", height:"100vh", flexDirection:"row"}}>
                <div style={{display:"flex", height:"100%", minHeight:"100%", maxHeight:"100%", width:"35%", minWidth:"35%", maxWidth: "35%", backgroundColor:"#a3a1a1", flexDirection:"column"}}> {/*find workouts*/}
                    
                    <div style={{display:"flex", width:"100%", minWidth:"100%", maxWidth:"100%", marginTop:"10px", justifyContent:"center", flexDirection:"row"}}>
                        <input type="text" placeholder="Search..." style={SEARCHBAR_STYLES} onChange={(e)=>{handleSearch(e)}}/>
                        <Dropdown>
                            <Dropdown.Toggle style={FilterButton_Styles} variant="success" id="dropdown-basic">
                                <Image src={filter}/>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item>Arms</Dropdown.Item>
                                <Dropdown.Item>Chest</Dropdown.Item>
                                <Dropdown.Item>Back</Dropdown.Item>
                                <Dropdown.Item>Core</Dropdown.Item>
                                <Dropdown.Item>Legs</Dropdown.Item>
                                <Dropdown.Item>Cardio</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>{/*find workout header*/}
                    <div style={{display:"flex", width:"100%", minWidth:"100%", maxWidth:"100", height:"100%", minHeight:"100%", maxheight:"100%", overFlowY:"auto", alignItems:"center", flexDirection:"column"}}>
                        <div style={EXERCISECATEGORY_STYLES}>
                            <div>Chest</div>
                            <div>V</div>
                            {/* extend exercise cards for this category using a function call and mapping*/}
                        </div>
                        
                        <div style={EXERCISECATEGORY_STYLES}>
                            <div>Legs</div>
                            <div>V</div>
                            {/* extend exercise cards for this category using a function call and mapping*/}
                        </div>

                        <div style={EXERCISECATEGORY_STYLES}>
                            <div>Arms</div>
                            <div>V</div>
                            {/* extend exercise cards for this category using a function call and mapping*/}
                        </div>

                        <div style={EXERCISECATEGORY_STYLES}>
                            <div>Back</div>
                            <div>V</div>
                            {/* extend exercise cards for this category using a function call and mapping*/}
                        </div>

                        <div style={EXERCISECATEGORY_STYLES}>
                            <div>Cardio</div>
                            <div>V</div>
                            {/* extend exercise cards for this category using a function call and mapping*/}
                        </div>

                        <div style={EXERCISECATEGORY_STYLES}>
                            <div>Core</div>
                            <div>V</div>
                            {/* extend exercise cards for this category using a function call and mapping*/}
                        </div>

                    </div>
                
                </div> {/* end of find workouts*/}

                <div style={{display:"flex", width:"65%", minWidth:"65%", maxWidth:"65%", height:"100%", minHeight:"100%", maxHeight:"100%", overflowY:"auto", alignItems:"center", flexDirection:"column"}}> {/* manager workouts*/}
                    <div style={{display:"flex", width:"100%", maxWidth:"100%", minWidth:"100%", height:"10%", minHeight:"10%", maxHeight:"10%", backgroundColor:"#711A19", alignItems:"center", justifyContent:"flex-end"}}>
                        <button style={HEADERBUTTON_STYLES}>Manage</button>
                        <button style={HEADERBUTTON_STYLES}>Add Group</button>
                    </div>
                    <ExerciseCard show={true} URL={"K4TOrB7at0Y"} name={"Test"}/>
                </div>
            </div>
        </div>
    );
}



