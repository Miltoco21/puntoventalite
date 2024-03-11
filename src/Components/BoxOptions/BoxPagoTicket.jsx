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
  Snackbar
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import axios from "axios";

const BoxPagoTicket = ({onCloseTicket}) => {
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    // Actualizar la cantidad pagada cuando cambia el total de la compra (grandTotal)
    setCantidadPagada(grandTotal);
  }, [grandTotal]);

  const handleMetodoPagoClick = (metodo) => {
    setSelectedMethod(metodo);
  };

  const handleGenerarTicket = async () => {
    const codigoClienteSucursal = searchResults[0].codigoClienteSucursal;
    const codigoCliente = searchResults[0].codigoCliente;
    try {
      const ticket = {
        idUsuario: userData.codigoUsuario,
        codigoClienteSucursal: codigoClienteSucursal,
        codigoCliente: codigoCliente,
        total: grandTotal,
        products: salesData.map((sale) => ({
          codProducto: sale.idProducto,
          cantidad: sale.quantity,
          precioUnidad: sale.precio,
          descripcion: sale.descripcion,
        })),
        metodoPago: selectedMethod, // Utiliza selectedMethod en lugar de metodoPago
      };

      console.log("Datos enviados por Axios:", ticket);
      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/Ventas/ImprimirTicket",
        ticket
      );

      console.log("Respuesta del servidor:", response.data);
      if (response.status === 200) {
        setSnackbarMessage(response.data.descripcion);
        setSnackbarOpen(true);
        
        // Esperar 4 segundos antes de cerrar el modal
        setTimeout(() => {
          onCloseTicket();
        }, 3000);
      }

    } catch (error) {
      console.error("Error al generar la boleta electrónica:", error);
      setError("Error al generar la boleta electrónica.");
    }
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
            variant={
              selectedMethod === "CUENTACORRIENTE"
                ? "contained"
                : "outlined"
            }
            onClick={() => handleMetodoPagoClick("CUENTACORRIENTE")}
          >
            Cuenta Corriente
          </Button>
        </Grid>
        <Grid>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handleGenerarTicket}
          >
            Procesar
          </Button>
        </Grid>
      </Grid>

      {/* {selectedMethod && (
        <Grid item xs={12}>
          <Typography variant="body1">
            Método de pago seleccionado: {selectedMethod}
          </Typography>
        </Grid>
      )} */}
      
      {error && (
        <Grid item xs={12}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Grid>
      )}

<Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={onCloseTicket}
        message={snackbarMessage}
      />

    </Grid>
  );
};

export default BoxPagoTicket;