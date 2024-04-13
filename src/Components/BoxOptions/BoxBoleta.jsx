import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Paper,
  Avatar,
  Box,
  Grid,
  Stack,
  Typography,
  CircularProgress,
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

const BoxBoleta = ({ onClose }) => {
  const {
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
  } = useContext(SelectedOptionsContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para controlar la apertura del Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log("salesData:", salesData);

  const navigate = useNavigate();
  const [montoPagado, setMontoPagado] = useState(0); // Estado para almacenar el monto a pagar
  const [metodoPago, setMetodoPago] = useState("");
  const [cantidadPagada, setCantidadPagada] = useState(grandTotal);
  const [openTransferenciaModal, setOpenTransferenciaModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
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

  const handleTransferenciaModalOpen = () => {
    setMetodoPago("TRANSFERENCIA"); // Establece el método de pago como "Transferencia"
    setOpenTransferenciaModal(true);
  };
  const handleTransferenciaModalClose = () => {
    setOpenTransferenciaModal(false);
  };

  useEffect(() => {
    // Calcular el total de los productos seleccionados
    const totalVenta = salesData.reduce(
      (total, producto) => total + producto.precio,
      0
    );
    // Establecer el total como el monto pagado
    setMontoPagado(totalVenta);
  }, [salesData]);

  const handlePagoBoleta = async () => {
    if (
      metodoPago === "TRANSFERENCIA" &&
      (!nombre ||
        !rut ||
        !selectedBanco ||
        !tipoCuenta ||
        !nroCuenta ||
        !fecha ||
        !nroOperacion)
    ) {
      setTransferenciaError(
        "Todos los campos de transferencia son obligatorios."
      );
      return;
    } else setTransferenciaError("");

    if (!validarRutChileno(rut)) {
      setTransferenciaError("El RUT ingresado NOO es válido.");
      return;
    }

    if (!userData.codigoUsuario) {
      setError(" Ingresa Código de Vendedor para continuar.");
      return;
    }
    if (grandTotal === 0) {
      setError(
        "No se puede generar el boleta de pago porque el total a pagar es cero."
      );
      return;
    }
    try {
      const cambio = cantidadPagada - grandTotal;
      if (cambio < 0) {
        setError("La cantidad pagada es insuficiente.");
        return;
      }
      setLoading(true);
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

      console.log("Datos Boleta antes de enviar la solicitud:", pagoData);

      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/GestionDTE/GenerarBoletaDTE",
        pagoData
      );

      console.log("Datos después de enviar la solicitud:", response.data);
      if (response.status === 200) {
        setSnackbarMessage("Boleta guardada exitosamente");
        setSnackbarOpen(true);
        clearSalesData(); // Limpia los datos de ventas
        setSelectedUser(null); // Desmarca el usuario seleccionado
        setSelectedChipIndex([]); // Limpia el índice del chip seleccionado
        setSearchResults([]); // Limpia los resultados de búsqueda
        setSelectedCodigoCliente(0); // Establece el código de cliente seleccionado como 0
        handleOpenPreciosClientesDialog(0, 0); // Limpia los datos del diálogo de precios
        handleOpenDeudasClientesDialog(0, 0);

        setTimeout(() => {
          onClose(); ////Cierre Modal al finalizar
        }, 3000);
      }
      console.log(
        "Información BOLETA enviada al servidor en:",
        new Date().toLocaleString()
      );
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleMetodoPagoClick = (metodo) => {
    setSelectedMethod(metodo);
  };

  const validarRutChileno = (rut) => {
    // Expresión regular para validar RUT chileno permitiendo puntos como separadores de miles

    const rutRegex = /^\d{1,3}(?:\.\d{3})?-\d{1}[0-9kK]$/;

    console.log("Input RUT:", rut);
    if (!rutRegex.test(rut)) {
      setTransferenciaError("El RUT ingresado NO tiene el formato correcto.");
      return false;
    }

    // Eliminar puntos del RUT
    const rutWithoutDots = rut.replace(/\./g, "");

    // Dividir el RUT en número y dígito verificador
    const rutParts = rutWithoutDots.split("-");
    const rutNumber = rutParts[0];
    const rutDV = rutParts[1].toUpperCase();

    console.log("RUT Number:", rutNumber);
    console.log("RUT DV:", rutDV);

    // Calcular el dígito verificador esperado
    let suma = 0;
    let multiplo = 2;
    for (let i = rutNumber.length - 1; i >= 0; i--) {
      suma += rutNumber.charAt(i) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    const dv =
      dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();
    console.log("Expected DV:", dv);

    // Comparar el dígito verificador ingresado con el esperado
    if (dv !== rutDV) {
      setTransferenciaError("El RUT ingresado NAAAA es válido.");
      return false;
    }
    if (dv === rutDV) {
      console.log("El RUT ingresado  es válido.");

      return true;
    }

    return true;
  };

  const calcularVuelto = () => {
    const cambio = cantidadPagada - grandTotal;
    return cambio > 0 ? cambio : 0;
  };

  const validateFields = () => {
    const requiredFields = [
      "nombre",
      "rut",
      "selectedBanco",
      "tipoCuenta",
      "nroCuenta",
      "fecha",
      "nroOperacion",
    ];
    let isValid = true;
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!fields[field]) {
        newErrors[field] = `El campo ${field} es requerido.`;
        isValid = false;
      }
    });

    // Validación específica para RUT
    if (!validarRutChileno(rut)) {
      newErrors.rut = "El RUT ingresado NOt es válido.";
      isValid = false;
    }

    // Validación de cantidad pagada
    if (cantidadPagada < grandTotal) {
      newErrors.cantidadPagada = "La cantidad pagada es insuficiente.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
          <Typography variant="h4" sx={{ marginBottom: "2%" }}>
            Pagar Boleta
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
        <Grid item xs={12} md={6} lg={6}>
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
              >
                Efectivo
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Button
                id={`${metodoPago}-btn`}
                sx={{ height: "100%" }}
                variant={metodoPago === "DEBITO" ? "contained" : "outlined"}
                onClick={() => setMetodoPago("DEBITO")}
                fullWidth
              >
                Débito
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <Button
                id={`${metodoPago}-btn`}
                sx={{ height: "100%" }}
                variant={metodoPago === "CREDITO" ? "contained" : "outlined"}
                onClick={() => setMetodoPago("CREDITO")}
                fullWidth
              >
                Crédito
              </Button>
            </Grid>
            {/* <Grid item xs={12} sm={12} md={12}>
              <Button
                sx={{ height: "100%" }}
                id={`${metodoPago}-btn`}
                fullWidth
                variant={
                  metodoPago === "CUENTACORRIENTE"
                    ? "contained"
                    : "outlined"
                }
                onClick={() => setMetodoPago("CUENTACORRIENTE")}
              >
                Cuenta Corriente
              </Button>
            </Grid> */}
            <Grid item xs={12} sm={6} md={12}>
              <Button
                id={`${metodoPago}-btn`}
                sx={{ height: "100%" }}
                variant={
                  metodoPago === "TRANSFERENCIA" ? "contained" : "outlined"
                }
                onClick={() => {
                  setMetodoPago("TRANSFERENCIA");
                  handleTransferenciaModalOpen(selectedDebts);
                }}
                fullWidth
              >
                Transferencia
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <Button
                sx={{ height: "100%" }}
                variant="contained"
                fullWidth
                color="secondary"
                disabled={!metodoPago || montoPagado <= 0 || loading}
                onClick={handlePagoBoleta}
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
      </Grid>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        onClose={onClose}
        message={snackbarMessage}
      />

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
                label="Ingrese rut con puntos y guión"
                placeholder=" ej : 13.344.434-6"
                variant="outlined"
                fullWidth
                value={rut}
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
              <TextField
                label="Fecha"
                variant="outlined"
                fullWidth
                type="date"
                value={fecha}
                onChange={handleFechaChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  readOnly: true, // Deshabilita la entrada manual
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            disabled={!metodoPago || montoPagado <= 0 || loading}
            onClick={handlePagoBoleta}
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
            sx={{ height: "100%" }}
            variant="contained"
            fullWidth
            color="secondary"
            disabled={!metodoPago || montoPagado <= 0 || loading}
            onClick={handlePagoBoleta}
          >
            {loading ? (
              <>
                <CircularProgress size={20} /> Procesando...
              </>
            ) : (
              "Pagar"
            )}
          </Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BoxBoleta;
