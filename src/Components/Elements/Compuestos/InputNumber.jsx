import React, { useState, useContext, useEffect } from "react";

import {
  TextField,
  InputAdornment,
  InputLabel
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import ModelConfig from "../../../Models/ModelConfig";
import { Check, Dangerous } from "@mui/icons-material";
import User from "../../../Models/User";
import Validator from "../../../Helpers/Validator";


const InputNumber = ({
    inputState,
    validationState,
    withLabel = true,
    autoFocus = false,
    fieldName="number",
    label = fieldName[0].toUpperCase() + fieldName.substr(1),
    minLength = null,
    canAutoComplete = false,
    maxLength = 20,
    required = false
  }) => {

    const {
      showMessage
    } = useContext(SelectedOptionsContext);
    
    const [number, setNumber] = inputState
    const [validation, setValidation] = validationState
    const [keyPressed, setKeyPressed] = useState(false)

  const validate = ()=>{
    // console.log("validate de:" + fieldName)
    const len = (number + "").length
    const reqOk = (!required || (required && len > 0))
    var badMinlength = false
    var badMaxlength = false

    if(minLength && len < minLength){
      badMinlength = true
    }

    if(maxLength && len > maxLength){
      badMaxlength = true
    }

    var message = ""
    if(!reqOk){
      message = fieldName + ": es requerido."
    }else if(badMinlength){
      message = fieldName + ": debe tener " + minLength + " caracteres o mas."
    }else if(badMaxlength){
      message = fieldName + ": debe tener " + maxLength + " caracteres o menos."
    }

    const vl = {
      "badMinlength": badMinlength,
      "badMaxlength": badMaxlength,
      "require": !reqOk,
      "empty": len == 0,
      "allOk" : (reqOk && !badMinlength && !badMaxlength),
      "message" : message
    }
    // console.log("vale:", vl)
    setValidation(vl)
  }
  
  const checkKeyDown = (event)=>{
    if(!canAutoComplete && event.key == "Unidentified"){
      event.preventDefault();
      return false
    }else{
      setKeyPressed(true)
    }
    if(Validator.isTeclaControl(event)){
      // console.log("es control")
      return 
    }
    if(!Validator.isNumeric(event.key)){
      // console.log("es correcta")
      event.preventDefault();
      return false
    }

    // console.log("es correcta")
  }

  const checkChange = (event)=>{
    if(!canAutoComplete && !keyPressed){
      return
    }
    // console.log("checkChange", event)
    const value = event.target.value
    if(value == " "){
      showMessage(":Valor erroneo")

      return false
    }
    // console.log("value de "+fieldName + ": " + value)
    setNumber(value);
    // if(value == "" || Validator.isNumeric(value)){
    //   console.log(value + " es valido")
    //   setNumber(value);
    // }else{
    //   // console.log("es incorrecta")
    //   showMessage("Valor erroneo")

    // }
  }
  
  const checkChangeBlur = (event)=>{
    if(typeof(number) == "string" && number.substr(-1) == " "){
      setNumber(number.trim())
    }
  }

  useEffect(()=>{
    // console.log("cambio inputState")
    // console.log(inputState)
    validate()
  },[])


  useEffect(()=>{
    // console.log("cambio number")
    // console.log(number)
    validate()
  },[number])

  return (
    <>
      {withLabel && (
      <InputLabel sx={{ marginBottom: "2%" }}>
        {label}
      </InputLabel>
      )}
      <TextField
        fullWidth
        autoFocus={autoFocus}
        margin="normal"
        required={required}
        type="text"
        label={label}
        value={number}
        onChange={checkChange}
        onBlur={checkChangeBlur}
        onKeyDown={checkKeyDown}
      />
    </>
  );
};

export default InputNumber;
