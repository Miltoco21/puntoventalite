/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button, TextField, Grid, Container, Paper } from "@mui/material";

const TecladoPeso = ({onPesoSubmit,onClose}) => {
  const [peso, setpeso] = useState("");


  const [activeField, setActiveField] = useState("peso");

  const handleFieldFocus = (field) => {
    setActiveField(field);
  };

  const handleNumberClick = (number) => {
    if (activeField === "peso") {
      setpeso(peso + number);
    } else if (activeField === "code") {
      setCode(code + number);
    }
  };

  const handleDeleteOne = () => {
    if (activeField === "peso") {
      setpeso(peso.slice(0, -1));
    } else if (activeField === "code") {
      setCode(code.slice(0, -1));
    }
  };

  const handleDeleteAll = () => {
    if (activeField === "peso") {
      setpeso("");
    } else if (activeField === "code") {
      setCode("");
    }
  };

  const handleEnter = () => {
    onPesoSubmit(peso)
    onClose(false)
   
  };
  const handleClosePeso = ()=>{
    onClose(false)
  }

  return (
    <Container>
      <Grid container>
        <Grid item xs={6}>
          <Paper elevation={22} style={{ height: "300px", width: "380px",marginLeft:"-20px"}}>
            <Grid container spacing={1}
            sx={{margin:"2px"}}>
              <Grid item xs={12} lg={11}>
                <TextField
                  label="Ingresa Peso "
                  variant="outlined"
                  fullWidth
                  value={peso}
                  onFocus={() => handleFieldFocus("peso")}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  label="Código"
                  variant="outlined"
                  fullWidth
                  value={code}
                  onFocus={() => handleFieldFocus("code")}
                />
               
              </Grid> */}

              {Array.from({ length: 10 }, (_, i) => (
                <Grid item xs={3} lg={3} key={i}>
                  <Button
                    variant="outlined"
                    onClick={() => handleNumberClick(i.toString())}
                  >
                    {i}
                  </Button>
                </Grid>
              ))}

              <Grid item xs={3} lg={3}>
                <Grid
                sx={{display:"flex"}}>
                  
                  <Button variant="outlined"
                  size="small" onClick={handleDeleteOne}>
                    Borrar
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={3} lg={3}>
                <Grid >
                  <Button sx={{marginLeft:"-10px"}} size="small" variant="outlined" onClick={handleDeleteAll}>
                    Limpiar
                  </Button>
                </Grid>
              </Grid>
              <Grid  sx={{display:"flex", flexDirection: "rowReverse",justifyContent:"space-between"}}item xs={3} lg={3}>
                <Button
                 sx={{margin:"5px"}}
                  variant="contained"
                  color="primary"
                  onClick={handleEnter}
                >
                  Enter
                </Button>
                <Button
                sx={{margin:"5px"}}
                  variant="contained"
                  color="primary"
                  onClick={handleClosePeso}
                >
                 Salir
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TecladoPeso;
