import React, { useState, useContext, useEffect } from "react";
import {
  Grid,
  Avatar,
  Paper,
  Button,
  Typography,
  MenuItem,
  CircularProgress,
  InputLabel,
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import axios from "axios";

const BoxPagoTicket = ({ onCloseTicket }) => {
  const {
    userData,
    salesData,
    addToSalesData,
    setPrecioData,
    grandTotal,
    ventaData,
    setVentaData,
    searchResults,
    setSearchResults,
    updateSearchResults,
    selectedUser,
    setSelectedUser,
    selectedCodigoCliente,
    setSelectedCodigoCliente,
    selectedCodigoClienteSucursal,
    setSelectedCodigoClienteSucursal,
    clearSalesData,
    selectedChipIndex,
    setSelectedChipIndex,
    searchText,
    setSearchText,
  } = useContext(SelectedOptionsContext);

  const [totalCompra, setTotalCompra] = useState(grandTotal);
  const [cantidadPagada, setCantidadPagada] = useState(grandTotal);

  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [montoPagado, setMontoPagado] = useState(0); // Estado para almacenar el monto a pagar
  const [metodoPago, setMetodoPago] = useState("");

  const [openTransferenciaModal, setOpenTransferenciaModal] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const [fecha, setFecha] = useState(dayjs()); // Estado para almacenar la fecha actual

  const hoy = dayjs();
  const inicioRango = dayjs().subtract(1, "week"); // Resta 1 semanas

  const handleDateChange = (date) => {
    setFecha(date);
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

  const handleTransferenciaModalOpen = () => {
    setMetodoPago("TRANSFERENCIA"); // Establece el método de pago como "Transferencia"
    setOpenTransferenciaModal(true);
  };
  const handleTransferenciaModalClose = () => {
    setOpenTransferenciaModal(false);
  };

  const handleMetodoPagoClick = (metodo) => {
    setMetodoPago(metodo);
    setLoading(false); // Establecer el estado de loading en false cuando se selecciona un método de pago
  };

  const handleGenerarTicket = async () => {
    try {
      if (!userData.codigoUsuario) {
        setError("Por favor, ingresa el código de vendedor para continuar.");
        return;
      }
      if (cantidadPagada < grandTotal) {
        setError("Cantidad pagada no puede ser menor que el monto a pagar .");
        return;
      }
      if (grandTotal - cantidadPagada > 0) {
        setError("Cantidad pagada no puede ser menor que 0, ni estar vacia .");
        return;
      } else {
        setError("");
      }
      if (cantidadPagada <= 0) {
        setError("No se puede generar la boleta de pago porque el total cero.");
        return;
      }
      if (!metodoPago || cantidadPagada <= 0) {
        setError("Por favor, ingresa un monto válido para el pago.");
        setLoading(false);
        return;
      }

      // Validar el método de pago
      if (!metodoPago) {
        setError("Por favor, selecciona un método de pago.");
        setLoading(false);
        return;
      }
      if (!metodoPago || cantidadPagada <= 0) {
        setError("Por favor, ingresa un monto válido para el pago.");
        setLoading(false);
        return;
      }

      // Validar el código de usuario
      if (
        typeof userData.codigoUsuario !== "number" ||
        userData.codigoUsuario <= 0
      ) {
        setError("El código de usuario no es válido.");
        setLoading(false);
        return;
      }
      if (!metodoPago) {
        setError("Por favor, selecciona un método de pago.");
        setLoading(false);
        return;
      }

      // Validar el código de usuario
      if (
        typeof userData.codigoUsuario !== "number" ||
        userData.codigoUsuario <= 0
      ) {
        setError("El código de usuario no es válido.");
        setLoading(false);
        return;
      }

      // Validar que se haya seleccionado al menos una deuda

      setLoading(true);

      let endpoint =
        "https://www.easyposdev.somee.com/api/Ventas/RedelcomImprimirTicket";

      // Si el método de pago es TRANSFERENCIA, cambiar el endpoint y agregar datos de transferencia
      if (metodoPago === "TRANSFERENCIA") {
        endpoint =
          "https://www.easyposdev.somee.com/api/Ventas/RedelcomImprimirTicket";

        // Validar datos de transferencia
        if (
          nombre === "" &&
          rut === "" &&
          selectedBanco === "" &&
          tipoCuenta === "" &&
          nroCuenta === "" &&
          fecha === "" &&
          nroOperacion === ""
        ) {
          setTransferenciaError(
            "Por favor, completa todos los campos necesarios para la transferencia."
          );
          setLoading(false);
          return;
        } else {
          // Limpiar el error relacionado con el RUT
          setTransferenciaError("");
        }
        if (nombre === "") {
          setTransferenciaError("Por favor, ingresa el nombre.");
          setLoading(false);
          return;
        }
        if (rut === "") {
          setTransferenciaError("Por favor, ingresa el RUT.");
          setLoading(false);
          return;
        }
        if (!validarRutChileno(rut)) {
          setTransferenciaError("El RUT ingresado NO es válido.");
          setLoading(false);
          return;
        } else {
          // Limpiar el error relacionado con el RUT
          setTransferenciaError("");
        }

        if (selectedBanco === "") {
          setTransferenciaError("Por favor, selecciona el banco.");
          setLoading(false);
          return;
        }

        if (tipoCuenta === "") {
          setTransferenciaError("Por favor, selecciona el tipo de cuenta.");
          setLoading(false);
          return;
        }

        if (nroCuenta === "") {
          setTransferenciaError("Por favor, ingresa el número de cuenta.");
          setLoading(false);
          return;
        }

        if (fecha === "") {
          setTransferenciaError("Por favor, selecciona la fecha.");
          setLoading(false);
          return;
        }

        if (nroOperacion === "") {
          setTransferenciaError("Por favor, ingresa el número de operación.");
          setLoading(false);
          return;
        }
      }

      // Validar el método de pago

      // Otras validaciones que consideres necesarias...

      // Si se llega a este punto, todas las validaciones han pasado, proceder con la llamada a la API

      const requestBody = {
        idUsuario: userData.codigoUsuario,
        codigoClienteSucursal: selectedCodigoClienteSucursal, // Ajustar según la lógica de tu aplicación
        codigoCliente: selectedCodigoCliente, // Ajustar según la lógica de tu aplicación
        total: grandTotal,
        products: salesData.map((producto) => ({
          codProducto: producto.idProducto, // Ajustar la propiedad según el nombre real en tus datos
          cantidad: producto.quantity, // Ajustar la propiedad según el nombre real en tus datos
          precioUnidad: producto.precio, // Ajustar la propiedad según el nombre real en tus datos
          descripcion: producto.descripcion, // Ajustar la propiedad según el nombre real en tus datos
        })),
        metodoPago: cantidadPagada,
        transferencias: {
          idCuentaCorrientePago: 0,
          nombre: nombre,
          rut: rut,
          banco: selectedBanco,
          tipoCuenta: tipoCuenta,
          nroCuenta: nroCuenta,
          fecha: fecha,
          nroOperacion: nroOperacion,
        },
      };

      console.log("Request Body:", requestBody);

      const response = await axios.post(endpoint, requestBody);

      console.log("Response:", response.data);

      if (response.status === 200) {
        // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
        setSnackbarOpen(true);
        setSnackbarMessage(response.data.descripcion);
        clearSalesData();
        setSelectedUser(null);
        setSelectedChipIndex([]);
        setSearchResults([]);
        setSelectedCodigoCliente(0);
        setSearchText(""),
          setTimeout(() => {
            onCloseTicket();
          }, 1000);
      } else {
        console.error("Error al realizar el pago");
      }
    } catch (error) {
      console.error("Error al generar la factura electrónica:", error);
    } finally {
      setLoading(false);
    }
  };
  const validarRutChileno = (rut) => {
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) {
      // Si el formato del RUT no es válido, retorna false
      return false;
    }

    // Separar el número del RUT y el dígito verificador
    const partesRut = rut.split("-");
    const digitoVerificador = partesRut[1].toUpperCase();
    const numeroRut = partesRut[0];

    // Función para calcular el dígito verificador
    const calcularDigitoVerificador = (T) => {
      let M = 0;
      let S = 1;
      for (; T; T = Math.floor(T / 10)) {
        S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
      }
      return S ? String(S - 1) : "K";
    };

    // Validar el dígito verificador
    return calcularDigitoVerificador(numeroRut) === digitoVerificador;
  };

  const calcularVuelto = () => {
    const cambio = cantidadPagada - grandTotal;
    return cambio > 0 ? cambio : 0;
  };

  const handleKeyDown = (event, field) => {
    if (field === "marca") {
      const regex = /^[a-zA-Z]*$/;
      if (!regex.test(event.key) && event.key !== "Backspace") {
        event.preventDefault();
      }
    }
    if (field === "nombre") {
      const regex = /^[a-zA-Z]*$/;
      if (!regex.test(event.key) && event.key !== "Backspace") {
        event.preventDefault();
      }
    }
    if (field === "rut") {
      // Validar si la tecla presionada es un signo menos, un número, la letra 'k' o 'K', el guion '-' o la tecla de retroceso
      const allowedCharacters = /^[0-9kK-]+$/i; // Corregida para permitir el guion
      if (!allowedCharacters.test(event.key)) {
        // Verificar si la tecla presionada es el retroceso
        if (event.key !== "Backspace") {
          event.preventDefault(); // Prevenir la entrada de caracteres no permitidos
        }
      }
    }
    if (field === "cantidadPagada") {
      // Validar si la tecla presionada es un dígito o la tecla de retroceso
      const isDigitOrBackspace = /^[0-9\b]+$/;
      if (!isDigitOrBackspace.test(event.key)) {
        event.preventDefault(); // Prevenir la entrada de caracteres no permitidos
      }

      // Obtener el valor actual del campo cantidadPagada
      const currentValue = parseFloat(cantidadPagada);

      // Validar si el nuevo valor sería menor que el grandTotal
      if (currentValue * 10 + parseInt(event.key) < grandTotal * 10) {
        event.preventDefault(); // Prevenir la entrada de un monto menor al grandTotal
      }
    }
    
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
        <Typography variant="h4" sx={{ marginBottom: "2%" }}>
            Pagar Ticket
          </Typography>
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
          <TextField
            margin="dense"
            fullWidth
            name="cantidadPagada "
            label="Cantidad pagada"
            value={cantidadPagada || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (!value.trim()) {
                setCantidadPagada(0);
              } else {
                setCantidadPagada(parseFloat(value));
              }
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: 9,
            }}
            disabled={metodoPago !== "EFECTIVO"} // Deshabilitar la edición excepto para el método "EFECTIVO"
          />
          <TextField
            margin="dense"
            fullWidth
            type="number"
            label="Por pagar"
            value={Math.max(0, grandTotal - cantidadPagada)}
            InputProps={{ readOnly: true }}
          />
          {calcularVuelto() > 0 && (
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

        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <Typography sx={{ marginTop: "7%" }} variant="h6">
                Selecciona Método de Pago:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
            <Button
                id={`${metodoPago}-btn`}
                sx={{ height: "100%" }}
                fullWidth
                variant={metodoPago === "EFECTIVO" ? "contained" : "outlined"}
                onClick={() => setMetodoPago("EFECTIVO")}
                disabled={loading || cantidadPagada <= 0} // Deshabilitar si hay una carga en progreso o la cantidad pagada es menor o igual a cero
              >
                Efectivo
              </Button>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
            <Button
                id={`${metodoPago}-btn`}
                sx={{ height: "100%" }}
                variant={metodoPago === "DEBITO" ? "contained" : "outlined"}
                onClick={() => {
                  setMetodoPago("DEBITO");
                  setCantidadPagada(grandTotal); // Establecer el valor de cantidad pagada como grandTotal
              }}                fullWidth
              >
                Débito
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
            <Button
                id={`${metodoPago}-btn`}
                sx={{ height: "100%" }}
                variant={metodoPago === "CREDITO" ? "contained" : "outlined"}
                onClick={() => {
                  setMetodoPago("CREDITO");
                  setCantidadPagada(grandTotal); // Establecer el valor de cantidad pagada como grandTotal
              }}               
                fullWidth
              >
                Crédito
              </Button>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
            <Button
                sx={{ height: "100%" }}
                id={`${metodoPago}-btn`}
                fullWidth
                variant={
                  metodoPago === "CUENTACORRIENTE" ? "contained" : "outlined"
                }
                onClick={() => {
                  setMetodoPago("CUENTACORRIENTE");
                  setCantidadPagada(grandTotal); // Establecer el valor de cantidad pagada como grandTotal
              }}   
              >
                Cuenta Corriente
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Button
                sx={{ height: "100%" }}
                id={`${metodoPago}-btn`}
                variant={
                  metodoPago === "TRANSFERENCIA" ? "contained" : "outlined"
                }
                onClick={() => {
                  handleMetodoPagoClick("TRANSFERENCIA");
                  handleTransferenciaModalOpen(selectedDebts);
                }}
                fullWidth
              >
                Transferencia
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Button
                sx={{ height: "100%" }}
                variant="contained"
                fullWidth
                color="secondary"
                disabled={!metodoPago || cantidadPagada <= 0 || loading}
                onClick={handleGenerarTicket}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} /> Procesando...
                  </>
                ) : (
                  "Pagar"
                )}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={onCloseTicket}
          message={snackbarMessage}
        />
      </Grid>

      <Dialog
        open={openTransferenciaModal}
        onClose={handleTransferenciaModalClose}
      >
        <DialogTitle>Transferencia</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              {errorTransferenciaError && (
                <p style={{ color: "red" }}> {errorTransferenciaError}</p>
              )}
            </Grid>
            {/* {error && (
              <Grid item xs={12}>
                <Typography variant="body1" color="error">
                  {error}
                </Typography>
              </Grid>
            )} */}

            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Nombre
              </InputLabel>
              <TextField
                label="Nombre"
                value={nombre}
                name="nombre"
                onChange={(e) => setNombre(e.target.value)}
                onKeyDown={(event) => handleKeyDown(event, "nombre")}
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa rut sin puntos y con guión
              </InputLabel>
              <TextField
                label="ej: 11111111-1"
                variant="outlined"
                fullWidth
                value={rut}
                onChange={(e) => setRut(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>Ingresa Banco</InputLabel>
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
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Tipo de Cuenta{" "}
              </InputLabel>
              <TextField
                select
                label="Tipo de Cuenta"
                value={tipoCuenta}
                onChange={handleChangeTipoCuenta}
                fullWidth
              >
                {Object.entries(tiposDeCuenta).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {key}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Número de Cuenta{" "}
              </InputLabel>
              <TextField
                label="Número de cuenta"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                value={nroCuenta}
                onChange={(e) => setNroCuenta(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>Ingresa Fecha</InputLabel>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Ingresa Fecha"
                  value={fecha}
                  onChange={handleDateChange}
                  minDate={inicioRango}
                  maxDate={hoy}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Numero Operación
              </InputLabel>
              <TextField
                label="Numero Operación"
                variant="outlined"
                type="number"
                fullWidth
                value={nroOperacion}
                onChange={(e) => setNroOperacion(e.target.value)}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                sx={{ height: "100%" }}
                variant="contained"
                fullWidth
                color="secondary"
                disabled={!metodoPago || cantidadPagada <= 0 || loading}
                onClick={handleGenerarTicket}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} /> Procesando...
                  </>
                ) : (
                  "Pagar"
                )}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTransferenciaModalClose}>Cerrar</Button>
          {/* <Button
            onClick={handleTransferData}
            variant="contained"
            color="secondary"
          >
            Pagar
          </Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BoxPagoTicket;
