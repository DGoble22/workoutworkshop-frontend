import React, { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"

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
  height:"35vh",
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
    background: "none",
    color:"#ff0000"
}

function ReportError({show}){
    if(!show){return null}
    return(
    <font color="#f50303">Please Enter Valid Report</font>
    )
}

export default function ReportModal( {show, handleClose, id}){
    if(!show){return null}

    const [report, setReport] = useState("")

    const [reportError, setReportError] = useState(false)
    const [reportButton, setReportButton] = useState("Send to Report")
    const [buttonOmmited, setButtonOmmited] = useState(false) // idea is to use this to make the report button get ommited after a report is sent, the user cannot spam
    const {user} = useContext(AuthContext)

    async function validateReport(){
        let data ={}
        if(report.length === 0 || report.trim() === ""){
            setReportError(true)
            return
        }
        else{
            data={
                reporter_id: user.id,
                coach_id: id,
                message: report
            }

            if( await postData(data)){setReportButton("Reported!")}
            else{alert("Error submitting report. Try again later")}
        }
        
    }

    async function postData(data){
        if(!data){alert("Error occured while applying to coach")}

        try{
            const apiBase = import.meta.env.VITE_API_URL || '';
            const endpoint = `${apiBase}/coach/send-coach-report`;

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
                        <h3><b>REPORT</b></h3>
                    </div>
                    <div style={{maxWidth:"100%", height:"100%", float:"right"}}>
                        <button onClick={handleClose} style={CLOSEBUTTON_STYLES}> X </button>
                    </div>
                </div>
                <div style={{display:"flex", marginLeft:"15px", float:"left", justifyContent:"left"}}>
                    Explain Report:
                </div>
                <div style={{display:"flex", height:"100%", minHeight:"100%", alignItems:"center", flexDirection:"column"}}>
                    <textarea onChange={(e) => {setReport(e.target.value), setReportError(false)}} style={{width:"95%", height:"55%", overflowWrap:"break-word"}}/>
                    <ReportError show={reportError}/>
                    <button onClick={()=>validateReport()} style={{display:"flex", width:"95%", height:"10%", borderRadius:"5px", marginTop:"10px", color:"#ffffff", backgroundColor:"#2C2C2C", alignItems:"center", justifyContent:"center"}}> {reportButton} </button>
                </div>
            </div>
        </div>
    )
}