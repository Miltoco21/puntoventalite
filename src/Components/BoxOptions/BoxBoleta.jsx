import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Grid,
  Stack,
  Typography,
  TextField,
  Snackbar,
  Button,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const BoxBoleta = ({onClose}) => {
  const {
    userData,
    ventaData,
    grandTotal,
    salesData,
    setVentaData,
    selectedCodigoCliente,
    selectedCodigoClienteSucursal,
    clearSalesData
  } = useContext(SelectedOptionsContext);

  const [montoPagado, setMontoPagado] = useState(0);
  const [metodoPago, setMetodoPago] = useState("");
  const [snackMessage, setSnackMessage] = useState(""); // 2. Nuevo estado para el mensaje del snack
  const [snackOpen, setSnackOpen] = useState(false); // Estado para controlar la visibilidad del Snackbar
  const [error, setError] = useState(null);
  console.log("salesData:",salesData)

  useEffect(() => {
    // Calcular el total de los productos seleccionados
    const totalVenta = salesData.reduce((total, producto) => total + producto.precio, 0);
    // Establecer el total como el monto pagado
    setMontoPagado(totalVenta);
  }, [salesData]);

  const handlePagoBoleta = async () => {
    if (grandTotal === 0) {
      setError("No se puede generar el ticket de pago porque el total a pagar es cero.");
      return;
    }
    try {
      const pagoData = {
        idUsuario: userData.codigoUsuario,
        codigoClienteSucursal: selectedCodigoClienteSucursal,
        codigoCliente: selectedCodigoCliente,
        total: grandTotal,
        products: salesData.map((producto) => ({
          codProducto: producto.idProducto,
          cantidad: producto.quantity,
          precioUnidad: producto.precio,
          descripcion: producto.descripcion,
        })),
        metodoPago: metodoPago,
      };

      console.log("Datos Boleta antes de enviar la solicitud:", pagoData);

      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/GestionDTE/GenerarBoletaDTE",
        pagoData
      );

      console.log("Datos después de enviar la solicitud:", response.data);
      if (response.status === 200) {
        setSnackMessage("Boleta guardada exitosamente");
        setSnackOpen(true);
        setTimeout(() => {
         
          onClose(); ////Cierre Modal al finalizar
        }, 2000);
        clearSalesData();
        
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  return (
    <Grid item xs={12}>
      <Typography variant="h5">Pagar Boleta</Typography>
      <Stack spacing={2}>
      {error && (
        <Grid item xs={12}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Grid>
      )}
        <TextField
        margin="dense"
          label="Monto a Pagar"
          variant="outlined"
          value={grandTotal}
          onChange={(e) => setMontoPagado(e.target.value)}
          fullWidth
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
        />
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Button
              sx={{ height: "100%" }}
              fullWidth
              variant={metodoPago === "Efectivo" ? "contained" : "outlined"}
              onClick={() => setMetodoPago("Efectivo")}
            >
              Efectivo
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              sx={{ height: "100%" }}
              variant={
                metodoPago === "Tarjeta Débito" ? "contained" : "outlined"
              }
              onClick={() => setMetodoPago("Tarjeta Débito")}
              fullWidth
            >
              Tarjeta Débito
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              sx={{ height: "100%" }}
              variant={
                metodoPago === "Tarjeta Crédito" ? "contained" : "outlined"
              }
              onClick={() => setMetodoPago("Tarjeta Crédito")}
              fullWidth
            >
              Tarjeta Crédito
            </Button>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="secondary"
          disabled={!metodoPago || montoPagado <= 0}
          onClick={handlePagoBoleta }
        >
          Pagar
        </Button>
      </Stack>
    </Grid>
  );
};

export default BoxBoleta;
