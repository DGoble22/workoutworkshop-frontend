import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ReviewCard from './ReviewCard'
import LeaveReview from './LeaveReview'

const MODAL_STYLES={
  position: "fixed",
  display:"flex",
  top:"50%",
  left:"50%",
  transform:"translate(-50%, -50%)",
  backgroundColor:"#FFFFFF",
  width:"45vw",
  height:"75vh",
  borderRadius:"3%",
  alignItems:"center",
  flexDirection: "column",
  zIndex:1000,
}

const HEADER_STYLES={
    display: "flex",
    height: "5rem",
    width:"95%",
    maxWidth:"45vw",
    PaddingBottom: "10%",
    borderRadius: "50px",
    border: "none",
    alignItems:"center",
    fontSize: "175%",
    whiteSpace:"nowrap"
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

const REVIEWSTEXT_STYLES={
    display:"flex",
    backgroundColor:"#D9D9D9",
    border: "solid #2b2b2bd3",
    width:"90%",
    height:"90%",
    maxHeight:"90%",
    borderRadius:"5%",
    marginBottom:"20px", 
    marginTop:"10px",
    paddingTop: "5px", 
    paddingLeft:"5px", 
    paddingRight:"5px", 
    justifyContent:"center",
    overflowWrap:"breakWord",
    overflowY:"auto"
}

export default function ReviewModal( {show, handleClose, coach_id, name} ){
    if(!show){return null}

    const [reviews, setReviews] = useState([])

    const [leaveReview, setLeaveReview] = useState(false)

    const apiBase = import.meta.env.VITE_API_URL;
    useEffect(() => {
        axios.get(`${apiBase}/coach/coach-reviews/${coach_id}`)
        .then(res => {setReviews(res.data["data"])})
        .catch(err => console.log(err))
    }, [])

    const handleOpenLeaveReview = () => setLeaveReview(true)
    const handleCloseLeaveReview = () => setLeaveReview(false)

    return(
        <>
        <div style={MODAL_STYLES}>
            <div style={HEADER_STYLES}>
                <h3>{name}</h3>
                <div style={{display:"flex", float:"right", maxWidth:"100%", width:"100%", height:"75%", marginLeft:"10%", alignItems:"center", flexDirection:"row", justifyContent:"flex-end"}}>
                    <button onClick={handleOpenLeaveReview} style={{borderRadius:"25px", marginRight:"5px"}}>Leave Review</button>
                    <button onClick={handleClose} style={CLOSEBUTTON_STYLES}> X </button>
                </div>
            </div>
            <div style={REVIEWSTEXT_STYLES}>
                <div>
                {reviews.map((reviews)=>(
                    <ReviewCard key={reviews["review_id"]} name={reviews["reviewer"]} rating={reviews["rating"]} comment={reviews["comment"]}/>
                ))}
                </div>
            </div>
        </div>
        <LeaveReview show={leaveReview} handleClose={handleCloseLeaveReview} id={coach_id}/>
        </>
    )

}