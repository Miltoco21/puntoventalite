import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button
} from "@mui/material";
import ModelConfig from "../../Models/ModelConfig";


const SmallButton = ({
  textButton,
  actionButton = ()=>{},
  style = {},
  withDelay = true,

  onTouchStart = ()=>{},
  onMouseDown = ()=>{},
  onTouchEnd = ()=>{},
  onMouseUp = ()=>{},
  onMouseLeave = ()=>{},
  onTouchMove = ()=>{}


}) => {
  const [disabled, setDisabled] = useState(false);

  return (
        <Button
        sx={{ ...{
        width: "130px",
        backgroundColor: "#283048",
        color: "white",
        "&:hover": {
          backgroundColor: "#1c1b17 ",
          color: "white",
        },
        margin: "5px",
      }, ...style} }

        onClick={()=>{
          if(disabled) {
            return
          }
          actionButton()
          if(withDelay){
            setDisabled(true);
            setTimeout(function(){
              setDisabled(false);
            },ModelConfig.getInstance().getFirst().buttonDelayClick);
          }
        }}

        onTouchStart={()=>{onTouchStart()}}
        onMouseDown={()=>{onMouseDown()}}
        onTouchEnd={()=>{onTouchEnd()}}
        onMouseUp={()=>{onMouseUp()}}
        onMouseLeave={()=>{onMouseLeave()}}
        onTouchMove={()=>{onTouchMove()}}


        >
          <Typography variant="h7">{textButton}</Typography>
        </Button>
  );
};

export default SmallButton;
