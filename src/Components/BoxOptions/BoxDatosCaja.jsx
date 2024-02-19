/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useContext,useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
 
  Grid,
  useTheme,
  Container,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";


const BoxVendedor = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    userData

  } = useContext(SelectedOptionsContext);

  console.log("userData context",userData)

  
  const vendedores = [
    {
      codigo: userData.codigoUsuario,
      nombre:userData.nombres+" "+userData.apellidos,
      caja: " 1",
      rol:userData.rol,
      boleta: " 3 1",
      operacion: "Operación 1",
    },
  ];

 


  

  const [vendedor, setVendedor] = useState([]);

  useEffect(() => {
    // Simulate a fetch operation after 2 seconds
    const fetchData = () => {
      setTimeout(() => {
        setVendedor(vendedores);
      }, 2000);
    };

    fetchData();
  }, []);
  return (
    <>
      {vendedor.map((vend) => (
        <Paper
          key={vend.codigo}
          elevation={8}
          sx={{
            marginBottom: "20px",
            padding: "20px",

          }}
        >
          <Grid container item xs={12} spacing={2} alignItems="center">
            <Grid item xs={6} md={6}
           >
              <TextField label="Vendedor:" value={vend.nombre} />
            </Grid>
            <Grid item xs={3} md={3}label="Código">
              <TextField  label="Código" value={vend.codigo} />
            </Grid>
            <Grid item xs={3} md={3}>
              <TextField label="Caja" value={vend.caja} />
            </Grid>
           
            <Grid item xs={6} md={3}>
              <TextField label="Última Boleta" value={vend.boleta} />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField label="Nº Última Operación" value={vend.operacion} />
            </Grid>
          </Grid>
        </Paper>
      ))}
    </>
  );

  
};



export default BoxVendedor;
