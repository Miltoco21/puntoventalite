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
import axios from "axios";

const BoxPagoTicket = () => {
  const {
    grandTotal,
    userData,
    salesData,
    addToSalesData,
    ventaData,
    searchResults,
    setVentaData,
  } = useContext(SelectedOptionsContext);

  const [totalCompra, setTotalCompra] = useState(grandTotal);
  const [cantidadPagada, setCantidadPagada] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [error, setError] = useState(null);

  const handleMetodoPagoClick = (metodo) => {
    setSelectedMethod(metodo);
  };

  const handleGenerarTicket = async () => {
    // Resto del código para generar el ticket...
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Pago de Ticket</Typography>
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
          onChange={(e) => setCantidadPagada(parseFloat(e.target.value))}
        />
        <TextField
          margin="dense"
          fullWidth
          type="number"
          label="Por pagar"
          value={Math.max(0, grandTotal - cantidadPagada)}
          InputProps={{ readOnly: true }}
        />
        {Math.max(0, grandTotal - cantidadPagada) < grandTotal && (
          <TextField
            margin="dense"
            fullWidth
            type="number"
            label="Vuelto"
            value={Math.abs(grandTotal - cantidadPagada)}
            InputProps={{ readOnly: true }}
          />
        )}
      </Grid>

      <Grid item xs={12} md={6} lg={6}>
      <Grid>
          <Button
            id={`${selectedMethod}-btn`}
            fullWidth
            variant={selectedMethod === "EFECTIVO" ? "contained" : "outlined"}
            onClick={() => handleMetodoPagoClick("EFECTIVO")}
          >
            Efectivo
          </Button>
          <Button
            id={`${selectedMethod}-btn`}
            fullWidth
            variant={selectedMethod === "TARJETA" ? "contained" : "outlined"}
            onClick={() => handleMetodoPagoClick("TARJETA")}
          >
            Débito
          </Button>
          <Button
            id={`${selectedMethod}-btn`}
            fullWidth
            variant={selectedMethod === "CREDITO" ? "contained" : "outlined"}
            onClick={() => handleMetodoPagoClick("CREDITO")}
          >
            Crédito
          </Button>
          <Button
            id={`${selectedMethod}-btn`}
            fullWidth
            variant={selectedMethod === "CUENTA CORRIENTE" ? "contained" : "outlined"}
            onClick={() => handleMetodoPagoClick("CUENTA CORRIENTE")}
          >
            Cuenta Corriente
          </Button>
        </Grid>
      </Grid>
      
      {error && (
        <Grid item xs={12}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default BoxPagoTicket;
