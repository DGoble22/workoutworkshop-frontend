import React from "react"
import Image from "react-bootstrap/esm/Image"

import onestars from "../images/1_star_NOBG.png"
import twostars from "../images/2_star_NOBG.png"
import threestars from "../images/3_star_NOBG.png"
import fourstars from "../images/4_star_NOBG.png"
import fivestars from "../images/5_star_NOBG.png"

const CARD_STYLES={
    display: "flex",
    width:"450px",
    height:"150px",
    minWidth:"450px",
    minHeight: "244px",
    maxHeight: "244px",
    borderRadius: "25px",
    flexDirection: "column",
    backgroundColor:"#ffffff",
    marginTop:"10px"
}

const HEADER_STYLES={
    display: "flex",
    height: "3rem",
    width:"100%",
    minWidth:"450px",
    maxWidth:"100%",
    alignItems:"center",
    justifyContent:"space-between",
    paddingLeft:"5%",
    fontSize: "175%"
}

const REVIEWTEXT_STYLES={
    display:"flex",
    width:"99%",
    height:"90%",
    maxHeight:"90%",
    marginBottom:"20px",
    paddingTop: "5px",
    paddingLeft:"15px",
    paddingRight:"5px",
    overflowWrap:"breakWord",
    overflowY:"auto"
}

export default function ReviewCard( {name, rating, comment}){

    let stars
    if(rating){
        if (rating >= 4.5){stars = fivestars}
        else if (rating >= 3.5){stars = fourstars}
        else if (rating >= 2.5){stars = threestars}
        else if (rating >= 1.5){stars = twostars}
        else{stars = onestars}
    }

    return(
        <div style={CARD_STYLES}>
            <div style={HEADER_STYLES}>
                {name}
                <Image src={stars} style={{ maxWidth: "60%", height: "60%", float:"right"}}/>
            </div>
            <div style={{minWidth:"100%", maxWidth:"100%", maxHeight:"10px", minHeight:"10px", backgroundColor:"#000000"}}/>
            <div style={REVIEWTEXT_STYLES}>
                {comment}
            </div>
        </div>

    )

}