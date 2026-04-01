import React, { useState, useEffect } from 'react'
import axios from 'axios'
import YouTube from 'react-youtube'; //npm i react-youtube <- used to download library

const CARD_STYLE={
    diplay:"flex",
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

const ADDBUTTON_STYLES={
    display:"flex",
    border:"none",
    backgroundColor:"#000000",
    color: "#ffffff",
    borderRadius:"100%",
    height:"35px",
    width:"35px",
    alignItems:"center",
    justifyContent:"center",
    fontSize:"150%"
}

const OPTS={
    height:"95px",
    width:"214",
    playerVars: {
      autoplay: 0, // This explicitly disables autoplay
    },
}

export default function ExerciseCard({show, handleClose, URL, name}){
    if(!show){return null}

    return(
        <div style={CARD_STYLE}>
            <div style={HEADER_STYLES}>
                {name}
                <button style={ADDBUTTON_STYLES}>+</button>
            </div>
            <div style={{width:"100%", height:"10px", backgroundColor:"#0000"}}/> {/*separator*/}
            <div style={{width:"100%", height:"214px"}}>
                <YouTube videoID={URL} opts={OPTS}/>
            </div>
            
        </div>  
    )

}