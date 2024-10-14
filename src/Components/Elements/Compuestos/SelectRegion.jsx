import React, { useState, useContext, useEffect } from "react";

import {
  TextField,
  InputAdornment,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import ModelConfig from "../../../Models/ModelConfig";
import { Check, Dangerous } from "@mui/icons-material";
import User from "../../../Models/User";
import Validator from "../../../Helpers/Validator";
import axios from "axios";
import Region from "../../../Models/Region";


const SelectRegion = ({
    inputState,
    validationState,
    withLabel = true,
    autoFocus = false,
    fieldName="select",
    label = fieldName[0].toUpperCase() + fieldName.substr(1),
    required = false
  }) => {

    const {
      showMessage
    } = useContext(SelectedOptionsContext);

    const [selectList, setSelectList] = useState([])
    const [selected, setSelected] = useState(-1)
    const [selectedOriginal, setSelectedOriginal] = inputState
    const [validation, setValidation] = validationState

  const validate = ()=>{
    // console.log("validate de:" + fieldName)
    // const len = selected.length
    // console.log("len:", len)
    // const reqOk = (!required || (required && len > 0))
    const empty = (selected == "" || selected == null || selected ==-1)
    const reqOk = !required || (required && !empty)
    

    var message = ""
    if(!reqOk){
      message = fieldName + ": es requerido."
    }

    const vl = {
      "require": !reqOk,
      "empty": empty,
      "allOk" : (reqOk),
      "message" : message
    }
    // console.log("vale:", vl)
    setValidation(vl)
  }
  
  const checkChange = (event)=>{
    // console.log("cambia region a:", event.target.value)
    setSelected(event.target.value)
    setSelectedOriginal(event.target.value)
  }
  
  const checkChangeBlur = (event)=>{
    
  }

  const loadList = async()=>{
    Region.getInstance().getAll((regiones)=>{
      setSelectList(regiones)
    },(error)=>{
      console.log(error)
    })
    
  }

  useEffect(()=>{
    validate()
    loadList()
    // console.log("cargo region", selected)
  },[])

  useEffect(()=>{
    if(selectList.length>0 && selectedOriginal !== "" && selected === -1){
      setSelected( parseInt(selectedOriginal + "") )
      setSelectedOriginal( parseInt(selectedOriginal + "") )
    }else{
      validate()
    }
    // console.log("region selected es:", selected)
  },[selected, selectList.length])

  return (
    <>
      {withLabel && (
      <InputLabel sx={{ marginBottom: "2%" }}>
        {label}
      </InputLabel>
      )}
    

      <Select
      sx={{
        marginTop:"17px"
      }}
        fullWidth
        autoFocus={autoFocus}
        required={required}
        label={label}
        value={selected !== "" ? selected : -1}
        onChange={checkChange}
      >
        <MenuItem
          key={-1}
          value={-1}
        >
          SELECCIONAR
        </MenuItem>

        {selectList.map((selectOption,ix) => (
          <MenuItem
            key={ix}
            value={selectOption.id}
          >
            {selectOption.regionNombre}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default SelectRegion;
