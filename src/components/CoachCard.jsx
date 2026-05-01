import React, { useState, useEffect } from "react";
import CoachInfoModal from "./CoachInfoModal";

import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

//star images for ratings
import onestars from "../images/1_star_NOBG.png"
import twostars from "../images/2_star_NOBG.png"
import threestars from "../images/3_star_NOBG.png"
import fourstars from "../images/4_star_NOBG.png"
import fivestars from "../images/5_star_NOBG.png"

import DefaultProfilePic from '../images/defaultProfile.jpg'


/*
  when getting the images dynamically from the backend use, 
  something like https://....com/<imageName>.png <- this would be the link in the DB
*/

function CoachCard( { rating, price, name, URL, nutrition, bio, id}) {
  //set default image if a profile image cannot be found
  let imgURL = ""
  if (URL === "error: Field 'null' not found" || !URL){
    imgURL = DefaultProfilePic
  }
  else{
    imgURL = URL;
  }

  //handle showing when a coach is a nutritionist
  let category = "Strength"
  if(nutrition){
    category = "Strength, Nutritionist"
  }

  //if the coach has a rating calculate the number of stars to display
  let stars
  if(rating){
    if (rating >= 4.5){stars = fivestars}
    else if (rating >= 3.5){stars = fourstars}
    else if (rating >= 2.5){stars = threestars}
    else if (rating >= 1.5){stars = twostars}
    else{stars = onestars}
  }

  else {stars = fivestars} // default to 5 stars

 const [show, setShow] = useState(false)

 const handleClose = () => setShow(false)

  return (
        <>
        <Card id={`coach-${name}`} style={{cursor: "pointer", width: "100%", maxWidth: '55rem', borderRadius:"10px", minWidth:"55rem", maxHeight:"224px", marginTop:"10px"}} onClick={()=>setShow(true)}>
            <Card.Header style={{backgroundColor: "#cb0a0a", borderTopLeftRadius:"10px", borderTopRightRadius:"10px", color: "#ffffff"}}>{name}</Card.Header>
            <Card.Body style={{backgroundColor:"#514E4A", borderBottomLeftRadius:"10px", borderBottomRightRadius:"10px"}}>
            <div style={{display:"flex", alignItems: "center" }}>  {/*main text body*/}
              <div style={{position:"flex", alignContent:"center"}}>
                <Image src={imgURL} roundedCircle style={{ width: "150px", height: "150px"}}/>
              </div>
              <div style={{paddingLeft:"5%", paddingRight:"5%", flexGrow: "1"}}>
                <h3 style={{color:"#ffffff", size:"lg"}}><b>ABOUT COACH</b></h3>
                <p style={{color:"#ffffff"}}>
                    Category: {category}<br/>
                    Price:    ${price}/week<br/>
                </p>
              </div>
              <div style={{width: "40%", minWidth:"40%", textAlign:"center", paddingLeft: "3%"}}>
                <h3 style={{color:"#ffffff", right:"50%"}}><b>RATING</b></h3>
                <Image src={stars} style={{maxWidth: "100%", height: "112px", position: "center"}}/>
              </div>
            </div>{/*end of main text body*/}
            </Card.Body>
        </Card>
        <CoachInfoModal show={show} handleClose={handleClose} name={name} URL={imgURL} price={price} category={category} bio={bio} id={id} rating={stars}/>
        </>
        
  );
}

export default CoachCard;