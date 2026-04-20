import React, { useState, useEffect } from 'react'
import axios from 'axios'
import benchPressThumbnail from '../images/benchPress Thumbnail.png'
import Image from 'react-bootstrap/Image';
import toast from "react-hot-toast";
import ReactPlayer from 'react-player'; // npm install react-player

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

export default function ExerciseCard({ URL, name, manage, handleDelete, handleUpdate, equipment, reps, sets, weight, apply, thumbnail, exercise_id, plan_id}){
    const [numReps, setReps] = useState(reps)
    const [numSets, setSets] = useState(sets)
    const [numWeight, setWeight] = useState(weight)

    const [oldReps, setOldReps] = useState(reps)
    const [oldSets, setOldSets] = useState(sets)
    const [oldWeight, setOldWeight] = useState(weight)

    //check for flag changes in real-time
    useEffect(()=>{
        //apply is the flag used to check if the apply button is pressed, it will ideal turn off after a set value of time, i.e. 1s so that it doesnt keep trying to write to db
        const update = async () =>{
            if(apply){
                // change was made, write to db
                if (numReps !== oldReps || numSets !== oldSets || oldWeight !== numWeight){
                    let data = {
                        exercise_id: exercise_id,
                        plan_id: plan_id,
                        reps: numReps,
                        sets: numSets,
                        weight: numWeight
                    }

                    try{
                        const apiBase = import.meta.env.VITE_API_URL;
                        let response = await axios.post(`${apiBase}/api/workouts/update-planned-exercise`, data);
                        if(response.ok){
                            //update old values
                            setOldReps(numReps)
                            setOldSets(numSets)
                            setOldWeight(numWeight)
                            toast.success("Changes Applied!");
                        }
                        
                    }

                    catch{
                        // if there is an error, revert the changes back
                        setReps(oldReps)
                        setSets(oldSets)
                        setWeight(oldWeight)  
                        toast.error("Error editing exercises. Try again later!");  
                    }
                }
            }
        }
        update();
    }, [apply])

    return(
        <div style={CARD_STYLE}>
            <div style={HEADER_STYLES}>
                {name} | {equipment}
                {manage &&
                    <button onClick={()=>handleDelete()} style={REMOVEBUTTON_STYLES}>-</button>
                }
            </div>

            <div style={{display:"flex", width:"100%", height:"75%", alignItems:"center", paddingLeft:"10px"}}>{/*main body*/}
                
<<<<<<< HEAD
                <a href={URL} style={{display:"flex", position:"relative", width:"45%", height:"90%", alignItems:"center", borderRadius:"15px", overflow:"hidden"}}> {/*video container*/}
                    <Image  src={thumbnail} style={{width:"100%", maxWidth:"100%", height:"100%", objectFit:"fill"}}/>
=======
                <a style={{display:"flex", position:"relative", width:"45%", height:"90%", alignItems:"center", borderRadius:"15px", overflow:"hidden"}}> {/*video container*/}
                    <img  src={thumbnail} style={{width:"100%", maxWidth:"100%", height:"100%", objectFit:"fill"}} alt={"https://via.placeholder.com/120x80"}/>
>>>>>>> 08ed11456df4247bda62e5a034675ecf7afdb3da
                </a>
                <div style={{display:"flex", width:"55%", height:"90%", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"10px", paddingLeft:"8px", paddingRight:"8px"}}> {/*work out info*/}
                    <div style={WORKOUTDATA_BARS}>
                        Reps:
                        <input
                            onChange={(e) => {
                                const onlyNumbers = e.target.value.replace(/\D/g, '');
                                handleUpdate('reps', onlyNumbers);
                            }}
                            style={INPUTBAR_STYlES}
                            value={reps || ""}
                            disabled={!manage}
                            inputMode='numeric'
                        />
                    </div>

                    <div style={WORKOUTDATA_BARS}>
                        Sets:
                        <input
                            onChange={(e) => {
                                const onlyNumbers = e.target.value.replace(/\D/g, '');
                                handleUpdate('sets', onlyNumbers);
                            }}
                            style={INPUTBAR_STYlES}
                            value={sets || ""}
                            disabled={!manage}
                            inputMode='numeric'
                        />
                    </div>

                    <div style={WORKOUTDATA_BARS}>
                        Weight:
                        <input
                            onChange={(e) => {
                                const onlyNumbers = e.target.value.replace(/\D/g, '');
                                handleUpdate('weight', onlyNumbers);
                            }}
                            style={INPUTBAR_STYlES}
                            value={weight || ""}
                            disabled={!manage}
                            inputMode='numeric'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}