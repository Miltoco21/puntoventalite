/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const BoxVendedor = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const vendedores = [
    {
      codigo: "cod1",
      nombre: "Nombre ",
      caja: "Caja 1",
      boleta: "Boleta 1",
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
    <div>
      {vendedor.map((vend) => (
        <Paper
          key={vend.codigo}
          elevation={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "100%",
            margin: "auto",
            marginBottom: "20px",
            padding: "20px",
          }}
        >
          <Box>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <InfoBox title="Vendedor" value={vend.nombre} />
              </Grid>
              <Grid item xs={3} sm={3}md={3} lg={3} sx={{ height: "7%" }}>
                <InfoBox title="Código" value={vend.codigo} />
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3} sx={{ height: "7%" }}>
                <InfoBox title="Nº Caja" value={vend.caja} />
              </Grid>
              <Grid item xs={6} sm={6}md={6} lg={6} sx={{ height: "7%" }}>
                <InfoBox title="Nº Última Boleta" value={vend.boleta} />
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} sx={{ height: "7%" }}>
                <InfoBox title="Nº Última Operación" value={vend.operacion} />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      ))}
    </div>
  );
};

const InfoBox = ({ title, value }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      height: "50px",
      borderRadius: "8px",
      border: "2px solid #ccc",
      justifyContent: "center",
      padding: "6px",
    }}
  >
    <Typography variant="subtitle1" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);

export default BoxVendedor;
