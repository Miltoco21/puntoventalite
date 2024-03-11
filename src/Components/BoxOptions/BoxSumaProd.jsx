/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext } from "react";
import {
  Paper,
  Grid,
  Button,
  TextField,
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

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import TecladoPLU from "../Teclados/TecladoPLU";
import TecladoPeso from "../Teclados/TecladoPeso";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

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
  const [productInfo, setProductInfo] = useState(null);
  const [plu, setPlu] = useState("");
  const [peso, setPeso] = useState("");
  const [open, setOpen] = useState(false);
  const [openPeso, setOpenPeso] = useState(false);
  const [sliderValue, setSliderValue] = useState(1);
  const [productByCodigo, setProductByCodigo] = useState([]);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

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
        console.log("Respuesta de la API:", response.data);
        console.log("Cantidad registros:", response.data.cantidadRegistros);
        if (response.data.cantidadRegistros > 0) {
          const productoEncontrado = response.data.productos[0];
          addToSalesData(productoEncontrado, quantity);
          setProductByCodigo(productoEncontrado);
        } else {
          console.log("Producto no encontrado.");
          setProductByCodigo(null);
        }
      } catch (error) {
        console.error("Error al buscar el producto:", error);
      }
    }
  };

  const handleDescripcionSearchButtonClick = async () => {
    if (searchTerm.trim() !== "") {
      try {
        const response = await axios.get(
          `https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByDescripcion?descripcion=${searchTerm}`
        );
        console.log("Respuesta de la API:", response.data);
        console.log("Cantidad registros:", response.data.cantidadRegistros);
        if (response.data.cantidadRegistros > 0) {
          setProducts(response.data.productos);
        } else {
          console.log("Producto no encontrado.");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error al buscar el producto por descripción:", error);
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
      setProducts([]); // Si el término de búsqueda está vacío, limpiar la lista de productos
    }
  }, [searchTerm]);

  const handleAddProductToSales = (product) => {
    if (product) {
      addToSalesData(product, quantity); // Agregar el producto seleccionado a salesData con la cantidad actual
      setQuantity(1); // Restablecer la cantidad a 1 después de agregar el producto
    }
  };


  // const handleDescripcionSearchButtonClick = async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByDescripcion?descripcion=${searchTerm}`
  //     );
  //     console.log("Respuesta de la API:", response.data);

  //     console.log("Cantidad registros:", response.data.cantidadRegistros);
  //     if (response.data.cantidadRegistros > 0) {
  //       const productoEncontrado = response.data.productos;
  //        // Agregar el producto con cantidad 1
  //       setProductByCodigo(productoEncontrado); // Actualizar el estado con el producto encontrado
  //     } else {
  //       console.log("Producto no encontrado.");
  //       setProductByCodigo(null); // Limpiar el estado si no se encontró ningún producto
  //     }
  //   } catch (error) {
  //     console.error("Error al buscar el producto por descripción:", error);
  //     // Manejar el error, mostrar un mensaje al usuario, etc.
  //   }
  // };

  // const handleSearchButtonClick = async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByCodigo?idproducto=${searchTerm}`
  //     );
  //     console.log("Respuesta de la API:", response.data);

  //     console.log("CAntidad registros:", response.data.cantidadRegistros);
  //     if (response.data.cantidadRegistros)
  //       setProductByCodigo(response.data.productos[0]);
  //     console.log("productByCodigo:", productByCodigo);
  //     // Corrección aquí
  //   } catch (error) {
  //     console.error("Error al buscar el producto:", error);
  //     // Manejar el error, mostrar un mensaje al usuario, etc.
  //   }
  // };

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
        display: "flex",
        flexDirection: "column",
        maxWidth: "1200px",
        margin: "0 auto",
        justifyContent: "center",
      }}
    >
      <Grid container item xs={12} md={12} lg={16}>
        <Paper
          elevation={15}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "5px",
            margin: "5px",
            marginTop: isMobile ? "-6px" : "0",
            width: "100%",
          }}
        >
          <Grid item xs={12} lg={14} sx={{ minWidth: 200, width: "80%" }}>
  <div style={{ display: "flex" }}>
    <Grid item xs={12} md={6} lg={14}>
      <Autocomplete
        options={searchTerm ? products.filter(product =>
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        ) : products}
        getOptionLabel={(product) => product.nombre}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            focused
            placeholder="Ingresa Código"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
        onChange={(event, newValue) => {
                    setSelectedProduct(newValue);
                    handleAddProductToSales(newValue); // Agregar el producto seleccionado a salesData
                  }}
        style={{ maxWidth: "100%" }}
      />
    </Grid>
    <Button
      size="large"
      variant="outlined"
      onClick={() => {
        handlePluSearchButtonClick();
        handleDescripcionSearchButtonClick();
      }}
    >
      PLU
    </Button>
    <Button size="large" variant="outlined" onClick={handleOpenPeso}>
      Peso
    </Button>
  </div>
</Grid>

        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper
          elevation={14}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "5px",
            marginTop: isMobile ? "-6px" : "0",
          }}
        >
          <TableContainer component={Paper} style={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Eliminar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ maxHeight: "300px", overflowY: "auto" }}>
                {salesData.map((sale, index) => (
                  <TableRow key={index}>
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
                        inputProps={{ min: 0 }}
                        style={{ width: 90 }}
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
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "21px",
                margin: "5px",
              }}
              elevation={21}
            >
              <Typography>Total: {grandTotal}</Typography>
            </Paper>
          </TableContainer>
        </Paper>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>{/* Componente de TecladoPLU */}</DialogContent>
      </Dialog>
      <Dialog open={openPeso} onClose={handleClosePeso}>
        <DialogContent>{/* Componente de TecladoPeso */}</DialogContent>
      </Dialog>
    </Paper>
  );
};

export default BoxSumaProd;
