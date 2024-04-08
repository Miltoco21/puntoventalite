import React, { useContext, useState, useEffect } from "react";
import {
  Paper,
  Avatar,
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

const BoxCtaCorriente = ({ onClose }) => {
  const {
    userData,
    precioData,
    searchResults,
    setSearchResults,
    setPrecioData,
    clearSalesData,
    selectedUser,
    setSelectedUser,
    ventaData,
    setVentaData,
    selectedCodigoCliente,
    selectedCodigoClienteSucursal,
  } = useContext(SelectedOptionsContext);
  console.log("userData:", userData);
  console.log("ventaData:", ventaData);
  console.log("selectedCodigoCliente:", selectedCodigoCliente);
  console.log("selectedCodigoClienteSucursal:", selectedCodigoClienteSucursal);
  const fetchDeudaData = async () => {
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/Clientes/GetClientesDeudasByIdCliente?codigoClienteSucursal=${selectedCodigoClienteSucursal}&codigoCliente=${selectedCodigoCliente}`
      );

      console.log("Nuevas Deudas:", response.data);

      setVentaData(response.data.clienteDeuda);
    } catch (error) {
      console.error("Error al obtener los nuevos DEUDAS:", error);
    }
  };
  useEffect(() => {
    fetchDeudaData();
  }, [searchResults]);

  ////////////
  // const countSelectedCheckboxes = () => {
  //   // Filtrar el array de ventaData para obtener solo las deudas seleccionadas
  //   const selectedDeudas = ventaData.filter((deuda) => deuda.selected);

  //   // Devolver la longitud del array de deudas seleccionadas
  //   return selectedDeudas.length;
  // };
  //////////////////
  const [rutError, setRutError] = useState(""); // Estado para manejar errores de validación del RUT
  const [transferenciaExitosa,setTransferenciaExitosa]= useState(false);
  const [selectedDeuda, setSelectedDeuda] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [montoPagado, setMontoPagado] = useState(0); // Estado para almacenar el monto a pagar
  const [metodoPago, setMetodoPago] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para controlar la apertura del Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openTransferenciaModal, setOpenTransferenciaModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre
  const [rut, setRut] = useState(""); // Estado para almacenar el rut
  const [nroCuenta, setNroCuenta] = useState(""); // Estado para almacenar el número de cuenta
  const [nroOperacion, setNroOperacion] = useState(""); // Estado para almacenar el número de operación
  const [selectedDebts, setSelectedDebts] = useState([]);
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

  // Agrega este console.log para verificar el valor de selectedDebts justo antes de abrir el diálogo de transferencia
  console.log(
    "selectedDebts justo antes de abrir el diálogo de transferencia:",
    selectedDebts
  );
  useEffect(() => {
    console.log("selectedDebts cambió:", selectedDebts);
  }, [selectedDebts]);

  const handleTransferenciaModalOpen = () => {
    setMetodoPago("TRANSFERENCIA"); // Establece el método de pago como "Transferencia"
    setOpenTransferenciaModal(true);
    setMontoPagado(getTotalSelected());
  };

  const handleTransferenciaModalClose = () => {
    setOpenTransferenciaModal(false);
  };

  const handleSelectAll = () => {
    // Invertir el estado de selección de todas las deudas
    setSelectAll(!selectAll);
    // Actualizar el estado de selección de cada deuda en ventaData
    const updatedVentaData = ventaData.map((deuda) => ({
      ...deuda,
      selected: !selectAll,
    }));
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

  const handleOpenPaymentDialog = (selectedDebts) => {
    setOpenDialog(true);
    setSelectedDebts(ventaData.filter((deuda) => deuda.selected));

    setMontoPagado(getTotalSelected());
  };
  const handleCheckboxChange = (index) => {
    const updatedVentaData = [...ventaData];
    updatedVentaData[index].selected = !updatedVentaData[index].selected;
    setVentaData(updatedVentaData);

    // Identificar todos los objetos seleccionados
    const selectedDebts = updatedVentaData.filter((deuda) => deuda.selected);
    setSelectedDebts(selectedDebts);
    // Mostrar los datos seleccionados en la consola
    console.log("Datos seleccionados por checkbox:", selectedDebts);
  };

  const handleClosePaymentDialog = () => {
    setOpenDialog(false);

    setMontoPagado(0); // Reiniciar el valor del monto a pagar al cerrar el diálogo
    setMetodoPago("");
  };

  const handleTransferData = async () => {
    try {
      // Calcular el monto total pagado sumando los totales de las deudas seleccionadas
      const montoPagado = selectedDebts.reduce(
        (total, deuda) => total + deuda.total,
        0
      );

      const requestBody = {
        deudaIds: selectedDebts.map((deuda) => ({
          idCuentaCorriente: deuda.id,
          idCabecera: deuda.idCabecera,
          total: deuda.total, // Utilizamos el total de cada deuda individual
        })),
        montoPagado: montoPagado, // Utilizamos el monto total pagado
        metodoPago: metodoPago,
        idUsuario: userData.codigoUsuario,
        transferencias: {
          nombre: nombre,
          rut: rut,
          banco: selectedBanco,
          tipoCuenta: tipoCuenta,
          nroCuenta: nroCuenta,
          fecha: fecha,
          nroOperacion: nroOperacion,
        },
      };

      console.log("Request Body:", requestBody); // Verifica el cuerpo de la solicitud

      // Realizar la solicitud de transferencia para cada deuda seleccionada
      for (const deuda of selectedDebts) {
        const response = await axios.post(
          "https://www.easyposdev.somee.com/api/Clientes/PostClientePagarDeudaTransferenciaByIdCliente",
          requestBody
        );

        console.log("Response:", response); // Verifica la respuesta de la solicitud

        if (response.status === 200) {
          console.log("Transferencia exitosa:", response.data.descripcion);
          setSnackbarOpen(true);
          setSnackbarMessage(response.data.descripcion);
          setSnackbarOpen(true);
          setSearchResults([]);
          clearSalesData();
          setTransferenciaExitosa(true)///guardo datos de transferencia
          setTimeout(() => {
            handleClosePaymentDialog();
            handleTransferenciaModalClose();
            onClose();
          }, 3000);
        } else {
          console.error("Error al realizar la transferencia");
        }
      }
    } catch (error) {
      console.error("Error al realizar la transferencia:", error);
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
      {/* precioData &&
         precioData.clientesProductoPrecioMostrar &&  */}
      {searchResults && searchResults.length > 0 && selectedUser && (
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={12} lg={12}>
            <Paper>
              <Box
                display="flex"
                p={1.5}
                gap={2}
                bgcolor={"#f5f5f5"}
                borderRadius={4}
                sx={{ alignItems: "center" }}
              >
                <Box>
                  <Avatar sx={{ borderRadius: 3, width: 48, height: 48 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: "#696c6f" }}>
                    ID:
                    {selectedUser.rutResponsable}
                    {/* {precioData.clientesProductoPrecioMostrar[0] &&
                        precioData.clientesProductoPrecioMostrar[0]
                          .codigoCliente}{" "}
                      {" " + " "} */}
                    <br />
                    {selectedUser.nombreResponsable}
                    {""} {selectedUser.apellidoResponsable}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
      <Grid item xs={12}>
        {ventaData && ventaData.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAll}
                      color="primary"
                    />
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
                        checked={deuda.selected || false}
                        onChange={() => handleCheckboxChange(index)}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>{deuda.descripcionComprobante}</TableCell>
                    <TableCell>{deuda.nroComprobante}</TableCell>
                    <TableCell>${deuda.totalPagadoParcial}</TableCell>
                    <TableCell>${deuda.total}</TableCell>
                    <TableCell sx={{ display: "none" }}>
                      ${deuda.idCabecera}
                    </TableCell>

                    <TableCell>
                   
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableRow>
                <TableCell colSpan={3} align="right">
                  <Typography> Total Deuda : ${totalDeuda}</Typography>
                </TableCell>
              </TableRow>

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

                <TableCell></TableCell>
              </TableRow>
            </Table>
          </TableContainer>
        )}
      </Grid>

      <Dialog open={openDialog} onClose={handleClosePaymentDialog}>
        <DialogTitle>Pagar Deuda </DialogTitle>
        <DialogContent>
          <Grid spacing={2}>
            {/* <Typography variant="body1">Monto a Pagar:</Typography> */}

            <TextField
              margin="dense"
              label="Monto a Pagar"
              variant="outlined"
              value={montoPagado}
              onChange={(e) => setMontoPagado(e.target.value)}
              fullWidth
              InputProps={{ readOnly: true }}
              inputProps={{
                inputMode: "numeric", // Establece el modo de entrada como numérico
                pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
              }}
            />
            <Typography variant="body1">Selecciona método de pago:</Typography>

            <Grid
              container
              item
              sm={12}
              md={12}
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
              spacing={2}
            >
              <Grid item xs={6} sm={3} md={3}>
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
              <Grid item xs={6} sm={3} md={3}>
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
              <Grid item xs={6} sm={3} md={3}>
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
              <Grid item xs={6} sm={3} md={3}>
                <Button
                  sx={{ height: "100%" }}
                  id="transferencia-btn"
                  variant={
                    metodoPago === "Transferencia" ? "contained" : "outlined"
                  }
                  onClick={() => handleTransferenciaModalOpen(selectedDebts)}
                >
                  Transferencia
                </Button>
              </Grid>
            </Grid>
          </Grid>
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
            {/* <Grid item xs={12} sm={6}>
              {" "}
              <Typography
                variant="body1"
                color={rutError ? "error" : "success"}
              >
                {rutError ? "RUT no válido" : "RUT válido"}
              </Typography>
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Rut "
                variant="outlined"
                fullWidth
                value={rut} // Asigna el estado `rut` como valor
                onChange={(e) => setRut(e.target.value)}
              />
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
                value={nroCuenta} // Asigna el estado `numeroCuenta` como valor
                onChange={(e) => setNroCuenta(e.target.value)}
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
              <TextField
                label="Numero Operación"
                variant="outlined"
                fullWidth
                value={nroOperacion} // Asigna el estado `numeroOperacion` como valor
                onChange={(e) => setNroOperacion(e.target.value)}
              />
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
            Guardar Datos Transferencia
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default BoxCtaCorriente;
