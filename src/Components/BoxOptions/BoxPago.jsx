import React, { useState,useContext,useEffect } from "react";
import {
  Grid,
  Paper,
  Button,
  Typography,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Autocomplete,
  TableContainer,
  TextField,
  TableHead,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider"

const RegistroCompra = () => {
  const {
    grandTotal

  } = useContext(SelectedOptionsContext);

  const [totalCompra, setTotalCompra] = useState(grandTotal);
  const [cantidadPagada, setCantidadPagada] = useState(0);


  // Función para calcular el monto restante por pagar
  const calcularPorPagar = () => {
    const porPagar = grandTotal - cantidadPagada;
    return Math.max(0, porPagar);
  };

  // Manejar cambios en el campo de total de compra
  const handleTotalCompraChange = (event) => {
    const total = parseFloat(event.target.value);
    setTotalCompra(total);
  };

  // Manejar cambios en el campo de cantidad pagada
  // const handleCantidadPagadaChange = (event) => {
  //   const cantidad = parseFloat(event.target.value);
  //   setCantidadPagada(cantidad);
  //   setTotalCompra(grandTotal - cantidad);

  // };
  const handleCantidadPagadaChange = (event) => {
    const cantidad = parseFloat(event.target.value);
    setCantidadPagada(cantidad);
  };

  // const calcularVuelto = () => {
  //   const porPagar = grandTotal - cantidadPagada;
  //   if(porPagar === 0)
  //   return (0 );
  //   if(porPagar < 0)
  //   return (grandTotal - cantidadPagada) // Mostrar cero si el porPagar es menor o igual a cero
  // };
  const calcularVuelto = () => {
    const porPagar = grandTotal - cantidadPagada;
    if (porPagar === 0) {
      return 0;
    } else if (porPagar < 0) {
      return Math.abs(porPagar);
    } else {
      return 0;
    }
  };



  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Registro de Compra</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="number"
          label="Total de la compra"
          value={grandTotal}
          InputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="number"
          label="Cantidad pagada"
          value={cantidadPagada}
          onChange={handleCantidadPagadaChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="number"
          label="Por pagar"
          value={calcularPorPagar()}
          InputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        {calcularPorPagar() < grandTotal && (
          <TextField
            fullWidth
            type="number"
            label="Vuelto"
            value={calcularVuelto()}
            InputProps={{ readOnly: true }}
          />
        )}
      </Grid>

      <Grid>
        <Button variant="outlined">Efectivo</Button>
        <Button variant="outlined">Debito</Button>
        <Button variant="outlined">Credito</Button>
      </Grid>
    </Grid>
  );
};

export default RegistroCompra;