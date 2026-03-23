import React, { useState, useEffect, useContext } from 'react'
import Image from 'react-bootstrap/Image';
import DefaultProfilePic from '../images/DefaultProfile.jpg'
import axios from 'axios'

import DOTWvailibility from './DOTWavailibility'

//star images for ratings
import ReviewModal from './ReviewsModal'
import ApplicationSurvey from './ApplicationSurvey';
import ReportModal from './ReportModal';
import FireModal from './FireModal';
import { AuthContext } from '../context/AuthContext';


const MODAL_STYLES={
  position: "fixed",
  display:"flex",
  top:"50%",
  left:"50%",
  transform:"translate(-50%, -50%)",
  backgroundColor:"#FFF",
  width:"45vw",
  height:"75vh",
  paddingTop:"22px",
  borderRadius:"3%",
  alignItems:"center",
  flexDirection: "column",
  zIndex:1000,
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

const HEADER_STYLES={
    display: "flex",
    height: "3rem",
    width:"95%",
    maxWidth:"60rem",
    PaddingBottom: "10%",
    borderRadius: "50px",
    border: "none",
    backgroundColor: "#D9D9D9",
    alignItems:"center",
    paddingRight:"25px",
    justifyContent:"space-between",
    paddingLeft:"5%",
    fontSize: "175%",
    whiteSpace:"nowrap"
}

const BIO_STYLES={
    display:"flex",
    backgroundColor:"#D9D9D9",
    borderRadius:"5%", 
    width:"45%", 
    height:"100%", 
    maxHeight:"240px",
    marginTop:"25px", 
    marginLeft:"5%", 
    paddingTop: "5px",
    alignItems:"center",
    justifyContent:"center",
    flexDirection: "column"
}

const BIOTEXT_STYLES={
    display:"flex",
    backgroundColor:"#ffffff",
    width:"90%",
    height:"90%",
    maxHeight:"90%",
    borderRadius:"5%",
    marginBottom:"20px", 
    paddingTop: "5px", 
    paddingLeft:"5px", 
    paddingRight:"5px", 
    overflowWrap:"breakWord",
    overflowY:"auto"
}

const REVIEW_STYLES={
    display:"flex",
    backgroundColor:"#D9D9D9",
    borderRadius:"15px", 
    width:"50%", 
    height:"100%", 
    paddingTop: "5px",
    alignItems:"center",
    justifyContent:"center",
    flexDirection: "column",
    cursor: "pointer"
}

const NCOLUMN1_STYLES={
    display:"flex",
    width:"50%", 
    height:"100%", 
    marginLeft:"35px",
    flexDirection:"column"
}

const COACHINGINFO_STYLES={
    display:"flex",
    backgroundColor:"#D9D9D9",
    borderRadius:"25px", 
    width:"100%", 
    height:"60%", 
    paddingLeft:"25px",
    alignItems:"center"
}

const RATING_STYLES={
    display:"flex",
    backgroundColor:"#D9D9D9",
    borderRadius:"25px", 
    width:"100%", 
    height:"35%", 
    marginTop:"5%",
    paddingLeft:"15px",
    alignItems:"center",
    fontSize:"x-large"
}

const TEMPButton_Styles={
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

const APPLYBUTTON_STYLES={display:"flex",
    width:"100px", 
    height: "75%", 
    maxHeight:"35px", 
    borderRadius:"15px", 
    alignItems:"center", 
    justifyContent:"center", 
    backgroundColor:"#7AC654", 
    fontSize:"75%"
}

const REPORTBUTTON_STYLES={display:"flex",
    width:"100px", 
    height: "75%", 
    maxHeight:"35px", 
    borderRadius:"15px", 
    alignItems:"center", 
    justifyContent:"center", 
    backgroundColor:"#ff0000", 
    fontSize:"75%",
    marginRight:"5px"
}

const FIREBUTTON_STYLES={display:"flex",
    width:"100px", 
    height: "75%", 
    maxHeight:"35px", 
    borderRadius:"15px", 
    alignItems:"center", 
    justifyContent:"center", 
    backgroundColor:"#ff0000", 
    fontSize:"75%"
}

/*handle edgr case where user is hired so they cannot apply to another coach*/

function Header( { id, handleClose, handleOpenApply, handleOpenReport, handleOpenFire} ){
    const [isHired, setIsHired] = useState(false)
    const [hasCoach, setHasCoach] = useState (true) //use to track if the user already has a coach, not implemented
    const {user} = useContext(AuthContext)


    const apiBase = import.meta.env.VITE_API_URL;
    useEffect(() => {
            axios.get(`${apiBase}/coach/user-coach-sub/${user.id}/${id}`) //replace 24 with ${user.id}
            .then(res => {setIsHired(res.data["hired"])})
            .catch(err => console.log(err))
        }, [])

    if(isHired){
        return(
        <>   
            <button onClick={handleOpenReport} style={REPORTBUTTON_STYLES}>Report</button>
            <button onClick={handleOpenFire} style={FIREBUTTON_STYLES}>Fire</button>
            <button onClick={handleClose} style={TEMPButton_Styles}> X </button>
        </>
        )
    }
    else{
        if(hasCoach){
            return(
            <>   
                <button onClick={handleOpenApply} style={APPLYBUTTON_STYLES}>Apply</button>
                <button onClick={handleClose} style={TEMPButton_Styles}> X </button>
            </>
            )
        }
        else{
            return(
            <>   
                <button onClick={handleClose} style={TEMPButton_Styles}> X </button>
            </>
            )
        }
    }
}

export default function CoachInfoModal( {show, handleClose, name, URL, price, category, id, bio, rating} ){
    if(!show){return null;}

    const [availablility, setAvailability] = useState([])

    let imgURL = ""
    if (URL === "error: Field 'null' not found" || !URL){
        imgURL = DefaultProfilePic
    }
    else{
        imgURL = URL;
    }

    const [openReviews, setOpenReviews] = useState(false)
    const [openApply, setOpenApply] = useState(false)
    const [openReport, setOpenReport] = useState(false)
    const [openFire, setOpenFire] = useState(false)

    const handleOpenReviews = () => setOpenReviews(true)
    const handleCloseReviews = () => setOpenReviews(false)

    const handleOpenApply = () => setOpenApply(true)
    const handleCloseApply = () => setOpenApply(false)

    const handleOpenReport = () => setOpenReport(true)
    const handleCloseReport = () => setOpenReport(false)

    const handleOpenFire = () => setOpenFire(true)
    const handleCloseFire = () => setOpenFire(false)

    // if coach is not hired by user
    return(
        <>
            <div style={OVERLAY_STYLES}>
                <div style={MODAL_STYLES}>
                    <div style={HEADER_STYLES}>
                        {name}
                        <div style={{display:"flex", maxWidth:"60%", width:"100%", height:"75%", marginLeft:"10%", alignItems:"center", flexDirection:"row", justifyContent:"flex-end"}}>
                            <Header id={id} handleClose={handleClose} handleOpenApply={handleOpenApply} handleOpenReport={handleOpenReport} handleOpenFire={handleOpenFire}/>
                        </div>
                    </div>
                    <div style={{width:"100%", height:"95%", display:"flex", flexDirection:"column", marginLeft:"5%"}}>{/*MAIN body*/}
                            <div style={{display:"flex", width:"100%", heigh:"50%", flexDirection:"row"}}> {/*ROW 1*/}
                                <div style={{width:"45%", height:"100%", paddingTop:"25px", paddingLeft:"5%"}}> {/*PROFILE PICTURE*/}
                                    <Image src={imgURL} roundedCircle style={{ minHieght:"256px", minWidth:"250px", maxHeight:"256px", maxWidth:"250px", objectFit:"cover"}}/>
                                </div> {/*PROFILE PICTURE*/}
                                <div style={BIO_STYLES}> {/*BIO*/}
                                    <h3>BIO</h3>
                                    <div style={BIOTEXT_STYLES}>
                                        <p>{bio}</p>
                                    </div>
                                </div> {/*BIO*/}
                            </div>{/*ROW1*/}

                        <div style={{display: "flex", width:"95%", height:"25%", marginTop:"20px", flexDirection:"row"}}>{/*Row2*/}
                            <div style={REVIEW_STYLES} onClick={handleOpenReviews}> {/*REVIEWS*/}
                                <h3>REVIEWS</h3>
                                <div style={BIOTEXT_STYLES}/>
                            </div> {/*REVIEWS*/}
                            <div style={NCOLUMN1_STYLES}>{/*Nested Column*/}
                            <div style={COACHINGINFO_STYLES}> {/*INFO*/}
                                    Coach Type: {category}<br/>
                                    Price: ${price}/week
                            </div>
                            <div style={RATING_STYLES}> {/*RATING*/}
                                <b>RATING:</b>
                                <Image src={rating} style={{ maxWidth: "60%", height: "60%"}}/>
                            </div> {/*RATING*/}
                            </div>{/*Nested COlumn*/}
                        </div>{/*Row2*/}
                        <div style={{display: "flex", backgroundColor:"#D9D9D9", borderRadius: "15px", width:"95%", height:"18%", marginTop:"5%", alignItems:"center", justifyContent:"center"}}> {/*Row3*/}
                            <div style={{display: "flex",width:"95%", height:"100%", alignItems:"center", justifyContent:"center"}}>
                            <DOTWvailibility available={false} DOTW={"Sun"}/>
                            <DOTWvailibility available={true} DOTW={"Mon"}/>
                            <DOTWvailibility available={true} DOTW={"Tue"}/>
                            <DOTWvailibility available={true} DOTW={"Wed"}/>
                            <DOTWvailibility available={true} DOTW={"Thu"}/>
                            <DOTWvailibility available={true} DOTW={"Fri"}/>
                            <DOTWvailibility available={false} DOTW={"Sat"}/>
                            </div>
                        </div> {/*Row3*/}
                    </div> {/*MAIN BODY*/}
                </div> {/*MODAL*/}
            </div> {/*OVERLAY*/}
            <FireModal show={openFire} handleClose={handleCloseFire} name={name} id={id}/>
            <ReportModal show={openReport} handleClose={handleCloseReport} id={id}/>
            <ApplicationSurvey show={openApply} handleClose={handleCloseApply} id={id}/>
            <ReviewModal name={name} coach_id={id} show={openReviews} handleClose={handleCloseReviews}/>
        </>

    )
}