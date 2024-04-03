import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
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

const Boxfactura = ({ onClose }) => {
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
  const [openTransferenciaModal, setOpenTransferenciaModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre
  const [rut, setRut] = useState(""); // Estado para almacenar el rut
  const [nroCuenta, setNroCuenta] = useState(""); // Estado para almacenar el número de cuenta
  const [nroOperacion, setNroOperacion] = useState(""); // Estado para almacenar el número de operación
  const [selectedDebts, setSelectedDebts] = useState([]);
  const [tipoCuenta, setTipoCuenta] = useState(""); 
  const [errorTransferenciaError, setTransferenciaError] = useState(""); 
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
  const handleTransferenciaModalOpen = () => {
    setMetodoPago("Transferencia"); // Establece el método de pago como "Transferencia"
    setOpenTransferenciaModal(true);
   
  };
  const handleTransferenciaModalClose = () => {
    setOpenTransferenciaModal(false);
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
        },
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
 
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleTransferData = async (
    
   
    metodoPago,
    transferencias
  ) => {
    try {
      console.log("Datos de transferencia:");
      console.log("Monto pagado:", grandTotal);
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
              total:  grandTotal,
            },
          ],
          montoPagado: grandTotal,
          metodoPago: metodoPago,
          idUsuario: userData.codigoUsuario,
          transferencias: {
            // idCuentaCorrientePago: 0,
            nombre: nombre,
            rut: rut,
            banco: banco,
            tipoCuenta: tipoCuenta,
            nroCuenta: nroCuenta,
            fecha: fecha,
            nroOperacion: nroOperacion,
          },
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
  return (
    <Grid item xs={12} sm={12} md={12} lg={12}>
      <Typography sx={{ marginBottom: "2%" }} variant="h5">
        Pagar Factura
      </Typography>
      <Stack spacing={2}>
        {error && (
          <Grid item xs={12}>
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Grid>
        )}
        <TextField
          sx={{ marginBottom: "5%" }}
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
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid>
            <Typography variant="h6">Selecciona Método de Pago:</Typography>
          </Grid>

          <Grid item xs={12} sm={2} md={12}>
            <Grid item xs={12} sm={12} md={12}>
              <Button
                sx={{ height: "100%" }}
                fullWidth
                variant={metodoPago === "Efectivo" ? "contained" : "outlined"}
                onClick={() => setMetodoPago("Efectivo")}
              >
                Efectivo
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
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
            <Grid item xs={12} sm={12} md={12}>
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
            <Grid item xs={12} sm={6} md={12}>
              <Button
                sx={{ height: "100%" }}
                variant={
                  metodoPago === "Transferencia" ? "contained" : "outlined"
                }
                onClick={() => handleTransferenciaModalOpen(selectedDebts)}
                fullWidth
              >
                Transferencia
              </Button>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                disabled={!metodoPago || montoPagado <= 0}
                onClick={handlePagoFactura}
              >
                Pagar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Stack>
      <Snackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
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
          {errorTransferenciaError&& <p style={{ color: "red" }}> {errorTransferenciaError}</p>}
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
                label="Ingrese rut con puntos y guión "
                placeholder=" ej : 13.344.434-6"
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
              if (
                !nombre ||
                !rut ||
                !selectedBanco ||
                !tipoCuenta ||
                !nroCuenta ||
                !fecha ||
                !nroOperacion
              ) {
                setTransferenciaError("Por favor complete todos los campos obligatorios.");
                return;
              }
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

              // Validar campos y RUT

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

              
              // Puedes mostrar un mensaje de error aquí si lo deseas
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

export default Boxfactura;
