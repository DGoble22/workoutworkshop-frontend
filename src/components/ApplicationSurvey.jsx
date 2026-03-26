import React, { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { toast } from "react-hot-toast";

const MODAL_STYLES={
  position: "fixed",
  display:"flex",
  top:"50%",
  left:"50%",
  transform:"translate(-50%, -50%)",
  backgroundColor:"#FFF",
  width:"40vw",
  height:"50vh",
  borderRadius:"3%",
  alignItems:"center",
  flexDirection: "column",
  zIndex:1000,
  border:"solid"
}
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

const CLOSEBUTTON_STYLES={
    display: "flex", 
    height: "100%", 
    width:"100%",
    maxWidth:"25px",
    justifyContent: "center",
    alignItems:"center",
    border: "none",
    background: "none",
    color:"#ff0000",
    float:"right"
}

const HEADER_STYLES={
    display: "flex",
    height: "3rem",
    width:"100%",
    maxWidth:"60rem",
    borderRadius: "50px",
    alignItems:"center",
    justifyContent:"center",
    fontSize: "225%"
}

function ApplicationError({show}){
    if(!show){return null}
    return(
    <font color="#f50303">Please Enter Valid Application</font>
    )
}

export default function ApplicationSurvey( {show, handleClose, id} ){
    if (!show){return null}

    const [comment, setComment] = useState("")
    const [applicationError, setApplicationError] = useState(false)
    const [applyButton, setApplyButton] = useState("Apply")
    const [buttonOmmited, setButtonOmmited] = useState(false)
    const {user} = useContext(AuthContext)

    async function validateComment(){
        let data ={}
        if(comment.length === 0 || comment.trim() === ""){
            setApplicationError(true)
            return
        }
        else{
            data={
                user_id: user.id,
                coach_id: id,
                comment: comment.trim()
            }
            console.log(data["user_id"])
            console.log(data["coach_id"])
            console.log(data["comment"])
            let posted = await postData(data)
            if(posted){
                setApplyButton("Applied!")
                setButtonOmmited(true)
            }
        }

    }

    async function postData(data){
        if(!data){toast.error("Error occured while applying to coach")}

        try{
            const apiBase = import.meta.env.VITE_API_URL || '';
            const endpoint = `${apiBase}/coach/send-user-coach-app`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                toast.success("Application submitted successfully.");
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Error with application. Try again later");
                return false
            }
        }
        catch (error) {
            console.error("Error during application submission:", error);
            toast.error("An error occurred while submitting the application.");
        }
    }

    return(
    <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
            <div style={HEADER_STYLES}>
                <div style={{display:"flex", maxWidth:"100%", width:"100%", height:"75%", marginLeft:"25px", alignItems:"center", justifyContent:"center"}}>
                    <b>Application Survey</b>
                </div>
                <div style={{display:"flex", maxWidth:"100%", height:"100%", float:"right", marginRight:"10px"}}>
                    <button style={CLOSEBUTTON_STYLES} onClick={handleClose}> X </button>
                </div>
            </div>
            <div style={{width:"95%", float:"left"}}>
                <p>
                    -Explain why you want/need coaching <br/>
                    -Explain why you think im a good fit to be your coach
                </p>
            </div>
            <textarea onChange={(e)=>{setComment(e.target.value), setApplicationError(false)}} style={{width:"95%", height:"65%", overflowWrap:"break-word"}}/>
            <ApplicationError show={applicationError}/>
            <button disabled={buttonOmmited} onClick={validateComment} style={{display:"flex", width:"95%", height:"10%", borderRadius:"5px", marginBottom:"10px", marginTop:"10px", color:"#ffffff", backgroundColor:"#2C2C2C", alignItems:"center", justifyContent:"center"}}> {applyButton} </button>
        </div>
    </div>
    )
}