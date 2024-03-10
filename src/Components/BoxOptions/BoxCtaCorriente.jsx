import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  Snackbar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  MenuItem,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  DialogActions,
  TextField,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import axios from "axios";

const BoxCtaCorriente = () => {
  const { ventaData, setVentaData } = useContext(SelectedOptionsContext);
  console.log("ventaData", ventaData);
  const [selectedDeuda, setSelectedDeuda] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [montoPagado, setMontoPagado] = useState(0); // Estado para almacenar el monto a pagar
  const [metodoPago, setMetodoPago] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para controlar la apertura del Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openTransferenciaModal, setOpenTransferenciaModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const [tipoCuenta, setTipoCuenta] = useState(""); // Estado para almacenar el tipo de cuenta seleccionado
  const tiposDeCuenta = {
    "Cuenta Corriente": "Cuenta Corriente",
    "Cuenta de Ahorro": "Cuenta de Ahorro",
    "Cuenta Vista": "Cuenta Vista",
    "Cuenta Rut": "Cuenta Rut",
    "Cuenta de Depósito a Plazo (CDP)": "Cuenta de Depósito a Plazo (CDP)",
    "Cuenta de Inversión": "Cuenta de Inversión",
  };
  const handleChangeTipoCuenta = (event) => {
    setTipoCuenta(event.target.value); // Actualizar el estado del tipo de cuenta seleccionado
  };

  const bancosChile = [
    { id: 1, nombre: "Banco de Chile" },
    { id: 2, nombre: "Banco Santander Chile" },
    { id: 3, nombre: "Banco Estado" },
    { id: 4, nombre: "Scotiabank Chile" },
    { id: 5, nombre: "Banco BCI" },
    { id: 6, nombre: "Banco Itaú Chile" },
    { id: 7, nombre: "Banco Security" },
    { id: 8, nombre: "Banco Falabella" },
    { id: 9, nombre: "Banco Ripley" },
    { id: 10, nombre: "Banco Consorcio" },
    { id: 11, nombre: "Banco Internacional" },
    { id: 12, nombre: "Banco Edwards Citi" },
    { id: 13, nombre: "Banco de Crédito e Inversiones" },
    { id: 14, nombre: "Banco Paris" },
    { id: 15, nombre: "Banco Corpbanca" },
    { id: 16, nombre: "Banco BICE" },

    // Agrega más bancos según sea necesario
  ];

  const obtenerFechaActual = () => {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const day = fecha.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [fecha, setFecha] = useState(obtenerFechaActual()); // Estado para almacenar la fecha actual

  const handleFechaChange = (event) => {
    setFecha(event.target.value); // Actualizar el estado de la fecha cuando cambie
  };

  // Estado para el valor seleccionado del banco
  const [selectedBanco, setSelectedBanco] = useState("");

  // Función para manejar el cambio en el selector de banco
  const handleBancoChange = (event) => {
    setSelectedBanco(event.target.value);
  };

  const handleTransferenciaModalOpen = () => {
    setMetodoPago("Transferencia"); // Establece el método de pago como "Transferencia"
    setOpenTransferenciaModal(true); //
  };

  const handleTransferenciaModalClose = () => {
    setOpenTransferenciaModal(false);
  };

  const handleSelectAll = () => {
    const updatedVentaData = ventaData.map((deuda) => {
      return {
        ...deuda,
        selected: !selectAll,
      };
    });
    setVentaData(updatedVentaData);
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (index) => {
    const updatedVentaData = [...ventaData];
    updatedVentaData[index].selected = !updatedVentaData[index].selected;
    setVentaData(updatedVentaData);
  };

  const getTotalSelected = () => {
    let totalSelected = 0;
    ventaData.forEach((deuda) => {
      if (deuda.selected) {
        totalSelected += deuda.total;
      }
    });
    return totalSelected;
  };

  const totalDeuda = ventaData
    ? ventaData.reduce((total, deuda) => total + deuda.total, 0)
    : 0;

  const handleOpenPaymentDialog = (deuda) => {
    setSelectedDeuda(deuda);
    setMontoPagado(getTotalSelected());
    setOpenDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setOpenDialog(false);
    setSelectedDeuda(null);
    setMontoPagado(0); // Reiniciar el valor del monto a pagar al cerrar el diálogo
    setMetodoPago("");
  };

  const handleTransferData = async () => {
    try {
      // Construir el objeto de datos de transferencia
      const transferData = {
        nombre: nombre, // Nombre del titular de la cuenta
        rut: rut, // Rut del titular de la cuenta
        banco: selectedBanco, // Banco seleccionado
        tipoCuenta: tipoCuenta, // Tipo de cuenta seleccionado
        numeroCuenta: numeroCuenta, // Número de cuenta
        fecha: fecha, // Fecha de la transferencia
        numeroOperacion: numeroOperacion, // Número de operación
      };
  
      // Mostrar los datos de transferencia en la consola
      console.log('Datos de transferencia:', transferData);
  
      // Realizar la solicitud POST utilizando Axios
      const response = await axios.post('URL_DE_TU_API', transferData);
  
      // Verificar la respuesta del servidor
      if (response.status === 200) {
        // Si la solicitud es exitosa, puedes realizar acciones adicionales aquí
        console.log('Transferencia realizada con éxito');
        // Cerrar el modal de transferencia
        handleTransferenciaModalClose();
      } else {
        // Manejar errores o respuestas no exitosas aquí
        console.error('Error al realizar la transferencia');
      }
    } catch (error) {
      // Capturar y manejar cualquier error de la solicitud
      console.error('Error al realizar la transferencia:', error);
    }
  };
  

  const handlePayment = async () => {
    try {
      const requestBody = {
        deudaIds: [
          {
            idCuentaCorriente: selectedDeuda.id, // Usar el ID de la deuda seleccionada
            idCabecera: selectedDeuda.idCabecera, // Usar el ID de la cabecera de la deuda seleccionada
            total: selectedDeuda.total, // Usar el total de la deuda seleccionada
          },
        ],
        montoPagado: montoPagado, // Usar el monto a pagar ingresado por el usuario
        metodoPago: metodoPago, // Método de pago (puedes cambiarlo según tus necesidades)
      };
      console.log("Datos enviados antes de la solicitud:", requestBody);

      // Realizar la solicitud de pago
      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/Clientes/PostClientePagarDeudaByIdCliente",
        requestBody
      );

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
        console.error(
          "Error en la respuesta del servidor:",
          response.data.descripcion
        );
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
        <Typography variant="h4" gutterBottom>
          Cuenta Corriente
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {ventaData && ventaData.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {/* <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAll}
                      color="primary"
                    /> */}
                  </TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Folio</TableCell>
                  <TableCell>Pago Parcial</TableCell>
                  <TableCell>Total</TableCell>
                  {/* <TableCell>Acciones</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {ventaData.map((deuda, index) => (
                  <TableRow key={deuda.id}>
                    <TableCell>
                      <Checkbox
                        checked={deuda.selected}
                        onChange={() => handleCheckboxChange(index)}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>{deuda.descripcionComprobante}</TableCell>
                    <TableCell>{deuda.nroComprobante}</TableCell>
                    <TableCell>${deuda.totalPagadoParcial}</TableCell>
                    <TableCell>${deuda.total}</TableCell>
                    <TableCell>
                      {/* <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenPaymentDialog(deuda)}
                      >
                        Pagar
                      </Button> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenPaymentDialog}
                    disabled={getTotalSelected() === 0}
                  >
                    Pagar Total Seleccionado (${getTotalSelected()})
                  </Button>
                </TableCell>

                <TableCell sx={{ height: "200%" }} colSpan={3} align="right">
                  <Button variant="contained" color="secondary">
                    Total Deuda ${totalDeuda}
                  </Button>
                </TableCell>
                <TableCell></TableCell>
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
            <Typography variant="body1">
              Total a Pagar: ${selectedDeuda ? selectedDeuda.total : ""}
            </Typography>

            <TextField
              label="Monto a Pagar"
              variant="outlined"
              value={montoPagado}
              onChange={(e) => setMontoPagado(e.target.value)}
              fullWidth
            />
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Button
                  sx={{ height: "100%" }}
                  id="efectivo-btn"
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
                  id="debito-btn"
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
                  id="credito-btn"
                  variant={
                    metodoPago === "Tarjeta Crédito" ? "contained" : "outlined"
                  }
                  onClick={() => setMetodoPago("Tarjeta Crédito")}
                  fullWidth
                >
                  Tarjeta Crédito
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  sx={{ height: "100%" }}
                  id="transferencia-btn"
                  variant={
                    metodoPago === "Transferencia" ? "contained" : "outlined"
                  }
                  onClick={handleTransferenciaModalOpen}
                  fullWidth
                >
                  Transferencia
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Cerrar</Button>
          <Button onClick={handlePayment} variant="contained" color="secondary">
            Pagar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
      <Dialog
        open={openTransferenciaModal}
        onClose={handleTransferenciaModalClose}
      >
        <DialogTitle>Transferencia</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Nombre " variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Rut " variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Banco"
                value={selectedBanco}
                onChange={handleBancoChange}
                fullWidth
              >
                {bancosChile.map((banco) => (
                  <MenuItem key={banco.id} value={banco.nombre}>
                    {banco.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Tipo de Cuenta"
                value={tipoCuenta}
                onChange={handleChangeTipoCuenta}
                fullWidth
              >
                {/* Mapeo del objeto tiposDeCuenta para generar los elementos MenuItem */}
                {Object.entries(tiposDeCuenta).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {key}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

           
            <Grid item xs={12} sm={6}>
              <TextField
                label="Número de cuenta"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
        label="Fecha"
        variant="outlined"
        fullWidth
        type="date" // Especificamos que el tipo de input es 'date' para que aparezca un selector de fecha en el navegador
        value={fecha}
        onChange={handleFechaChange}
        InputLabelProps={{
          shrink: true, // Encoger la etiqueta para evitar solapamientos
        }}
      />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Numero Opercaion" variant="outlined" fullWidth />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTransferenciaModalClose}>Cerrar</Button>
          <Button
            onClick={handleTransferData}
            variant="contained"
            color="secondary"
          >
            Guardar Datos
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default BoxCtaCorriente;
