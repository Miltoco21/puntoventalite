/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Paper,
  Grid,
  Button,
  TextField,
  Alert,
  Snackbar,
  IconButton,
  Table,
  Autocomplete,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Popper,
  Grow,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Slider,
  Dialog,
  DialogContent,
  InputLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import axios from "axios";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

import {
  KeyboardDoubleArrowUp,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import RemoveIcon from "@mui/icons-material/Remove";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const BoxSumaProd = ({ venta }) => {

  const apiUrl = import.meta.env.VITE_URL_API2;
  const {
    salesData,
    selectedUser,
    setSelectedUser,
    selectedCodigoCliente,
    setSelectedCodigoCliente,
    selectedCodigoClienteSucursal,

    setSalesData,
    grandTotal,
    addToSalesData,
    removeFromSalesData,
    incrementQuantity,
    decrementQuantity,
    quantity,
    setQuantity,
    clearSalesData,
    searchedProducts,
    setSearchedProducts,
  } = useContext(SelectedOptionsContext);

  const theme = useTheme();
  const codigoCliente = selectedCodigoCliente ? selectedCodigoCliente : 0;

  const [searchTerm, setSearchTerm] = useState("");

  const inputRef = useRef(null);
  const [productInfo, setProductInfo] = useState(null);
  const [plu, setPlu] = useState("");
  const [peso, setPeso] = useState("");
  const [open, setOpen] = useState(false);
  const [openPeso, setOpenPeso] = useState(false);
  const [sliderValue, setSliderValue] = useState(1);
  const [productByCodigo, setProductByCodigo] = useState([]);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [isVisible, setIsVisible] = useState(true);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const calculateTotalPrice = (quantity, price) => quantity * price;

  const handlePluSubmit = (productInfo) => {
    setPlu(productInfo.idProducto);
    handleClose();
    if (productInfo) {
      addToSalesData(productInfo, quantity); // Utiliza la cantidad del estado
      setQuantity(1); // Restablece la cantidad a 1 después de agregar el producto
    }
  };

  const handleOpen = () => setOpen(true);
  const handleOpenPeso = () => setOpenPeso(true);
  const handleClose = () => setOpen(false);
  const handleClosePeso = () => setOpenPeso(false);

  const handleSearchButtonClick = async () => {
    if (searchTerm.trim() === "") {
      setErrorMessage("El campo de búsqueda está vacío");
      setSearchedProducts([]);
      setOpenSnackbar(true);
      return; // Salimos de la función ya que no hay necesidad de realizar la búsqueda si está vacío
    }
    // Determinar si el término de búsqueda es numérico
    const isNumeric = !isNaN(parseFloat(searchTerm)) && isFinite(searchTerm);

    try {
      if (isNumeric) {
        // Realizar la búsqueda por PLU
        const response = await axios.get(
          `${import.meta.env.VITE_URL_API2}/ProductosTmp/GetProductosByCodigo?idproducto=${searchTerm}&codigoCliente=${codigoCliente}`
        );
        handleSearchSuccess(response, "PLU");
      } else {
        // Realizar la búsqueda por descripción
        const response = await axios.get(
          `${import.meta.env.VITE_URL_API2}/ProductosTmp/GetProductosByDescripcion?descripcion=${searchTerm}&codigoCliente=${codigoCliente}`
        );
        handleSearchSuccess(response, "Descripción");
      }
    } catch (error) {
      console.error("Error al buscar el producto:", error);
      setErrorMessage("Error al buscar el producto");
      setOpenSnackbar(true);
      setSnackbarMessage("Error al buscar el producto");
      setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
    }
  };

  const handleSearchSuccess = (response, searchType) => {
    if (response.data && response.data.cantidadRegistros > 0) {
      setSearchedProducts(response.data.productos);
      console.log("Productos encontrados",response.data.productos)
      setSearchTerm("");
      setOpenSnackbar(true);
      setErrorMessage(`Productos encontrados (${searchType})`);
      setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
    } else if (response.data && response.data.cantidadRegistros === 0) {
      setErrorMessage(`No se encontraron resultados (${searchType})`);
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
    } else {
      setErrorMessage(`Error al buscar el producto (${searchType})`);
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
    }
  };

  // const handleAddSelectedProduct = (product) => {
  //   addToSalesData(product);
  //   setSearchedProducts([]); // Limpiar los productos buscados después de agregar uno
  // };

  const handleAddProductToSales = (product,quantity) => {
    console.log("Productos agregados", product);
    if (product) {
      // Agregar el producto seleccionado a salesData con la cantidad 1
      addToSalesData(product, quantity);
      // Restablecer la cantidad a 1 después de agregar el producto
      
    }
    setSearchedProducts([]);
  };

  const handleClearSalesData = () => clearSalesData();
  const handleKeyDown = (event, field) => {
    // Verificar en qué campo se está escribiendo
    if (
      field === "cantidad" 
  
    ) {
      // Permitir solo dígitos numéricos y la tecla de retroceso
      // Excluir caracteres no numéricos y caracteres especiales específicos
      if (
        !/[0-9]/.test(event.key) &&
        event.key !== "Backspace" &&
        !/[`´']/.test(event.key)
      ) {
        event.preventDefault();
      }
    }
  };

  const handleQuantityChange = (event, index) => {
    const newValue = event.target.value;
    const updatedSalesData = [...salesData];
    updatedSalesData[index].quantity = newValue === "" ? 0 : parseInt(newValue);
    setSalesData(updatedSalesData);
  };

  return (
    <Grid container item xs={12} md={12} lg={12}>
      <Paper
        elevation={13}
        sx={{
          background: "#859398",

          width: "100%",
          margin: 1,

          justifyContent: "center",
        }}
      >
        <Grid container item xs={12} md={12} lg={12}>
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            sx={{ minWidth: 200, width: "100%", background: "#859398" }}
          >
            <div style={{ alignItems: "center" }}>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                sx={{ display: "flex", margin: 1 }}
              >
                <InputLabel
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    margin: 1,
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  Buscador de productos
                </InputLabel>
              </Grid>
              {/* ///PLU */}
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                sx={{
                  margin: 1,
                  display: "flex",
                  justifyContent: { xs: "flex-start", md: "flex-end" },
                }}
              >
                <TextField
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "5px",
                  }}
                  inputRef={inputRef}
                  fullWidth
                  focused
                  placeholder="Ingresa Código"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  sx={{
                    margin: "1px",
                    backgroundColor: " #283048",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1c1b17 ",
                      color: "white",
                    },
                  }}
                  onClick={handleSearchButtonClick}
                >
                  PLU
                </Button>
              </Grid>
            </div>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={() => setOpenSnackbar(false)}
            >
              <Alert
                onClose={() => setOpenSnackbar(false)}
                severity="success"
                sx={{ width: "100%" }}
              >
                {errorMessage}
              </Alert>
            </Snackbar>
          </Grid>

          {/* <Grid item xs={12} lg={12} sx={{ minWidth: 200, width: "90%" }}>
            <div style={{ display: "flex" }}>
           
              <Grid item xs={12} md={12} lg={12} sx={{ margin: "1px" }}>
              <InputLabel
              sx={{
                display: "flex",
                alignItems: "center",
                margin: 1,
               // Cambiar el color del texto a azul
                fontSize: "1.2rem", // Cambiar el tamaño del texto
                fontWeight: "bold", // Hacer el texto en negrita
                // Puedes agregar más estilos aquí según tus necesidades
              }}
            >
              Buscador de productos
            </InputLabel>
                <TextField
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "5px",
                  }}
                  inputRef={inputRef}
                  fullWidth
                  focused
                  placeholder="Ingresa Código"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>
              <Button
                sx={{
                 
                  margin: "1px",
                  backgroundColor: " #283048",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1c1b17 ",
                    color: "white",
                  },
                }}
                
                onClick={handleSearchButtonClick}
              >
                PLU
              </Button>
            </div>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={() => setOpenSnackbar(false)}
            >
              <Alert
                onClose={() => setOpenSnackbar(false)}
                severity="success"
                sx={{ width: "100%" }}
              >
                {errorMessage}
              </Alert>
            </Snackbar>
          </Grid> */}
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={1} sx={{ background: "#859398", margin: 1 }}>
            {/* <IconButton onClick={toggleVisibility}>
            {isVisible ? <KeyboardDoubleArrowUp/> : <KeyboardDoubleArrowDownIcon />}
          </IconButton> */}
            {isVisible && (
              <TableContainer
                component={Paper}
                style={{ overflowX: "auto", maxHeight: 200 }}
              >
                <Table>
                  {/* <TableHead sx={{ background: "#859398", height: "30%" }}>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>PLU</TableCell>
                  <TableCell>Agregar</TableCell>
                </TableRow>
              </TableHead> */}
                  <TableBody>
                    {searchedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell sx={{ width: "21%" }}> {product.nombre}</TableCell>
                        <TableCell sx={{ width: "21%" }}>
                          Plu:{""}
                          {product.idProducto}
                      
                        </TableCell>
                        <TableCell sx={{ width: "21%" }}>  Precio:
                          {product.precioVenta}</TableCell>

                        <TableCell>
                          <Button
                           
                          onClick={() =>  handleAddProductToSales(product)}
                            variant="contained"
                            color="secondary"
                          >
                            Agregar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            elevation={1}
            sx={{
              background: "#859398",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              margin: "5px",
            }}
          >
            <TableContainer component={Paper} style={{ overflowX: "auto" }}>
              <Table>
                <TableHead sx={{ background: "#859398", height: "30%" }}>
                  <TableRow>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Eliminar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {salesData.map((sale, index) => (
                    <TableRow key={index} sx={{ height: "20%" }}>
                      <TableCell sx={{ display: "flex", alignItems: "center" }}>
                      <TextField
                          name="cantidad"
                          onKeyDown={(event) => handleKeyDown(event, "cantidad")}
                          value={sale.quantity === 0 ? "" : sale.quantity}
                          onChange={(event) => handleQuantityChange(event, index)}

                          style={{ width: 84 }}
                          inputProps={{
                            inputMode: "numeric", // Establece el modo de entrada como numérico
                            pattern: "[0-9]*",
                            maxLength: 6, // Asegura que solo se puedan ingresar números
                          }}
                        />
                        {/* <TextField
                        name="precio"
                       onKeyDown={(event) => handleKeyDown(event, "precio")}
                        value={sale.quantity === 0 ? "" : sale.quantity}
                        onChange={(event) => {
                          const newValue = parseInt(event.target.value);
                          const updatedSalesData = [...salesData];
                          updatedSalesData[index].quantity = isNaN(newValue)
                            ? 0
                            : newValue;
                          setSalesData(updatedSalesData);
                        }}
                        style={{ width: 84 }}
                        inputProps={{
                          inputMode: "numeric", // Establece el modo de entrada como numérico
                          pattern: "[0-9]*",
                          maxLength: 6, // Asegura que solo se puedan ingresar números
                        }}
                      /> */}
                      </TableCell>
                      <TableCell>{sale.descripcion}</TableCell>
                      <TableCell>{sale.precio}</TableCell>
                      <TableCell>
                        {calculateTotalPrice(sale.quantity, sale.precio)}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => removeFromSalesData(index)}
                          color="secondary"
                        >
                          <RemoveIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Paper
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "21px",
                  margin: "5px",
                }}
                elevation={18}
              >
                <Typography>
                  Total: {grandTotal.toLocaleString("es-ES")}
                </Typography>
              </Paper>
            </TableContainer>
          </Paper>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default BoxSumaProd;
