import React, { useState, useContext, useEffect } from "react";
import {
  Grid,
  Paper,
  Button,
  Typography,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Autocomplete,
  TableContainer,
  TextField,
  TableHead,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  DialogActions,
  Snackbar,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import axios from "axios";

const BoxPagoTicket = ({ onCloseTicket }) => {
  const {
    grandTotal,
    userData,
    setSearchResults,
    setSalesData,
    salesData,
    addToSalesData,
    clearSalesData,
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
  const [montoPagado, setMontoPagado] = useState(0); // Estado para almacenar el monto a pagar
  const [metodoPago, setMetodoPago] = useState("");

  const [transferenciaExitosa, setTransferenciaExitosa] = useState(false);

  const [openTransferenciaModal, setOpenTransferenciaModal] = useState(false);

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
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
  };
  const handleTransferenciaModalClose = () => {
    setOpenTransferenciaModal(false);
  };

  useEffect(() => {
    // Actualizar la cantidad pagada cuando cambia el total de la compra (grandTotal)
    setCantidadPagada(grandTotal);
  }, [grandTotal]);

  const handleMetodoPagoClick = (metodo) => {
    setSelectedMethod(metodo);
  };

  const handleTransferData = async () => {
    try {
      if (
        !nombre ||
        !rut ||
        !selectedBanco ||
        !tipoCuenta ||
        !nroCuenta ||
        !fecha ||
        !nroOperacion
      ) {
        setTransferenciaError(
          "Por favor complete todos los campos obligatorios."
        );
        return;
      }

      const requestBody = {
        deudaIds: selectedDebts.map((deuda) => ({
          idCuentaCorriente: selectedCodigoCliente,
          idCabecera: deuda.idCabecera,
          total: grandTotal,
        })),
        montoPagado: grandTotal,
        metodoPago: selectedMethod,
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

      console.log("Datos de la solicitud antes de enviarla:", requestBody);

      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/Ventas/RedelcomImprimirTicket",
        requestBody
      );

      console.log("Datos de la respuesta después de enviarla:", response);

      if (response.status === 200) {
        setSnackbarMessage(response.data.descripcion);
        setSnackbarOpen(true);

        setSearchResults([]);
        setSelectedUser([]);
        clearSalesData();
        setTransferenciaExitosa(true);

        setTimeout(() => {
          handleClosePaymentDialog(true);
          handleTransferenciaModalClose(true);
          onClose(); ////Cierre Modal al finalizar
        }, 3000);
        console.log(
          "Información TransferenciaTICKET al servidor en:",
          new Date().toLocaleString()
        );
      } else {
        console.error("Error al realizar la transferencia");
      }
    } catch (error) {
      console.error("Error al realizar la transferencia:", error);
    }
  };

  const handleGenerarTicket = async () => {
    try {
      if (selectedMethod === "TRANSFERENCIA" && !transferenciaExitosa) {
        // Si el método de pago es transferencia y la transferencia no ha sido exitosa,
        // entonces no procesar el pago y mostrar un mensaje de error
        setError(
          "Por favor, complete la transferencia correctamente antes de generar el ticket."
        );
        return;
      }

      if (grandTotal === 0) {
        setError(
          "No se puede generar el ticket de pago porque el total a pagar es cero."
        );
        return;
      }

      if (isNaN(cantidadPagada) || cantidadPagada < 0) {
        setError("Por favor, ingresa una cantidad pagada válida.");
        return;
      }

      const codigoClienteSucursal = searchResults[0].codigoClienteSucursal;
      const codigoCliente = searchResults[0].codigoCliente;

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
        metodoPago: selectedMethod,
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

      console.log("Datos enviados por Axios:", ticket);
      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/Ventas/RedelcomImprimirTicket",
        ticket
      );

      console.log("Respuesta del servidor:", response.data);
      if (response.status === 200) {
        setSnackbarMessage(response.data.descripcion);
        setSnackbarOpen(true);
        setSearchResults([]);
        clearSalesData();
        setTransferenciaExitosa(true);

        // Esperar 4 segundos antes de cerrar el modal
        setTimeout(() => {
          onCloseTicket();
        }, 3000);
      }
      console.log(
        "Información TICKET al servidor en:",
        new Date().toLocaleString()
      );
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
      {error && (
        <Grid item xs={12}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Grid>
      )}

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
          value={cantidadPagada || ""} // Si cantidadPagada es falsy (null, undefined, NaN, 0, ""), se mostrará una cadena vacía en lugar de "NaN"
          onChange={(e) => {
            const value = e.target.value; // Valor ingresado en el campo
            if (!value.trim()) {
              // Verifica si el valor ingresado está vacío o solo contiene espacios
              setCantidadPagada(0); // Si está vacío, establece la cantidad pagada como 0
            } else {
              setCantidadPagada(parseFloat(value)); // De lo contrario, actualiza la cantidad pagada con el valor ingresado
            }
          }}
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
          <Typography variant="h6">Selecciona Método de Pago:</Typography>
        </Grid>
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
              selectedMethod === "CUENTACORRIENTE" ? "contained" : "outlined"
            }
            onClick={() => handleMetodoPagoClick("CUENTACORRIENTE")}
          >
            Cuenta Corriente
          </Button>
          <Button
            id={`${selectedMethod}-btn`}
            variant={
              selectedMethod === "TRANSFERENCIA" ? "contained" : "outlined"
            }
            onClick={() => {
              handleMetodoPagoClick("TRANSFERENCIA");
              handleTransferenciaModalOpen(selectedDebts);
            }} // Ambas funciones separadas por punto y coma
            fullWidth
          >
            Transferencia
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

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={onCloseTicket}
        message={snackbarMessage}
      />
      <Dialog
        open={openTransferenciaModal}
        onClose={handleTransferenciaModalClose}
      >
        <DialogTitle>Transferencia</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {errorTransferenciaError && (
              <p style={{ color: "red" }}> {errorTransferenciaError}</p>
            )}
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

export default BoxPagoTicket;
