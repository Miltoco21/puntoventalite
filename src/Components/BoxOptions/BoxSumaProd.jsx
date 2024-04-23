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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import axios from "axios";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

import { KeyboardDoubleArrowUp, Visibility, VisibilityOff } from "@mui/icons-material";

import RemoveIcon from "@mui/icons-material/Remove";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const BoxSumaProd = ({ venta }) => {
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
    setSearchedProducts
    
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
          `https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByCodigo?idproducto=${searchTerm}&codigoCliente=${codigoCliente}`
        );
        handleSearchSuccess(response, "PLU");
      } else {
        // Realizar la búsqueda por descripción
        const response = await axios.get(
          `https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByDescripcion?descripcion=${searchTerm}&codigoCliente=${codigoCliente}`
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

  const handleAddSelectedProduct = (product) => {
    addToSalesData(product, quantity);
    setSearchedProducts([]); // Limpiar los productos buscados después de agregar uno
  };

  // const handleAddProductToSales = (product) => {
  //   if (product) {
  //     addToSalesData(product, quantity); // Agregar el producto seleccionado a salesData con la cantidad actual
  //     setQuantity(1); // Restablecer la cantidad a 1 después de agregar el producto
  //   }
  // };

  const handleClearSalesData = () => clearSalesData();

  return (
    <Paper
      elevation={13}
      sx={{
        background: "#859398",
        display: "flex",
        flexDirection: "column",
        maxWidth: "1200px",
        margin: "0 auto",
        justifyContent: "center",
      }}
    >
      <Grid container item xs={12} md={12} lg={12}>
        <Paper
          elevation={13}
          sx={{
            background: "#859398",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "5px",
            margin: "5px",

            width: "100%",
          }}
        >
          <Grid item xs={12} lg={12} sx={{ minWidth: 200, width: "90%" }}>
            <div style={{ display: "flex" }}>
              <Grid item xs={12} md={12} lg={12} sx={{ margin: "1px" }}>
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
                size="large"
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
                severity="info"
                sx={{ width: "100%" }}
              >
                {errorMessage}
              </Alert>
            </Snackbar>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper elevation={1} sx={{ background: "#859398", margin: "5px" }}>
          <IconButton onClick={toggleVisibility}>
            {isVisible ? <KeyboardDoubleArrowUp/> : <KeyboardDoubleArrowDownIcon />}
          </IconButton>
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
                      <TableCell>{product.nombre}</TableCell>
                      <TableCell sx={{ width: "21%" }}>
                        Plu:{""}
                        {product.idProducto}
                      </TableCell>

                      <TableCell>
                        <Button
                          onClick={() => handleAddSelectedProduct(product)}
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
                  <TableRow key={index} sx={{ height: "33px" }}>
                    <TableCell sx={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        value={sale.quantity === 0 ? "" : sale.quantity}
                        onChange={(event) => {
                          const newValue = parseInt(event.target.value);
                          const updatedSalesData = [...salesData];
                          updatedSalesData[index].quantity = isNaN(newValue)
                            ? 0
                            : newValue;
                          setSalesData(updatedSalesData);
                        }}
                        style={{ width: 70 }}
                        inputProps={{
                          inputMode: "numeric", // Establece el modo de entrada como numérico
                          pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
                        }}
                      />
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
              <Typography>Total: {grandTotal}</Typography>
            </Paper>
          </TableContainer>
        </Paper>
      </Grid>
    </Paper>
  );
};

export default BoxSumaProd;
