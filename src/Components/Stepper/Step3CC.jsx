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
  InputAdornment,
} from "@mui/material";

import ModelConfig from "../../Models/ModelConfig";
import { AttachMoney, CheckBox, DraftsOutlined, Money, Percent } from "@mui/icons-material";
import Product from "../../Models/Product";


const Step3CC = ({ 
  data, 
  onNext, 
  onSuccessAdd
}) => {
  const apiUrl =  ModelConfig.get().urlBase;
;

  const [newUnidad, setNewUnidad] = useState("");
  const [stockInicial, setStockInicial] = useState(1);
  const [stockCritico, setStockCritico] = useState(1);
  const [precioCosto, setPrecioCosto] = useState(0);
  const [selectedUnidadId, setSelectedUnidadId] = useState(0);
  const [selectedUnidadVentaId, setSelectedUnidadVentaId] = useState(0);
  
  const [precioVenta, setPrecioVenta] = useState(0);
  const [precioNeto, setPrecioNeto] = useState(0);
  const [ultimoFoco, setUltimoFoco] = useState("");
  const [iva, setIva] = useState(ModelConfig.get().iva)
  const [margenGanancia, setMargenGanancia] = useState(ModelConfig.get().margenGanancia);
  
  const [valorIva, setValorIva] = useState(0)
  const [valorMargenGanancia, setValorMargenGanancia] = useState(0);
  
  const [product, setProduct] = useState([]);


  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [esPesable, setEsPesable] = useState( (data.esPesable == "SI") );
  const [fijarCosto, setFijarCosto] = useState(false);
  const [fijarVenta, setFijarVenta] = useState(false);

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

  var ivas = [
    { idUnidad: 0, descripcion: "Sin iva" },
    { idUnidad: ModelConfig.get().iva, descripcion: ModelConfig.get().iva + "%" }
  ];


  // console.log("data:", data);

  const handleNext = async () => {
    const isValid = validateFields();

    if (!isValid) {
      // Si los campos no son válidos, no continuar
      return;
    }

    setLoading(true);

    // Crear objeto con los datos del paso 1
    const step1Data = {
      codBarra: data.codBarra,
      respuestaSINO:"NO",
      pesoSINO: (esPesable ? "SI" : "NO"),
      marca: data.marca,
      categoriaID: data.categoryId || 0, // Utilizamos 0 si el valor es undefined
      subCategoriaID: data.subCategoryId || 0,
      familiaID: data.familyId || 0,
      subFamilia: data.subFamilyId || 0,
      nombre: data.nombre, // Debes proporcionar un valor adecuado aquí
    };

    // Crear objeto con los datos del paso 3
    const step3Data = {
      unidad: selectedUnidadId, // Debes proporcionar un valor adecuado aquí
      unidadVenta: selectedUnidadVentaId, // Debes proporcionar un valor adecuado aquí
      precioCosto: parseFloat(precioCosto) || 0, // Convertir a número y usar 0 si no hay valor
      stockInicial: parseInt(stockInicial) || 0, // Convertir a número entero y usar 0 si no hay valor
    };

    // Crear objeto con los datos del paso 4
    const step4Data = {
      formatoVenta: 0, // Debes proporcionar un valor adecuado aquí
      precioVenta: parseFloat(precioVenta) || 0, // Convertir a número y usar 0 si no hay valor
      precioNeto: parseFloat(precioNeto) || 0, // Convertir a número y usar 0 si no hay valor
      margen: parseFloat(margenGanancia)
    };

    // Combinar todos los pasos en un solo objeto
    const requestData = {
      name: "", // Debes proporcionar un valor adecuado aquí
      step1: step1Data,
      step2: {
        bodega: "", // Debes proporcionar un valor adecuado aquí
        proveedor: "", // Debes proporcionar un valor adecuado aquí
      },
      step3: step3Data,
      step4: step4Data,
      step5: {
        stockCritico: parseInt(stockCritico), // Debes proporcionar un valor adecuado aquí
        impuesto: (iva == 0 ? "EXENTO" : "IVA " + iva + "%"), // Debes proporcionar un valor adecuado aquí
        selectedFile: {}, // Debes proporcionar un valor adecuado aquí
        nota: "", // Debes proporcionar un valor adecuado aquí
      
      },
    };

    const prodNuevo = {
      ...requestData.step1,
      ...requestData.step2,
      ...requestData.step3,
      ...requestData.step4,
      ...requestData.step5,
    }
    



    console.log("Datos objeto productos", requestData);
    try {
      // Enviar la petición POST al endpoint con los datos combinados
      const response = await axios.post(
        `${apiUrl}/ProductosTmp/AddProducto`,
        requestData
      );

      // Manejar la respuesta de la API
      console.log("Response PROD GAURDADO:", response.data);
      if (response.status === 201) {
        setEmptyFieldsMessage("Producto guardado exitosamente");
        setOpenSnackbar(true);

        prodNuevo.idProducto = prodNuevo.codBarra
        prodNuevo.codigoProducto = prodNuevo.codBarra
        prodNuevo.codigoProductoInterno = response.data.codigoProducto
        onSuccessAdd(prodNuevo,response)
        console.log("Productos",product)
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
 
  const handleUnidadSelect = (selectedUnidadId) => {
    setSelectedUnidadId(selectedUnidadId === "" ? 0 : selectedUnidadId);
    console.log("Unidad seleccionada:", selectedUnidadId);
  };

  const handleUnidadVentaSelect = (selectedUnidadId) => {
    setSelectedUnidadVentaId(selectedUnidadId === "" ? 0 : selectedUnidadId);
    console.log("Unidad seleccionada:", selectedUnidadId);
  };


  const handleIvaSelect = (selectedUnidadId) => {
    setIva(selectedUnidadId === "" ? 0 : selectedUnidadId);
    console.log("Unidad seleccionada:", selectedUnidadId);
  };


  const validateFields = () => {
    // Verificar si todos los campos están vacíos

    // Verificar cada campo individualmente y mostrar el primer campo vacío
    if (selectedUnidadId === "") {
      setEmptyFieldsMessage("Debe seleccionar una unidad de compra.");
      return false;
    }

    if (selectedUnidadVentaId === "") {
      setEmptyFieldsMessage("Debe seleccionar una unidad de venta.");
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
      setEmptyFieldsMessage(
        "El precio de venta debe ser al menos igual al precio de costo."
      );
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

    if (stockCritico === "") {
      setEmptyFieldsMessage("Favor completar Stock critico.");
      return false;
    }
    if (isNaN(parseFloat(stockCritico)) || parseFloat(stockCritico) === 0) {
      setEmptyFieldsMessage("El stock critico no puede ser cero.");
      return false;
    }

    // Si todos los campos están completos, limpiar el mensaje de error
    setEmptyFieldsMessage("");
    return true;
  };

  const handleKeyDown = (event, field) => {
    // Verificar en qué campo se está escribiendo
    if (field === "precio") {
      // Permitir solo dígitos numéricos y la tecla de retroceso
      if (!/^\d+$/.test(event.key) && event.key !== "Backspace") {
        event.preventDefault();
      }
    }
  };

  const logicaPrecios = ()=>{
    console.log("logicaPrecios")
    if(ultimoFoco != "precioVenta" &&  precioCosto > 0){

      if(fijarVenta || fijarCosto){
        const tmpProduct = {}
        tmpProduct.ivaPorcentaje = iva
        tmpProduct.precioVenta = parseFloat(precioVenta)
        tmpProduct.precioCosto = parseFloat(precioCosto)

        Product.calcularMargen(tmpProduct)
        setValorIva(tmpProduct.ivaValor.toFixed(0))
        setPrecioNeto(tmpProduct.precioNeto.toFixed(0))
        setValorMargenGanancia(tmpProduct.gananciaValor.toFixed(0))
        setMargenGanancia((tmpProduct.gananciaPorcentaje).toFixed(0))
        return
      }

      const tmpProduct = {}
      tmpProduct.precioVenta = 0
      tmpProduct.precioCosto = precioCosto
      tmpProduct.gananciaPorcentaje = margenGanancia
      tmpProduct.ivaPorcentaje = iva
      tmpProduct.gananciaValor = 0
      tmpProduct.ivaValor = 0
      tmpProduct.precioNeto = 0
      
      Product.logicaPrecios(tmpProduct)
      
      setPrecioNeto(tmpProduct.precioNeto.toFixed(0))
      setPrecioVenta(tmpProduct.precioVenta.toFixed(0))
      
      setValorIva(tmpProduct.ivaValor.toFixed(0))
      setValorMargenGanancia(tmpProduct.gananciaValor.toFixed(0))
    }else if(ultimoFoco != "precioCosto" && precioVenta>0){

      if(fijarVenta || fijarCosto){
        const tmpProduct = {}
        tmpProduct.ivaPorcentaje = iva
        tmpProduct.precioVenta = parseFloat(precioVenta)
        tmpProduct.precioCosto = parseFloat(precioCosto)

        Product.calcularMargen(tmpProduct)
        setValorIva(tmpProduct.ivaValor.toFixed(0))
        setPrecioNeto(tmpProduct.precioNeto.toFixed(0))
        setValorMargenGanancia(tmpProduct.gananciaValor.toFixed(0))
        setMargenGanancia((tmpProduct.gananciaPorcentaje).toFixed(0))
        return
      }

      const tmpProduct = {}
      tmpProduct.precioVenta = precioVenta
      tmpProduct.precioCosto = 0
      tmpProduct.gananciaPorcentaje = margenGanancia
      tmpProduct.ivaPorcentaje = iva
      tmpProduct.gananciaValor = 0
      tmpProduct.ivaValor = 0
      tmpProduct.precioNeto = 0

      Product.logicaPrecios(tmpProduct, "costo")


      setPrecioNeto(tmpProduct.precioNeto.toFixed(0))
      setPrecioCosto(tmpProduct.precioCosto.toFixed(0))
      
      setValorIva(tmpProduct.ivaValor.toFixed(0))
      setValorMargenGanancia(tmpProduct.gananciaValor.toFixed(0))
    }

  }
  const setFocus = (field) => {
    setUltimoFoco(field)
  }


  const handleChange = (event, field) => {
    // Asegurar que el valor solo contenga números
    // Eliminar caracteres especiales específicos
    const newValue = event.target.value.replace(/[^0000000-9]/g, 0);
    // console.log("handleChange de " + field)
    // console.log("newValue")
    // console.log(newValue)
    if (field === "precioCosto") {
      setPrecioCosto(newValue);
    } else if (field === "precioVenta") {
      setPrecioVenta(newValue);
    } else if (field === "stockInicial") {
      setStockInicial(newValue);
    }else if (field === "stockCritico") {
      setStockCritico(newValue);
    } else if (field === "precioNeto") {
      // setPrecioNeto(newValue);
    } else if (field === "margenGanancia") {
      setMargenGanancia(newValue);
    }
  };

  useEffect(()=>{
    logicaPrecios()
  },[precioCosto, precioVenta, margenGanancia, iva])


  useEffect(()=>{
    console.log("cambio unidad de venta")
    console.log(selectedUnidadVentaId)
    if(selectedUnidadVentaId == 1 || selectedUnidadVentaId == 5){
      setEsPesable(true)
    }else{
      setEsPesable(false)
    }
  },[selectedUnidadVentaId])




  const checkEsPesable = (e)=>{
    setEsPesable(!esPesable)
  }

  const checkFijarCosto = (e)=>{
    if(!fijarCosto && fijarVenta){
      setFijarVenta(false)
    }
    setFijarCosto(!fijarCosto)
  }

  const checkFijarVenta = (e)=>{
    if(!fijarVenta && fijarCosto){
      setFijarCosto(false)
    }
    setFijarVenta(!fijarVenta)
  }

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
                label="Seleccionar Unidad"
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
            <InputLabel sx={{ marginBottom: "2%" }}>
              Unidad de venta
            </InputLabel>
            <Grid display="flex" alignItems="center">
              <Select
                required
                fullWidth
                sx={{ width: "100%" }}
                value={selectedUnidadVentaId}
                onChange={(e) => handleUnidadVentaSelect(e.target.value)}
                label="Seleccionar Unidad"
              >
                {unidades.map((unidad) => (
                  <MenuItem key={unidad.idUnidad} value={unidad.idUnidad}>
                    {unidad.descripcion}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>


          <Grid item xs={12} md={12}>
            <Grid display="flex" alignItems="center">
              <label onClick={checkEsPesable}
               style={{
                userSelect:"none"
               }}>
                Es Pesable
                </label>
              <input
                type="checkbox"
                checked={esPesable}
                onClick={checkEsPesable}
                onChange={()=>{}}
                style={{
                  width:"50px",
                  height:"20px"
                }}
                />
              </Grid>
            </Grid>

          <Grid item xs={12} md={6}>
            <Box>
                <InputLabel sx={{ marginBottom: "4%" }}>
              Margen ganancia
              </InputLabel>

            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <TextField
                icon
                  required
                  name="margenGanancia"
                  fullWidth
                  value={margenGanancia}
                  onClick={()=>{ setFocus("margenGanancia") }}
                  onChange={(event) => handleChange(event, "margenGanancia")}
                  onKeyDown={(event) => handleKeyDown(event, "margenGanancia")}
                  InputProps={{
                    inputMode: "numeric", // Establece el modo de entrada como numérico
                    pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
                    startAdornment: (
                      <InputAdornment position="start">
                        <Percent />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  value={valorMargenGanancia}
                  InputProps={{
                    inputMode: "numeric", // Establece el modo de entrada como numérico
                    pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
            <InputLabel sx={{ marginBottom: "4%" }}>
               iva
              </InputLabel>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
              <Select
                required
                fullWidth
                sx={{ width: "100%" }}
                value={iva}
                onClick={()=>{ setFocus("iva") }}
                onChange={(e) => handleIvaSelect(e.target.value)}
                label="Seleccionar iva"
              >
                {ivas.map((ivaItem) => (
                  <MenuItem key={ivaItem.idUnidad} value={ivaItem.idUnidad}>
                    {ivaItem.descripcion}
                  </MenuItem>
                ))}
              </Select>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  value={valorIva}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>


            </Box>
          </Grid>

          
          <Grid item xs={8} sm={8} md={3} lg={3}>
            <Box>
              <TextField
                required
                sx={{ width: "100%" }}
                label="Precio Costo"
                name="precioCosto"
                type="number"
                fullWidth
                value={precioCosto}
                onChange={(event) => handleChange(event, "precioCosto")}
                onKeyDown={(event) => handleKeyDown(event, "precioCosto")}
                onClick={()=>{ setFocus("precioCosto") }}

                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney />
                    </InputAdornment>
                  ),
                }}
              />

            </Box>
          </Grid>
          <Grid item xs={4} sm={4} md={1} lg={1}>
            <Box>
              
              <input 
                type="checkbox"
                checked={fijarCosto}
                onChange={()=>{}}
                onClick={checkFijarCosto}
                style={{
                  marginTop:"15px",
                  width:"30px",
                  height:"20px"
                }}
                />
            </Box>
            </Grid>

          <Grid item xs={12} md={4}>
            <Box>
              <TextField
                required
                sx={{
                  width: "100%",
                }}
                label="Precio Venta Neto"
                fullWidth
                disabled={true}
                value={precioNeto}
                onChange={(event) => handleChange(event, "precioNeto")}
                onKeyDown={(event) => handleKeyDown(event, "precioNeto")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={8} sm={8} md={3} lg={3}>
            <Box>
              <TextField
                required
                sx={{
                  width: "100%",
                }}
                label="Precio Venta publico"
                fullWidth
                type="number"
                value={precioVenta}
                onClick={()=>{ setFocus("precioVenta") }}
                onChange={(event) => handleChange(event, "precioVenta")}
                onKeyDown={(event) => handleKeyDown(event, "precioVenta")}
                InputProps={{
                  inputMode: "numeric", // Establece el modo de entrada como numérico
                  pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={4} sm={4} md={1} lg={1}>
            <Box>
              
              <input 
                type="checkbox"
                checked={fijarVenta}
                onChange={()=>{}}
                onClick={checkFijarVenta}
                style={{
                  marginTop:"15px",
                  width:"30px",
                  height:"20px"
                }}
                />
            </Box>
            </Grid>

          

          <Grid item xs={12} md={6}>
            <Box>
              <TextField
                required
                sx={{ width: "100%" }}
                label="Stock Actual"
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

          <Grid item xs={12} md={6}>
            <Box>
              <TextField
                required
                sx={{ width: "100%" }}
                label="Stock critico"
                fullWidth
                value={stockCritico}
                onChange={(event) => handleChange(event, "stockCritico")}
                onKeyDown={(event) => handleKeyDown(event, "stockCritico")}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button
              // fullWidth
              variant="contained"
              color="secondary"
              onClick={handleNext}
              disabled={loading}

              sx={{
                width:"50%",
                height:"55px",
                margin: "0 25%"
              }}
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
    </Paper>
  );
};

export default Step3CC;
