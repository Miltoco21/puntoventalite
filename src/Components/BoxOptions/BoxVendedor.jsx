/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Box,
  Typography,
 
} from "@mui/material";

const BoxVendedor = () => {
  const vendedores = [
    { codigo: 1, nombre: "Vendor 1" },
   
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
            width: "235px",
            height: "135px",
            marginBottom: "10px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography>Código de Vendedor: {vend.codigo}</Typography>
            <Box
              sx={{
                display: "flex",
                width: "175px",
                borderRadius: "8px",
                border: "2px solid #ccc",
                justifyContent: "center",
              }}
            >
              {vend.nombre}
            </Box>
          </Box>
        </Paper>
      ))}
    </div>
  );
};

export default BoxVendedor;
