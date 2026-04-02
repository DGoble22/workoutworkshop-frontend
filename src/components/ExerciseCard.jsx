import React, { useState, useEffect } from 'react'
import axios from 'axios'
import benchPressThumbnail from '../images/benchPress Thumbnail.png'
import Image from 'react-bootstrap/Image';

const CARD_STYLE={
    display:"flex",
    width:"55%",
    maxWidth:"55%",
    minWidth:"55%",
    height:"175px",
    maxHeight:"175px",
    minHeight:"175px",
    borderRadius:"10px",
    backgroundColor:"#514E4A",
    flexDirection:"column",
    marginTop:"10px"
}

const HEADER_STYLES={
    display:"flex",
    top:0,
    width:"100%",
    minWidth:"100%",
    maxWidth:"100%",
    height:"25%",
    minHeight:"25%",
    maxHeight:"25%",
    borderTopLeftRadius:"10px",
    borderTopRightRadius:"10px",
    justifyContent:"space-between",
    alignItems:"center",
    backgroundColor:"#B7AEAE",
    paddingRight:"10px",
    paddingLeft:"15px"
}

const REMOVEBUTTON_STYLES={
    display:"flex",
    border:"solid #ff0000",
    background:"none",
    color: "#ff0000",
    borderRadius:"100%",
    height:"35px",
    width:"35px",
    alignItems:"center",
    justifyContent:"center",
    fontSize:"30px",
    fontWeight: "bold",
    paddingBottom: "7px"
}

const WORKOUTDATA_BARS={
    display:"flex",
    width:"100%",
    minWidth:"100%",
    maxWidth:"100%",
    height:"20%",
    alignItems:"center",
    justifyContent:"space-between",
    color:"#ffffff"

}

const INPUTBAR_STYlES={
    border:"none",
    width:"70%",
    backgroundColor:"#D9D9D9",
    borderRadius:"10px",
    textAlign:"center"

}

export default function ExerciseCard({ URL, name, manage, handleDelete, equipment}){

    const [showControls, setShowControls] = useState(false)

    const [reps, setReps] = useState("10")
    const [sets, setSets] = useState("3")
    const [weight, setWeight] = useState("135")

    //updateReps = () => { /*handle updating the number of reps on the exercise with the exerciseID & planID*/}
    //updateSets = () => { /*handle updating the number of sets on the exercise with the exerciseID & planID*/}
    //updateWeight = () => { /*handle updating theweight of the exercise with the exerciseID & planID*/}

    return(
        <div style={CARD_STYLE}>
            <div style={HEADER_STYLES}> {/* Header */}
                {name} | {equipment}
                {manage &&
                    <button onClick={()=>handleDelete()} style={REMOVEBUTTON_STYLES}>-</button>
                }
            </div>

            <div style={{display:"flex", width:"100%", height:"75%", alignItems:"center", paddingLeft:"10px"}}>{/*main body*/}
                
                <div style={{display:"flex", position:"relative", width:"45%", height:"90%", alignItems:"center", borderRadius:"15px", overflow:"hidden"}}> {/*video container*/}
                    <a href={URL}>
                        <Image src={benchPressThumbnail} style={{ minHieght:"256px", minWidth:"250px", maxHeight:"256px", maxWidth:"250px", objectFit:"cover"}}/>
                    </a>
                </div>
                <div style={{display:"flex", width:"55%", height:"90%", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"10px", paddingLeft:"8px", paddingRight:"8px"}}> {/*work out info*/}
                    <div style={WORKOUTDATA_BARS}>
                        Reps:
                        <input onChange={(e)=>setReps(e.target.value)} style={INPUTBAR_STYlES} defaultValue={reps} disabled={!manage} inputMode='numeric'/>
                    </div>

                    <div style={WORKOUTDATA_BARS}>
                        Sets:
                        <input onChange={(e)=>setSets(e.target.value)} style={INPUTBAR_STYlES} defaultValue={sets} disabled={!manage} inputMode='numeric'/>
                    </div>
                    <div style={WORKOUTDATA_BARS}>
                        Weight:
                        <input onChange={(e)=>setWeight(e.target.value)} style={INPUTBAR_STYlES} defaultValue={weight} disabled={!manage} inputMode='numeric'/>
                    </div>
                </div>
            </div>
        </div>
    )

}