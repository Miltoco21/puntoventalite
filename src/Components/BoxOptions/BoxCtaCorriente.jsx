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
      console.error("Error al obtener los nuevos precios:", error);
    }
  };
  useEffect(() => {
    fetchDeudaData();
  }, [searchResults]);

  useEffect(() => {
    // Aquí puedes agregar más efectos secundarios si es necesario
    console.log("Se montó el componente BoxCtaCorriente");
  }, []);

  ////////////
  // const countSelectedCheckboxes = () => {
  //   // Filtrar el array de ventaData para obtener solo las deudas seleccionadas
  //   const selectedDeudas = ventaData.filter((deuda) => deuda.selected);

  //   // Devolver la longitud del array de deudas seleccionadas
  //   return selectedDeudas.length;
  // };
  //////////////////
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
    setMetodoPago("Transferencia"); // Establece el método de pago como "Transferencia"
    setOpenTransferenciaModal(true);
    setMontoPagado(getTotalSelected());
    setTotal(getTotalSelected());

    // Verificar si ventaData está definido y es un array antes de intentar mapearlo
    // if (Array.isArray(ventaData)) {
    //   // Establecer elementos seleccionados aquí
    //   const updatedVentaData = ventaData.map((item) => {
    //     // Verificar si item y deuda no son null antes de acceder a sus propiedades
    //     if (item !== null && deuda !== null) {
    //       return {
    //         ...item,
    //         selected: item.total === deuda.total, // Establecer seleccionado si el total coincide
    //       };
    //     } else {
    //       // Si item o deuda son null, simplemente retornar el item sin cambios
    //       return item;
    //     }
    //   });
    //   setSelectedDebts(updatedVentaData);
    //   // const selectedDebts = updatedVentaData.filter((deuda) => deuda.selected);
    //   // setSelectedDebts(selectedDebts);
    //   console.log(selectedDebts);// Actualizar selectedDebts con las deudas seleccionadas
    // } else {
    //   // Si ventaData no está definido o no es un array, mostrar un mensaje de advertencia o manejar la situación de acuerdo a tus necesidades
    //   console.warn("VentaData no está definido o no es un array");
    //   // Puedes mostrar una alerta, mensaje de consola, o tomar otra acción según lo requieras
    // }
  };

  // Agrega este console.log para verificar el valor de selectedDebts cada vez que cambie

  // const handleTransferenciaModalOpen = (deuda) => {
  //   setMetodoPago("Transferencia"); // Establece el método de pago como "Transferencia"
  //   setOpenTransferenciaModal(true);
  //   setMontoPagado(getTotalSelected());

  //   // Verificar si ventaData está definido y es un array antes de intentar mapearlo
  //   if (Array.isArray(ventaData)) {
  //     // Establecer elementos seleccionados aquí
  //     const updatedVentaData = ventaData.map((item) => {
  //       // Verificar si item y deuda no son null antes de acceder a sus propiedades
  //       if (item !== null && deuda !== null) {
  //         return {
  //           ...item,
  //           selected: item.total === deuda.total, // Establecer seleccionado si el total coincide
  //         };
  //       } else {
  //         // Si item o deuda son null, simplemente retornar el item sin cambios
  //         return item;
  //       }
  //     });
  //     setVentaData(updatedVentaData);
  //   } else {
  //     // Si ventaData no está definido o no es un array, mostrar un mensaje de advertencia o manejar la situación de acuerdo a tus necesidades
  //     console.warn("VentaData no está definido o no es un array");
  //     // Puedes mostrar una alerta, mensaje de consola, o tomar otra acción según lo requieras
  //   }
  // };

  const handleTransferenciaModalClose = () => {
    setOpenTransferenciaModal(false);
  };

  // const handleSelectAll = () => {
  //   const updatedVentaData = ventaData.map((deuda) => {
  //     return {
  //       ...deuda,
  //       selected: !selectAll,
  //     };
  //   });
  //   setVentaData(updatedVentaData);
  //   setSelectAll(!selectAll);
  // };
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
    // setSelectedDebts(selectedDebts);
    // setSelectedDeuda(deuda);
    setMontoPagado(getTotalSelected());
    handleTransferData(selectedDebts, montoPagado, metodoPago, {
      nombre: nombre,
      rut: rut,
      banco: selectedBanco,
      tipoCuenta: tipoCuenta,
      nroCuenta: nroCuenta,
      fecha: fecha,
      nroOperacion: nroOperacion,
    });
    console.log("selectedDebts en handleOpenPaymentDialog:", selectedDebts);
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
    setSelectedDeuda(null);
    setMontoPagado(0); // Reiniciar el valor del monto a pagar al cerrar el diálogo
    setMetodoPago("");
  };
  const handleTransferData = async (
    selectedDebts,
    montoPagado,
    metodoPago,
    transferencias
  ) => {
    try {
      console.log("Datos de transferencia:");
      console.log("Monto pagado:", montoPagado);
      console.log("Método de pago:", metodoPago);
      console.log("Datos de transferencia:", transferencias);
      console.log("Tipo de selectedDebts:", typeof selectedDebts);

      // Convertir selectedDebts en un array de valores
      const selectedDebtsArray = Object.values(selectedDebts);

      // Iterar sobre el array selectedDebtsArray
      for (const deuda of selectedDebtsArray) {
        console.log("Deuda seleccionada:");
        console.log("ID de la deuda:", deuda.id);
        console.log("ID de la cabecera:", deuda.idCabecera);
        console.log("Total de la deuda:", deuda.total);

        const requestBody = {
          deudaIds: [
            {
              idCuentaCorriente: deuda.id,
              idCabecera: deuda.idCabecera,
              total: montoPagado,
            },
          ],
          montoPagado: montoPagado,
          metodoPago: metodoPago,
          idUsuario: userData.codigoUsuario,
          transferencias: transferencias,
        };

        console.log("Datos de la solicitud antes de enviarla:");
        console.log(requestBody);

        // Aquí realizamos la llamada POST para cada deuda
        const response = await axios.post(
          "https://www.easyposdev.somee.com/api/Clientes/PostClientePagarDeudaTransferenciaByIdCliente",
          requestBody
        );

        if (response.status === 200) {
          console.log("Transferencia realizada con éxito");
          setSnackbarMessage(response.data.descripcion);
          setSnackbarOpen(true);

          setSearchResults([]);

          clearSalesData();

          setTimeout(() => {
            handleClosePaymentDialog(true);
            handleTransferenciaModalClose(true);
            onClose(); ////Cierre Modal al finalizar
          }, 3000);
        } else {
          console.error("Error al realizar la transferencia");
        }
      }
    } catch (error) {
      console.error("Error al realizar la transferencia:", error);
    }
  };

  // const handleTransferData = async (
  //   selectedDebts,
  //   montoPagado,
  //   metodoPago,
  //   transferencias
  // ) => {
  //   try {
  //     console.log("Datos de transferencia:");
  //     console.log("Monto pagado:", montoPagado);
  //     console.log("Método de pago:", metodoPago);
  //     console.log("Datos de transferencia:", transferencias);
  //     console.log("Tipo de selectedDebts:", typeof selectedDebts);

  //     for (const deuda of selectedDebts) {
  //       console.log("Deuda seleccionada:");
  //       console.log("ID de la deuda:", deuda.id);
  //       console.log("ID de la cabecera:", deuda.idCabecera);
  //       console.log("Total de la deuda:", deuda.total);

  //       const requestBody = {
  //         deudaIds: [
  //           {
  //             idCuentaCorriente: deuda.id,
  //             idCabecera: deuda.idCabecera,
  //             total: deuda.total,
  //           },
  //         ],
  //         montoPagado: montoPagado,
  //         metodoPago: metodoPago,
  //         transferencias: transferencias,
  //       };

  //       console.log("Datos de la solicitud antes de enviarla:");
  //       console.log(requestBody);

  //       // Aquí realizamos la llamada POST para cada deuda
  //       const response = await axios.post(
  //         "https://www.easyposdev.somee.com/api/Clientes/PostClientePagarDeudaTransferenciaByIdCliente",
  //         requestBody
  //       );

  //       if (response.status === 200) {
  //         console.log("Transferencia realizada con éxito");
  //       } else {
  //         console.error("Error al realizar la transferencia");
  //       }
  //     }

  //     handleTransferenciaModalClose();
  //   } catch (error) {
  //     console.error("Error al realizar la transferencia:", error);
  //   }
  // };

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
      {searchResults && searchResults.length > 0 && selectedUser&& 
        precioData &&
        precioData.clientesProductoPrecioMostrar && (
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
                      {searchResults&&searchResults[0].rutResponsable}
                      {/* {precioData.clientesProductoPrecioMostrar[0] &&
                        precioData.clientesProductoPrecioMostrar[0]
                          .codigoCliente}{" "}
                      {" " + " "} */}
                      <br />
                      {precioData.clientesProductoPrecioMostrar[0] &&
                        precioData.clientesProductoPrecioMostrar[0]
                          .nombreCliente}{" "}
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
              sx={{ width: "100%",display:"flex",justifyContent:"center" }}
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
                  Tarjeta Débitoo
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

      <Dialog
        open={openTransferenciaModal}
        onClose={handleTransferenciaModalClose}
      >
        <DialogTitle>Transferencia</DialogTitle>
        <DialogContent>
          {/* <Grid container spacing={2}>
            {selectedDebts.map((deuda, index) => (
              <Grid item xs={12} key={index}>
                <Typography>ID: {deuda.id}</Typography>
                <Typography>ID de Cabeceraaa: {deuda.idCabecera}</Typography>
                <Typography>
                  Descripción: {deuda.descripcionComprobante}
                </Typography>
                <Typography>
                  Número de Comprobante: {deuda.nroComprobante}
                </Typography>
                <Typography>
                  Total Pagado Parcial: ${deuda.totalPagadoParcial}
                </Typography>
                <Typography>Total: ${deuda.total}</Typography>
                
              </Grid>
            ))}
          </Grid> */}

          <Grid container spacing={2}>
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
            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              open={snackbarOpen}
              onClose={handleSnackbarClose}
              message={snackbarMessage}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTransferenciaModalClose}>Cerrar</Button>
          <Button
            onClick={() => {
              // Convertir el objeto selectedDebts en un array de valores
              const selectedDebtsArray = Object.values(selectedDebts);

              // Verificar que selectedDebtsArray sea un array y contenga los datos esperados
              console.log(
                "Tipo de selectedDebtsArray:",
                Array.isArray(selectedDebtsArray)
              );
              console.log(
                "Contenido de selectedDebtsArray:",
                selectedDebtsArray
              );

              // Iterar sobre el array selectedDebtsArray
              selectedDebtsArray.forEach((deuda) => {
                // Realizar las operaciones necesarias con cada deuda
                console.log("ID de la deuda:", deuda.id);
                console.log("ID de la cabecera:", deuda.idCabecera);
                console.log("Total de la deuda:", deuda.total);
                // Agregar aquí el resto de la lógica necesaria
              });

              // Llamar a la función handleTransferData con los datos preparados
              handleTransferData(selectedDebts, montoPagado, metodoPago, {
                nombre: nombre,
                rut: rut,
                banco: selectedBanco,
                tipoCuenta: tipoCuenta,
                nroCuenta: nroCuenta,
                fecha: fecha,
                nroOperacion: nroOperacion,
              });
            }}
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
