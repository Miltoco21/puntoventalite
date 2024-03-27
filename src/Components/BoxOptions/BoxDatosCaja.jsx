/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  Grid,
  Chip,
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
      nombre: userData.nombres + " " + userData.apellidos || " nombreapellido",
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
            background: "#859398",
            marginBottom: "20px",
            padding: "20px",
          }}
          variant="outlined"
        >
          <Grid container item xs={12} lg={12} spacing={2} alignItems="center">
            <Grid item xs={6} md={6} lg={6}>
              <Chip
                sx={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  "& .MuiChip-label": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  "& .highlighted": {
                    color: "blue", // Color para el texto entre comillas
                  },
                }}
                label={
                  <span>
                    Vendedor: <span className="highlighted">{vend.nombre}</span>
                  </span>
                }
              />
              {/* <Chip
                sx={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  "& .MuiInputLabel-root": {
                    color: "blue", // Color del label editable
                  },
                }}
                fullWidth
                label={"Vendedor: " + vend.nombre} 
                value={vend.nombre}
              /> */}
            </Grid>
            <Grid item xs={6} md={3} lg={6}>
              <Chip
                sx={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  "& .MuiChip-label": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  "& .highlighted": {
                    color: "blue", // Color para el texto entre comillas
                  },
                }}
                label={
                  <span>
                    Nº Última Operación:{" "}
                    <span className="highlighted">{vend.operacion}</span>
                  </span>
                }
              />
            </Grid>
            <Grid item xs={3} md={3} lg={3}>
              <Chip
                sx={{
                  backgroundColor: "white",
                  "& .MuiInputLabel-root": {
                    color: "blue", // Color del label editable
                  },
                }}
                fullWidth
                label={
                  <span>
                    Código: <span style={{ color: "blue" }}>{vend.codigo}</span>
                  </span>
                }
                value={vend.codigo}
              />
            </Grid>
            <Grid item xs={3} md={3} lg={2}>
              <Chip
                sx={{
                  backgroundColor: "white",
                  // borderRadius: "20px",
                  "& .MuiInputLabel-root": {
                    color: "blue", // Color del label editable
                  },
                }}
                fullWidth
                label={
                  <span>
                    Caja: <span style={{ color: "blue" }}>{vend.codigo}</span>
                  </span>
                }
                value={vend.caja}
              />
            </Grid>

            <Grid item xs={6} md={3} lg={6}>
              <Chip
                sx={{
                  backgroundColor: "white",
                  // borderRadius: "20px",
                  "& .MuiInputLabel-root": {
                    color: "blue", // Color del label editable
                  },
                }}
                fullWidth
                label={
                  <span>
                    Última Boleta:{" "}
                    <span style={{ color: "blue" }}>{vend.boleta}</span>
                  </span>
                }
                value={vend.boleta}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}
    </>
  );
};

export default BoxVendedor;
