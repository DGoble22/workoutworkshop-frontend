import React, { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import {FaStar} from "react-icons/fa"

const OVERLAY_STYLES={
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex:1000,
}

const MODAL_STYLES={
  position: "fixed",
  display:"flex",
  top:"50%",
  left:"50%",
  transform:"translate(-50%, -50%)",
  backgroundColor:"#FFFFFF",
  width:"35vw",
  height:"27vh",
  borderRadius:"3%",
  flexDirection: "column",
  zIndex:1000,
}

const HEADER_STYLES={
    display: "flex",
    height: "3rem",
    width:"100%",
    maxWidth:"60rem",
    borderRadius: "50px",
    alignItems:"center",
    justifyContent:"center",
    fontSize: "175%"
}

const CLOSEBUTTON_STYLES={
    display: "flex", 
    height: "100%", 
    width:"100%",
    maxWidth:"25px",
    background: "none", 
    justifyContent: "center",
    alignItems:"center",
    border: "none",
    color:"#ff0000"
}

const SUBMITBUTTON_STYLES={
    display:"flex",
    marginTop:"8px",
    marginBottom:"3px",
    height:"15%", 
    width:"95%",
    minWidth:"95%",
    maxWidth:"95%",
    maxHeight:"15%",
    minHeight: "15%",
    border: "none",
    borderRadius:"5px",
    backgroundColor:"#2C2C2C",
    color:"#ffffff",
    alignItems:"center",
    justifyContent:"center"
}

const colors={
    gold:"#ffd35a",
    grey:"#A9A9A9"
}

export default function LeaveReview( {show, handleClose, id} ){

    if(!show){return null}
    const [message, setMessage] = useState("")
    const [rating, setRating] = useState(5)
    const [submitButton, setSubmitButton] = useState("Submit")
    const {user} = useContext(AuthContext)

    const stars = Array(5).fill(0)
    const [currentValue, setCurrentValue] = useState(0)
    const [hoverValue, setHoverValue] = useState(undefined)
    const [buttonOmmited, setButtonOmmited] = useState(true)

    const handleClick = value => {
        setCurrentValue(value)
        setButtonOmmited(false)
    };

    const handleMouseOver = value => {
        setHoverValue(value)
    };

    const handleMouseLeave = () =>{
        setHoverValue(undefined)
    }

    async function submitReview(){
        console.log("1. "+message)
        if (await postdata()){
            setSubmitButton("submited")
            setButtonOmmited(true)
        }
    }

    async function postdata (){

        let data = {
            coach_id: id,
            user_id: user.id,
            rating: rating
        }

        if(message){data["message"] = message }

        console.log("2. "+data.message)

        try{
            const apiBase = import.meta.env.VITE_API_URL || '';
            const endpoint = `${apiBase}/coach/submit-coach-review`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            return response.ok
        }
        catch{
            alert("Error with report. Try again later")
            return false
        }
    }


    return(
        <div style={OVERLAY_STYLES}>
            <div style={MODAL_STYLES}>
                <div style={HEADER_STYLES}>
                    <div style={{display:"flex", maxWidth:"100%", width:"100%", height:"75%", marginLeft:"25px", alignItems:"center", justifyContent:"center"}}>
                        <h3><b>REVIEW</b></h3>
                    </div>
                    <div style={{maxWidth:"100%", height:"100%", float:"right"}}>
                        <button onClick={handleClose} style={CLOSEBUTTON_STYLES}> X </button>
                    </div>
                </div>
                <div style={{display:"flex", height:"100%", minHeight:"100%", alignItems:"center", flexDirection:"column"}}>
                    <div>
                        {stars.map((_, index)=>{
                            return(
                                <FaStar 
                                    key={index}
                                    size={24}
                                    style={{
                                        marginRight: 10,
                                        minHeight:"50px",
                                        minWidth:"50px",
                                        cursor: "pointer",
                                    }}
                                    color = {(hoverValue || currentValue) > index ? colors.gold : colors.grey}
                                    onClick={() => {handleClick(index + 1), setRating(index+1)}}
                                    onMouseOver={() => handleMouseOver(index+1)}
                                    onMouseLeave={handleMouseLeave}
                                />
                            )
                        })}
                    </div>
                    <textarea
                        placeholder= "Leave Review (Optional)"
                        style={{width:"95%", height:"35%", marginTop:"12px", overflowWrap:"break-word"}}
                        onChange={(e)=>setMessage(e.target.value)}
                    />
                    <button style={SUBMITBUTTON_STYLES} disabled={buttonOmmited} onClick={submitReview}>{submitButton}</button>
                </div>
            </div>
        </div>
    )

}