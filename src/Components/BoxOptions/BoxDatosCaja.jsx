/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
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
  const { userData } = useContext(SelectedOptionsContext);

  console.log("userData context", userData);

  const vendedores = [
    {
      codigo: userData.codigoUsuario || "21",
      nombre: userData.nombres + " " + userData.apellidos ||" nombreapellido",
      caja: " 1",
      rol: userData.rol,
      boleta: " 323232321",
      operacion: "12123141",
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
          <Grid container item xs={12} lg={12} spacing={2} alignItems="center">
            <Grid item xs={6} md={6} lg={6}>
              <TextField fullWidth label="Vendedor:" value={vend.nombre} />
            </Grid>
            <Grid item xs={6} md={3} lg={6}>
              <TextField 
              fullWidth
              label="Nº Última Operación" value={vend.operacion} />
            </Grid>
            <Grid item xs={3} md={3} lg={3} label="Código">
              <TextField fullWidth label="Código" value={vend.codigo} />
            </Grid>
            <Grid item xs={3} md={3} lg={2}>
              <TextField fullWidth label="Caja" value={vend.caja} />
            </Grid>

            <Grid item xs={6} md={3} lg={6}>
              <TextField fullWidth label="Última Boleta" value={vend.boleta} />
            </Grid>
           
          </Grid>
        </Paper>
      ))}
    </>
  );
};

export default BoxVendedor;
