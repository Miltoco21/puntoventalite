import React, { useContext, useState ,useEffect} from "react";
import { Box, Grid,Stack, Typography,  Snackbar,Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import axios from "axios";

const BoxCtaCorriente = () => {
  const { ventaData, setVentaData } = useContext(SelectedOptionsContext);
  console.log(ventaData);
  const [selectedDeuda, setSelectedDeuda] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [montoPagado, setMontoPagado] = useState(0); // Estado para almacenar el monto a pagar
  const [metodoPago, setMetodoPago] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para controlar la apertura del Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  
  const totalDeuda = ventaData ? ventaData.reduce((total, deuda) => total + deuda.total, 0) : 0;
   


  const handleOpenPaymentDialog = (deuda) => {
    setSelectedDeuda(deuda);
    setOpenDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setOpenDialog(false);
    setSelectedDeuda(null);
    setMontoPagado(0); // Reiniciar el valor del monto a pagar al cerrar el diálogo
    setMetodoPago("");
  };

  const handlePayment = async () => {
    try {
      const requestBody = {
        deudaIds: [{
          idCuentaCorriente: selectedDeuda.id, // Usar el ID de la deuda seleccionada
          idCabecera: selectedDeuda.idCabecera, // Usar el ID de la cabecera de la deuda seleccionada
          total: selectedDeuda.total // Usar el total de la deuda seleccionada
        }],
        montoPagado: montoPagado, // Usar el monto a pagar ingresado por el usuario
        metodoPago: metodoPago // Método de pago (puedes cambiarlo según tus necesidades)
      };
      console.log("Datos enviados antes de la solicitud:", requestBody);

      // Realizar la solicitud de pago
      const response = await axios.post('https://www.easyposdev.somee.com/api/Clientes/PostClientePagarDeudaByIdCliente', requestBody);
      
      // Aquí puedes manejar la respuesta, por ejemplo, actualizar los datos de venta después de realizar el pago
      console.log("Respuesta de pago:", response.data);

      // Cerrar el diálogo de pago
      handleClosePaymentDialog();

      if (response.data.statusCode === 200) {
        // Utiliza los datos de respuesta del servidor para actualizar ventaData en BoxCtaCorriente
        setVentaData(response.data.clienteDeuda);
  
        // Mostrar el mensaje de respuesta del pago en el Snackbar
        setSnackbarMessage(response.data.descripcion);
        setSnackbarOpen(true);
      } else {
        // Maneja cualquier error o respuesta no exitosa aquí
        console.error("Error en la respuesta del servidor:", response.data.descripcion);
      }
    } catch (error) {
      console.error("Error al realizar el pago:", error);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Cuenta Corriente
        </Typography>
      </Grid>
      <Grid item xs={12}>
  {ventaData && ventaData.length > 0 && (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Descripción</TableCell>
            <TableCell>Folio</TableCell>
            <TableCell>Pago Parcial</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ventaData.map((deuda) => (
            <TableRow key={deuda.id}>
              <TableCell>{deuda.descripcionComprobante}</TableCell>
              <TableCell>{deuda.nroComprobante}</TableCell>
              <TableCell>${deuda.totalPagadoParcial}</TableCell>
              <TableCell>${deuda.total}</TableCell>
              <TableCell>
                <Button variant="outlined" onClick={() => handleOpenPaymentDialog(deuda)}>Pagar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableRow>
          <TableCell colSpan={2} align="right">
            <strong>Total Deuda:</strong>
          </TableCell>
          <TableCell>${totalDeuda}</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </Table>
    </TableContainer>
  )}
</Grid>

      <Dialog open={openDialog} onClose={handleClosePaymentDialog}>
        <DialogTitle>Pagar Deuda</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body1">Total a Pagar: ${selectedDeuda ? selectedDeuda.total : ""}</Typography>
            <TextField
              label="Monto a Pagar"
              variant="outlined"
              value={montoPagado}
              onChange={(e) => setMontoPagado(e.target.value)}
              fullWidth
            />
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Button variant="contained" onClick={() => setMetodoPago("Efectivo")} fullWidth>
                  Efectivo
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button variant="contained" onClick={() => setMetodoPago("Tarjeta Débito")} fullWidth>
                  Tarjeta Débito
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button variant="contained" onClick={() => setMetodoPago("Tarjeta Crédito")} fullWidth>
                  Tarjeta Crédito
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button variant="contained" onClick={() => setMetodoPago("Transferencia")} fullWidth>
                  Transferencia
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Cancelar</Button>
          <Button onClick={handlePayment} variant="contained" color="primary">Pagar</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Grid>
  );
};

export default BoxCtaCorriente;
