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
  console.log("userData", userData);
  console.log("ventaData", ventaData);
  console.log("searchResults", searchResults);
  console.log("salesdata", salesData);

  const [totalCompra, setTotalCompra] = useState(grandTotal);
  const [cantidadPagada, setCantidadPagada] = useState(0);
  const [metodoPago, setMetodoPago] = useState("");
  const [error, setError] = useState(null);

  const handleMetodoPagoClick = (metodo) => {
    setMetodoPago(metodo);

    // Actualizar el estado de los botones de método de pago
  };

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

  const handleGenerarTicket = async () => {
    const codigoClienteSucursal = searchResults[0].codigoClienteSucursal;
    const codigoCliente = searchResults[0].codigoCliente;
    try {
      const ticket = {
        idUsuario: userData.codigoUsuario,
        codigoClienteSucursal: codigoClienteSucursal,
        codigoCliente: codigoCliente,
        total:grandTotal,

        products: salesData.map((sale) => ({
          codProducto: sale.idProducto,
          cantidad: sale.quantity,
          precioUnidad: sale.precio,
          descripcion: sale.descripcion,
        })),
        metodoPago: metodoPago,
      };

      // Mostrar los datos que se están enviando por Axios
      console.log("Datos enviados por Axios:", ticket);
      // Realizar la solicitud POST a la API para generar la boleta electrónica
      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/Ventas/ImprimirTicket",
        ticket
      );

      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      if (error.response) {
        console.log(
          "Server responded with error status:",
          error.response.status
        );
        console.log("Error response data:", error.response.data);
        console.log("Error response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log("No response received from server.");
        console.log("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error message:", error.message);
      }
      console.log("Error config:", error.config);

      setError("Error al generar la boleta electrónica.");
      setError("Error al generar la boleta electrónica.");
    }
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Pago de Tickett</Typography>
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
            onClick={() => handleMetodoPagoClick("EFECTIVO")}
            // sx={efectivoSelected ? "primary" : "default"} // Cambiar el color si está seleccionado
          >
            Efectivo
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleMetodoPagoClick("TARJETA")}
            // color={debitoSelected ? "primary" : "default"}
          >
            Débito
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleMetodoPagoClick("TARJETA")}
            // color={creditoSelected ? "primary" : "default"}
          >
            Crédito
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleMetodoPagoClick("CUENTA CORRIENTE")}
            // color={cuentaCorrienteSelected ? "primary" : "default"}
          >
            Cuenta Corriente
          </Button>
          <Grid>
            <Button fullWidth variant="contained" onClick={handleGenerarTicket}>
              Procesar
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {metodoPago && (
        <Grid item xs={12}>
          <Typography variant="body1">
            Método de pago seleccionado: {metodoPago}
          </Typography>
        </Grid>
      )}
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
