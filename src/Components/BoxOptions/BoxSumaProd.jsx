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
import { useMediaQuery } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import TecladoPLU from "../Teclados/TecladoPLU";
import TecladoPeso from "../Teclados/TecladoPeso";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import { AlignVerticalBottomOutlined } from "@mui/icons-material";

const BoxSumaProd = ({ venta }) => {
  const {
    salesData,
    setSalesData,
    grandTotal,
    addToSalesData,
    removeFromSalesData,
    incrementQuantity,
    decrementQuantity,
    quantity,
    setQuantity,
    clearSalesData,
  } = useContext(SelectedOptionsContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const handlePluSearchButtonClick = async () => {
    if (searchTerm.trim() !== "") {
      try {
        const response = await axios.get(
          `https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByCodigo?idproducto=${searchTerm}`
        );
        console.log("Respuesta de la IdBYCODIGO:", response.data);
        console.log("Cantidad registros:", response.data.cantidadRegistros);
        if (response.data.cantidadRegistros > 0) {
          const productoEncontrado = response.data.productos[0];
          addToSalesData(productoEncontrado, quantity);
          setProductByCodigo(productoEncontrado);
          setSearchTerm("");
          setOpenSnackbar(true);
          setSnackbarMessage("Producto agregado");

          setTimeout(() => {
            setOpenSnackbar(false); ////Cierre Modal al finalizar
          }, 1000);
        }
        if (response.data.cantidadRegistros === 0) {
          setOpenSnackbar(true);
          setSnackbarMessage("Producto No encontrado");

          setTimeout(() => {
            setOpenSnackbar(false); ////Cierre Modal al finalizar
          }, 1000);
        } else {
          console.log("Producto no encontrado.");
          setProductByCodigo(null);
        }
      } catch (error) {
        console.error("Error al buscar el producto:", error);

        setErrorMessage("");
      }
    }
  };

  const handleDescripcionSearchButtonClick = async () => {
    if (searchTerm.trim() !== "") {
      try {
        const response = await axios.get(
          `https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByDescripcion?descripcion=${searchTerm}`
        );
        console.log("Respuesta deScrpcion:", response.data);
        console.log("Cantidad registros:", response.data.cantidadRegistros);
        if (response.data.cantidadRegistros > 0) {
          setProducts(response.data.productos);
        } else {
          console.log("Producto no encontrado.");
          setProducts([]);
          setErrorMessage("Descripción o producto no encontrado");
        }
      } catch (error) {
        console.error("Error al buscar el producto por descripción:", error);
        setErrorMessage("Error al buscar el producto por descripción");
      }
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByDescripcion?descripcion=${searchTerm}`
        );
        setProducts(response.data.productos);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (searchTerm.trim() !== "") {
      fetchProducts();
    } else {
      setProducts(0); // Si el término de búsqueda está vacío, limpiar la lista de productos
    }
  }, [searchTerm]);

  const handleAddProductToSales = (product) => {
    if (product) {
      addToSalesData(product, quantity); // Agregar el producto seleccionado a salesData con la cantidad actual
      setQuantity(1); // Restablecer la cantidad a 1 después de agregar el producto
    }
  };

  const handlePesoSubmit = (pesoValue) => {
    setPeso(pesoValue);
    handleClose();
    if (productInfo) {
      addToSalesData(productInfo, quantity); // Utiliza la cantidad del estado
      setQuantity(1); // Restablece la cantidad a 1 después de agregar el producto
    }
  };
  const handleQuantityInputChange = (event) => {
    setQuantity(event.target.value);
  };

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
                onClick={() => {
                  handlePluSearchButtonClick();
                  handleDescripcionSearchButtonClick();
                }}
              >
                PLU
              </Button>
              {/* <Button
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
                onClick={handleOpenPeso}
              >
                Peso
              </Button> */}
            </div>
            <Snackbar
              open={openSnackbar}
              // onClose={handleCloseSnackbar}
              message={snackbarMessage}
              autoHideDuration={1000}
            />
            {searchTerm.trim() !== "" &&
              searchTerm.length > 4 &&
              errorMessage && (
                <Typography variant="body4" color="error">
                  {errorMessage}
                </Typography>
              )}
          </Grid>
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
          <TableContainer
            component={Paper}
            style={{ overflowX: "auto", maxHeight: "200px" }}
          >
            <Table>
              <TableHead sx={{ background: "white", height: "30%" }}>
                <TableBody style={{ maxHeight: "100px", overflowY: "auto" }}>
                  {searchTerm.trim() !== "" && products.length > 0 ? (
                    products.map((product) => (
                      <TableRow key={product.id} sx={{ height: "15%" }}>
                        <TableCell>{product.nombre}</TableCell>
                        <TableCell sx={{ width: "21%" }}>
                          Plu:{""}
                          {product.idProducto}
                        </TableCell>
                        <TableCell sx={{ width: "21%" }}>
                          <Button
                            onClick={() => {
                              addToSalesData(product);
                              setProducts([]); // Cerrar la búsqueda después de agregar el producto
                            }}
                            variant="contained"
                            color="secondary"
                          >
                            Agregar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : searchTerm.trim() !== "" &&
                    searchTerm.length < 2 &&
                    !isNaN(searchTerm) ? (
                    <TableRow>
                      <TableCell colSpan={1}>
                        <Typography variant="body4" color="error">
                          {errorMessage}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </TableHead>
            </Table>
          </TableContainer>
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
