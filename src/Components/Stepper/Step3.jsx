/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  Snackbar,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";

const Step3Component = ({ data, onNext, stepData }) => {
  const apiUrl = import.meta.env.VITE_URL_API2;

  const [newUnidad, setNewUnidad] = useState("");
  const [stockInicial, setStockInicial] = useState(data.stockInicial);
  const [precioCosto, setPrecioCosto] = useState(data.precioCosto);
  const [selectedUnidadId, setSelectedUnidadId] = useState(
    data.selectedUnidadId || ""
  );

  const [precioVenta, setPrecioVenta] = useState(data.precioVenta);
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState("");
  const [openDialog1, setOpenDialog1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);


  console.log("data:", data);
 
  

  const handleNext = async () => {
    const isValid = validateFields();

    if (!isValid) {
      // Si los campos no son válidos, no continuar
      return;
    }

    setLoading(true);

    // Crear objeto con los datos del paso 1
    const step1Data = {
      respuestaSINO: "",
      pesoSINO: "",
      marca: data.marca,
      categoriaID: data.selectedCategoryId || 0, // Utilizamos 0 si el valor es undefined
      subCategoriaID: data.selectedSubCategoryId || 0,
      familiaID: data.selectedFamilyId || 0,
      subFamilia: data.selectedSubFamilyId || 0,
      nombre: data.nombre, // Debes proporcionar un valor adecuado aquí
    };

    // Crear objeto con los datos del paso 3
    const step3Data = {
      unidad: selectedUnidadId, // Debes proporcionar un valor adecuado aquí
      precioCosto: parseFloat(precioCosto) || 0, // Convertir a número y usar 0 si no hay valor
      stockInicial: parseInt(stockInicial) || 0, // Convertir a número entero y usar 0 si no hay valor
    };

    // Crear objeto con los datos del paso 4
    const step4Data = {
      formatoVenta: 0, // Debes proporcionar un valor adecuado aquí
      precioVenta: parseFloat(precioVenta) || 0, // Convertir a número y usar 0 si no hay valor
    };

    // Combinar todos los pasos en un solo objeto
    const requestData = {
      name: "string", // Debes proporcionar un valor adecuado aquí
      step1: step1Data,
      step2: {
        bodega: "string", // Debes proporcionar un valor adecuado aquí
        proveedor: "string", // Debes proporcionar un valor adecuado aquí
      },
      step3: step3Data,
      step4: step4Data,
      step5: {
        stockCritico: 0, // Debes proporcionar un valor adecuado aquí
        impuesto: "string", // Debes proporcionar un valor adecuado aquí
        selectedFile: {}, // Debes proporcionar un valor adecuado aquí
        nota: "string", // Debes proporcionar un valor adecuado aquí
      },
    };

    console.log("Datos objeto productos", requestData);

    try {
      // Enviar la petición POST al endpoint con los datos combinados
      const response = await axios.post(
        `${import.meta.env.VITE_URL_API2}/ProductosTmp/AddProducto`,
        requestData
      );

      // Manejar la respuesta de la API
      console.log("Response:", response);
      if (response.status === 200) {
        setEmptyFieldsMessage("Producto guardado exitosamente");
        setOpenSnackbar(true);
      }

      // Llamar a la función onNext para continuar con el siguiente paso
      onNext(requestData, 3);
    } catch (error) {
      setSnackbarMessage("Error al guardar el producto");
      setOpenSnackbar(true);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  const handleOpenDialog1 = () => {
    setOpenDialog1(true);
  };
  const handleCloseDialog1 = () => {
    setOpenDialog1(false);
  };

  const handleUnidadSelect = (selectedUnidadId) => {
    setSelectedUnidadId(selectedUnidadId === "" ? 0 : selectedUnidadId);
    console.log("Unidad seleccionada:", selectedUnidadId);
  };
  const handleCreateUnidad = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog1(false);
  };

  const validateFields = () => {
    
    // Verificar si todos los campos están vacíos
    if (
      selectedUnidadId === "" &&
      precioCosto === "" &&
      precioVenta === "" &&
      stockInicial === ""
    ) {
      setEmptyFieldsMessage("Todos los campos son obligatorios.");
      return false;
    }
   
    // Verificar cada campo individualmente y mostrar el primer campo vacío
    if (selectedUnidadId === "") {
      setEmptyFieldsMessage("Debe seleccionar una unidad.");
      return false;
    }
  
    if (precioCosto === "") {
      setEmptyFieldsMessage("Favor completar precio de costo.");
      return false;
    }
    if (isNaN(parseFloat(precioCosto)) || parseFloat(precioCosto) === 0) {
      setEmptyFieldsMessage("El precio de costo no puede ser cero.");
      return false;
    }
  
    if (precioVenta === "") {
      setEmptyFieldsMessage("Favor completar precio de venta.");
      return false;
    }
    if (isNaN(parseFloat(precioVenta)) || parseFloat(precioVenta) === 0) {
      setEmptyFieldsMessage("El precio de venta no puede ser cero.");
      return false;
    }
    if (parseFloat(precioVenta) < parseFloat(precioCosto)) {
      setEmptyFieldsMessage("El precio de venta debe ser al menos igual al precio de costo.");
      return false;
    }
  
    if (stockInicial === "") {
      setEmptyFieldsMessage("Favor completar Stock Inicial.");
      return false;
    }
    if (isNaN(parseFloat(stockInicial)) || parseFloat(stockInicial) === 0) {
      setEmptyFieldsMessage("El stock inicial no puede ser cero.");
      return false;
    }
  
    // Si todos los campos están completos, limpiar el mensaje de error
    setEmptyFieldsMessage("");
    return true;
  };
  

  // useEffect(() => {
  //   async function fetchBodegas() {
  //     try {
  //       const response = await axios.get(
  //         "https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetAllBodegas"
  //       );
  //       setBodegas(response.data.categorias);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   fetchBodegas();
  // }, []);

  const unidades = [
    { idUnidad: 0, descripcion: "Sin unidad" },
    { idUnidad: 1, descripcion: "KG" },
    { idUnidad: 2, descripcion: "UNI" },
    { idUnidad: 3, descripcion: "MM" },
    { idUnidad: 4, descripcion: "CM" },
    { idUnidad: 5, descripcion: "LT" },
    { idUnidad: 6, descripcion: "OZ" },
    { idUnidad: 7, descripcion: "CAJON" },
    { idUnidad: 8, descripcion: "DISPLAY" },
    { idUnidad: 9, descripcion: "PALLET" },
    { idUnidad: 10, descripcion: "MALLA" },
  ];
  const handleKeyDown = (event, field) => {
    // Verificar en qué campo se está escribiendo
   if (field === "precio") {
    // Permitir solo dígitos numéricos y la tecla de retroceso
    if (!/^\d+$/.test(event.key) && event.key !== "Backspace") {
      event.preventDefault();
    }
  }
  };
  const handleChange = (event, field) => {
    // Asegurar que el valor solo contenga números
    // Eliminar caracteres especiales específicos
    const newValue = event.target.value.replace(/[^0000000-9]/g, "");
    if (field === "precioCosto") {
      setPrecioCosto(newValue);
    } else if (field === "precioVenta") {
      setPrecioVenta(newValue);
    } else if (field === "stockInicial") {
      setStockInicial(newValue);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "16px",
        width: "100%",
      }}
    >
      {" "}
      <form onSubmit={handleNext}>
        <Grid container spacing={2} item xs={12} md={12}>
          <Grid item xs={12} md={6}>
            <InputLabel sx={{ marginBottom: "2%" }}>
              Unidad de Compra
            </InputLabel>
            <Grid display="flex" alignItems="center">
              <Select
                required
                fullWidth
                sx={{ width: "100%" }}
                value={selectedUnidadId}
                onChange={(e) => handleUnidadSelect(e.target.value)}
                label="Selecciona Unidad"
              >
                {unidades.map((unidad) => (
                  <MenuItem key={unidad.idUnidad} value={unidad.idUnidad}>
                    {unidad.descripcion}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Precio Costo
              </InputLabel>
              <TextField
                required
                sx={{ width: "100%" }}
                label="Precio Costo"
                name="precioCosto"
                fullWidth
                value={precioCosto}
                onChange={(event) => handleChange(event, "precioCosto")}
                onKeyDown={(event) => handleKeyDown(event, "precioCosto")}
                inputProps={{
                  inputMode: "numeric", // Establece el modo de entrada como numérico
                  pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Precio Venta
              </InputLabel>

              <TextField
                required
                sx={{
                  width: "100%",
                }}
                label="Precio Venta"
                fullWidth
                value={precioVenta}
                onChange={(event) => handleChange(event, "precioVenta")}
                onKeyDown={(event) => handleKeyDown(event, "precioVenta")}
                inputProps={{
                  inputMode: "numeric", // Establece el modo de entrada como numérico
                  pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Stock Inicial
              </InputLabel>
              <TextField
                required
                sx={{ width: "100%" }}
                label="Stock Inicial"
                fullWidth
                value={stockInicial}
                onChange={(event) => handleChange(event, "stockInicial")}
                onKeyDown={(event) => handleKeyDown(event, "stockInicial")}
                inputProps={{
                  inputMode: "numeric", // Establece el modo de entrada como numérico
                  pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Producto"}
            </Button>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box mt={2}>
              {
                <Typography variant="body2" color="error">
                  {emptyFieldsMessage}
                </Typography>
              }
            </Box>
          </Grid>
        </Grid>
        <Snackbar
         open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={emptyFieldsMessage}
      />
      </form>
     
      <Dialog open={openDialog1} onClose={handleCloseDialog1}>
        <DialogTitle>Crear Unidad de Compra</DialogTitle>
        <DialogContent sx={{ marginTop: "9px" }}>
          <TextField
            label="Ingresa Unidad de Compra"
            fullWidth
            value={newUnidad}
            onChange={(e) => setNewUnidad(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog1} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateUnidad} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Step3Component;
