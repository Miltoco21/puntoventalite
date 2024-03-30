import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Grid,
  Stack,
  Typography,
  Snackbar,
  TextField,
  Button,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const Boxfactura = ({onClose}) => {
  const {
    userData,
    ventaData,
    grandTotal,
    clearSalesData,
    salesData,
    setVentaData,
    searchResults,
    selectedCodigoCliente,
    selectedCodigoClienteSucursal,
  } = useContext(SelectedOptionsContext);

  const [montoPagado, setMontoPagado] = useState(0);
  const [metodoPago, setMetodoPago] = useState("");
  const [error, setError] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  console.log("salesData:", salesData);
  console.log("searchResults FACTURA:", searchResults);
  // const [clienteDatosFactura, setClienteDatosFactura] = useState({
  //   rut: searchResults[0].rutResponsable,
  //   razonSocial: searchResults[0].razonSocial,
  //   nombre: searchResults[0].nombreResponsable,
  //   apellido: searchResults[0].apellidoResponsable,
  //   direccion: searchResults[0].direccion,
  //   region: searchResults[0].region,
  //   comuna: searchResults[0].comuna,
  //   giro: searchResults[0].giro,
  // });


  useEffect(() => {
    // Calcular el total de los productos seleccionados
    const totalVenta = salesData.reduce(
      (total, producto) => total + producto.precio,
      0
    );
    // Establecer el total como el monto pagado
    setMontoPagado(totalVenta);
  }, [salesData]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handlePagoFactura = async () => {
    
    try {
      const pagoFactura = {
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
        clienteDatosFactura: {
          rut: searchResults[0].rutResponsable,
          razonSocial: searchResults[0].razonSocial,
          nombre: searchResults[0].nombreResponsable,
          apellido: searchResults[0].apellidoResponsable,
          direccion: searchResults[0].direccion,
          region: searchResults[0].region,
          comuna: searchResults[0].comuna,
          giro: searchResults[0].giro,
        }
      };

      console.log("Datos Factura antes de enviar la solicitud:", pagoFactura);

      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/GestionDTE/GenerarFacturaDTE",
        pagoFactura
      );
      if (response.status === 200) {
        setSnackbarMessage("Factura guardada exitosamente");
        setSnackbarOpen(true);
        setTimeout(() => {
         
          onClose(); ////Cierre Modal al finalizar
        }, 2000);
        clearSalesData();
        
      }
      

      console.log("Datos después de enviar la solicitud:", response.data);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setSnackbarMessage("Error en el proceso");
    }
  };
  return (
    <Grid item xs={12}>
      <Typography variant="h5">Pagar Factura</Typography>
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
          onClick={handlePagoFactura}
        >
          Pagar
        </Button>
      </Stack>
      <Snackbar
        open={snackbarOpen}
        
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Grid>
  );
};

export default Boxfactura;
