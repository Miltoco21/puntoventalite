import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Grid,
  Stack,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const BoxBoleta = () => {
  const {
    userData,
    ventaData,
    salesData,
    setVentaData,
    selectedCodigoCliente,
    selectedCodigoClienteSucursal,
  } = useContext(SelectedOptionsContext);

  const [montoPagado, setMontoPagado] = useState(0);
  const [metodoPago, setMetodoPago] = useState("");

  console.log("salesData:",salesData)

  useEffect(() => {
    // Calcular el total de los productos seleccionados
    const totalVenta = salesData.reduce((total, producto) => total + producto.precio, 0);
    // Establecer el total como el monto pagado
    setMontoPagado(totalVenta);
  }, [salesData]);

  const handlePagoBoleta = async () => {
    try {
      const pagoData = {
        idUsuario: userData.codigoUsuario,
        codigoClienteSucursal: selectedCodigoClienteSucursal,
        codigoCliente: selectedCodigoCliente,
        total: montoPagado,
        products: salesData.map((producto) => ({
          codProducto: producto.idProducto,
          cantidad: producto.quantity,
          precioUnidad: producto.precio,
          descripcion: producto.descripcion,
        })),
        metodoPago: metodoPago,
      };

      console.log("Datos antes de enviar la solicitud:", pagoData);

      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/GestionDTE/GenerarBoletaDTE",
        pagoData
      );

      console.log("Datos después de enviar la solicitud:", response.data);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  return (
    <Grid item xs={12}>
      <Typography variant="h5">Pagar Boleta</Typography>
      <Stack spacing={2}>
        <TextField
        margin="dense"
          label="Monto a Pagar"
          variant="outlined"
          value={montoPagado}
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
