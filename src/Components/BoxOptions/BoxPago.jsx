import React, { useState, useContext, useEffect } from "react";
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
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const RegistroCompra = () => {
  const { grandTotal } = useContext(SelectedOptionsContext);

  const [totalCompra, setTotalCompra] = useState(grandTotal);
  const [cantidadPagada, setCantidadPagada] = useState(0);
  const [metodoPago, setMetodoPago] = useState("");

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

  const handleMetodoPagoClick = (metodo) => {
    setMetodoPago(metodo);
  };
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
        <Typography variant="h4">Ventana de Pago</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <TextField
          margin="dense"
          fullWidth
          type="number"
          label="Total de la compra"
          value={grandTotal}
          InputProps={{ readOnly: true }}
        />
        <TextField
          margin="dense"
          fullWidth
          type="number"
          label="Cantidad pagada"
          value={cantidadPagada}
          onChange={handleCantidadPagadaChange}
        />
        <TextField
          margin="dense"
          fullWidth
          type="number"
          label="Por pagar"
          value={calcularPorPagar()}
          InputProps={{ readOnly: true }}
        />
        {calcularPorPagar() < grandTotal && (
          <TextField
            margin="dense"
            fullWidth
            type="number"
            label="Vuelto"
            value={calcularVuelto()}
            InputProps={{ readOnly: true }}
          />
        )}
      </Grid>

      <Grid item xs={12} md={6} lg={6}>
        <Grid>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleMetodoPagoClick("Efectivo")}
          >
            Efectivo
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleMetodoPagoClick("Débito")}
          >
            Débito
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleMetodoPagoClick("Crédito")}
          >
            Crédito
          </Button>
        </Grid>
      </Grid>
      {metodoPago && (
        <Grid item xs={12}>
          <Typography variant="body1">
            Método de pago seleccionado: {metodoPago}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default RegistroCompra;
