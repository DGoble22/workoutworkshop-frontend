import React, { useState, useEffect } from "react";
import CoachCard from "../../components/CoachCard";
import filter from "../../images/FilterButton.png"
import Image from 'react-bootstrap/Image';
import axios from 'axios'
import Dropdown from 'react-bootstrap/Dropdown';

/*
TODO:
1. get searching and filtering to work together
2. fix card resizing
3. add coach about page
*/

const SearchBar_Styles={
    display: "flex",
    height: "3rem",
    width:"100%",
    maxWidth:"60rem",
    PaddingBottom: "10%",
    borderRadius: "50px",
    border: "none",
    backgroundColor: "#d9d9d99b",
    paddingLeft: "15px",
    alignItems:"center"
}

const CardsDiv_Styles={
    display: "flex",
    flexDirection: "column",
    overflowY: "auto", 
    width: "100%", 
    maxWidth:"65rem", 
    height: "100vh",
    alignItems: "center"
}

const FilterButton_Styles={
    display: "flex", 
    height: "45px", 
    width:"45px", 
    background: "none", 
    justifyContent: "center",
    border: "none",
    paddingLeft:"50px"
}

export default function FindCoach() {

    const [unfiltered, setUnFiltered] = useState([])
    const [Filtered, setFiltered] = useState([])
    
    const apiBase = import.meta.env.VITE_API_URL;
    useEffect(() => {
        axios.get(`${apiBase}/coach/coach-data`)
        .then(res => {setFiltered(res.data["data"]), setUnFiltered(res.data["data"])})
        .catch(err => console.log(err))
    }, [])
    
    function handleSearch(e){
        const value = e.target.value.toLowerCase()
        if(value === ""){
            setFiltered(unfiltered)
        }

        else{
          const newData = unfiltered.filter(coach=> 
          coach["Name"].toLowerCase().includes(value)
        )
        setFiltered(newData)
        }
    }

    function filterStrength(){
        const newData = unfiltered.filter(coach=>coach["is_nutritionist"]===0)
        setFiltered(newData)
    }

    function filterNutritionist(){
        const newData = unfiltered.filter(coach=>coach["is_nutritionist"]===1)
        setFiltered(newData)
    }

    function clearFilter(){
        setFiltered(unfiltered)
    }

    return (
        <div className="container mt-4" style={{display: "flex", flexDirection: "column", alignItems:"center", maxWidth: "60rem", width: "100%"}}>
            <div style={SearchBar_Styles}>
                <input type="text" placeholder="Search..." style={{border: "none", background: "none", width: "90%", outline:"none"}} onChange={(e)=>{handleSearch(e)}}/>
                {/*<button style={FilterButton_Styles} onClick={()=>console.log("test CLick")}> <Image src={filter}/> </button>*/}
                <Dropdown>
                <Dropdown.Toggle style={FilterButton_Styles} variant="success" id="dropdown-basic">
                    <Image src={filter}/>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={()=>{filterStrength()}}>Strength</Dropdown.Item>
                    <Dropdown.Item onClick={()=>{filterNutritionist()}}>Nutrition</Dropdown.Item>
                    <Dropdown.Item onClick={()=>{clearFilter()}}>Clear Filter</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
            </div>
            <div id="coach-scroll" style={CardsDiv_Styles}>
                {Filtered.map((coach)=>(
                    <CoachCard key={coach["Coach ID"]} name={coach["Name"]} price={coach["pricing"]} URL={coach["URL"]} rating={coach["rating"]} nutrition={coach["is_nutritionist"]} bio={coach["bio"]} id={coach["Coach ID"]}/>
                ))}
            </div>
        </div>
    );
}
