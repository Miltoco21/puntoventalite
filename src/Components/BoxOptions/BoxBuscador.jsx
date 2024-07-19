import React, { useState, useEffect, useContext } from "react";
import {
  Paper,
  Grid,
  Button,
  TextField,
  ListItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Container,
  TableHead,
  TableRow,
  InputLabel,
  Chip,
  Typography,
  Snackbar,
  Alert,
  Slider,
  Dialog,
  DialogContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BoxSumaProd from "./BoxSumaProd";
import BoxPreciosClientes from "./BoxPreciosClientes";
import axios from "axios";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import { Visibility } from "@mui/icons-material";
import BoxCtaCorriente from "./BoxCtaCorriente";

const BoxBuscador = (handleClosePreciosClientes) => {
  const apiUrl = import.meta.env.VITE_URL_API2;
  const {
    salesData,
    addToSalesData,
    setPrecioData,
    ventaData,
    setVentaData,
    searchResults,
    setSearchResults,
    updateSearchResults,
    selectedUser,
    setSelectedUser,
    clearSalesData,
    selectedCodigoCliente,
    setSelectedCodigoCliente,
    selectedCodigoClienteSucursal,
    setSelectedCodigoClienteSucursal,
    selectedChipIndex,
    setSelectedChipIndex,
    searchText,
    setSearchText,
  } = useContext(SelectedOptionsContext);

  const [ultimaVenta, setUltimaVenta] = useState(null); // Estado para los datos de la última venta
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  useEffect(() => {
    // Cuando se realiza una búsqueda vacía o se borran los términos de búsqueda,
    // ocultar los componentes de precios y cta corriente
    if (searchText.trim() === "" || searchResults.length === 0) {
    }
  }, [searchText, searchResults]);

  useEffect(() => {
    if (searchResults.length === 0) {
      // Si no hay usuario seleccionado, limpiar los datos relacionados
      clearSalesData();
      setSelectedChipIndex([]);
      setSelectedUser([]);
      // Limpiar el índice del chip seleccionado
    }
  }, [searchResults]);

  const handleChipClick = (index, result) => {
    if (
      selectedUser &&
      selectedUser.codigoCliente === result.codigoCliente &&
      selectedUser.codigoClienteSucursal === result.codigoClienteSucursal
    ) {
      clearSalesData(); // Limpia los datos de ventas
      setSelectedUser([]); // Desmarca el usuario seleccionado
      setSelectedChipIndex([]); // Limpia el índice del chip seleccionado
      setSearchResults([]); // Limpia los resultados de búsqueda
      setSelectedCodigoCliente(0); // Establece el código de cliente seleccionado como 0
      handleOpenPreciosClientesDialog(0, 0); // Limpia los datos del diálogo de precios
      handleOpenDeudasClientesDialog(0, 0); // Limpia los datos del diálogo de deudas
    } else {
      setSelectedUser(result); // Establece el usuario seleccionado como el resultado actual
      setSelectedChipIndex(index); // Establece el índice del chip seleccionado
      handleUltimaCompraCliente(
        // Realiza acciones relacionadas con la última compra del cliente
        result.codigoCliente,
        result.codigoClienteSucursal
      );
      handleOpenPreciosClientesDialog(
        // Abre el diálogo de precios para el cliente seleccionado
        result.codigoCliente,
        result.codigoClienteSucursal
      );
      handleOpenDeudasClientesDialog(
        // Abre el diálogo de deudas para el cliente seleccionado
        result.codigoCliente,
        result.codigoClienteSucursal
      );
      clearSalesData(); // Limpia los datos de ventas
    }
  };

  const handleSearch = async () => {
    // Verificar si el campo de búsqueda está vacío
    if (searchText.trim() === "") {
      // Si está vacío, configurar el mensaje del Snackbar y mostrarlo
      setSnackbarMessage("El campo de búsqueda está vacío");
      setSnackbarOpen(true);
      return; // Salir de la función si el campo de búsqueda está vacío
    }

    try {
      clearSalesData();
      setSelectedUser(null);
      setSelectedChipIndex([]);
      setSearchResults([]);
      setSelectedCodigoCliente(0);
      handleOpenPreciosClientesDialog(0, 0);
      handleOpenDeudasClientesDialog(0, 0);

      const response = await axios.get(
        `${import.meta.env.VITE_URL_API2}/Clientes/GetClientesByNombreApellido?nombreApellido=${searchText}`
      );
      if (
        Array.isArray(response.data.clienteSucursal) &&
        response.data.clienteSucursal.length > 0
      ) {
        setSearchResults(response.data.clienteSucursal);
        updateSearchResults(response.data.clienteSucursal);
        setSnackbarMessage("Resultados encontrados"); // Limpiar el mensaje del Snackbar si hay resultados
      } else {
        setSearchResults([]);
        updateSearchResults([]);
        setSnackbarMessage("No se encontraron resultados"); // Configurar el mensaje del Snackbar si no hay resultados
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setSearchResults([]);
      updateSearchResults([]);
      setSnackbarMessage("Error al buscar"); // Configurar el mensaje del Snackbar en caso de error
    }
    setSnackbarOpen(true); // Mostrar el Snackbar
  };

  // const handleSearch = async () => {
  //   try {
  //     clearSalesData(); // Limpia los datos de ventas
  //     setSelectedUser(null); // Desmarca el usuario seleccionado
  //     setSelectedChipIndex([]); // Limpia el índice del chip seleccionado
  //     setSearchResults([]); // Limpia los resultados de búsqueda
  //     setSelectedCodigoCliente(0); // Establece el código de cliente seleccionado como 0
  //     handleOpenPreciosClientesDialog(0, 0); // Limpia los datos del diálogo de precios
  //     handleOpenDeudasClientesDialog(0, 0);

  //     const response = await axios.get(
  //       `https://www.easyposdev.somee.com/api/Clientes/GetClientesByNombreApellido?nombreApellido=${searchText}`
  //     );
  //     if (Array.isArray(response.data.clienteSucursal)) {
  //       setSearchResults(response.data.clienteSucursal);
  //       // También actualiza el contexto con los resultados de la búsqueda
  //       updateSearchResults(response.data.clienteSucursal);
  //     } else {
  //       setSearchResults([]);
  //       // También actualiza el contexto con los resultados de la búsqueda vacíos
  //       updateSearchResults([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setSearchResults([]);
  //     // También actualiza el contexto con los resultados de la búsqueda vacíos en caso de error
  //     updateSearchResults([]);
  //   }
  // };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchText(inputValue);
    if (inputValue.trim() === "") {
      setSearchResults([]);
      setSelectedCodigoCliente(0), clearSalesData();
    }
  };
  const handleUltimaCompraCliente = async (
    codigoCliente,
    codigoClienteSucursal
  ) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_API2}/Clientes/GetClienteUltimaVentaByIdCliente?codigoClienteSucursal=${codigoClienteSucursal}&codigoCliente=${codigoCliente}`
      );

      console.log("Respuesta Ultima Compra :", response.data); // Console log de los datos enviados por el chip

      const { ticketBusqueda } = response.data; // Extraer la sección de ticket de la respuesta

      // Verificar si hay información de tickets antes de procesarla
      if (Array.isArray(ticketBusqueda) && ticketBusqueda.length > 0) {
        ticketBusqueda.forEach((ticket) => {
          const products = ticket.products; // Extraer la matriz de productos del ticket

          // Verificar si hay productos antes de enviarlos a addToSalesData
          if (Array.isArray(products) && products.length > 0) {
            products.forEach((product) => {
              addToSalesData({
                nombre: product.descripcion,
                precioVenta: product.precioUnidad,
                idProducto: product.codProducto,
                cantidad: product.cantidad,
              });
            });
          } else {
            console.log("No se encontraron productos en la última venta.");
          }
        });
      } else {
        console.log("No se encontraron tickets de venta en la última compra.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  ///Fx recibe parametros de evento onclick
  const handleOpenPreciosClientesDialog = (
    codigoCliente,
    codigoClienteSucursal
  ) => {
    setSelectedCodigoCliente(codigoCliente);
    setSelectedCodigoClienteSucursal(codigoClienteSucursal);
    // setOpenPrecioDialog(true);
  };

  const handleOpenDeudasClientesDialog = (
    codigoCliente,
    codigoClienteSucursal
  ) => {
    setSelectedCodigoCliente(codigoCliente);
    setSelectedCodigoClienteSucursal(codigoClienteSucursal);
  };

  return (
    <Grid container item xs={12} md={12} lg={12}>
      <Paper
        elevation={13}
        sx={{
          background: "#859398",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <Grid
          container
          sx={{ minWidth: 200, width: "100%", display: "flex" }}
          alignItems="center"
        >
          <Grid item xs={12} md={12} lg={12}>
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
              Buscador de clientes
            </InputLabel>
            <Paper
              elevation={0} // Sin elevación para que el borde funcione
              sx={{
                background: "#859398", // Color de fondo blanco para el Paper interior
                borderRadius: "5px", // Bordes redondeados
                display: "flex",
                alignItems: "center",
                margin: 1,
              }}
            >
              <TextField
                fullWidth
                placeholder="Ingrese Nombre Apellido"
                value={searchText}
                onChange={handleInputChange}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  margin: "1px",
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{
                  margin: "1px",
                  height: "3.4rem",
                  backgroundColor: "#283048",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1c1b17",
                  },
                  marginLeft: "8px", // Margen izquierdo para separar el TextField del Button
                }}
              >
                Buscar
              </Button>
            </Paper>
          </Grid>
        </Grid>
        {searchResults && searchResults.length > 0 && (
          <TableContainer>
            <ul
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "5px",
                padding: 0,
              }}
            >
              {searchResults.map((result, index) => (
                <ListItem key={result.codigoCliente}>
                  <Chip
                    label={`${result.nombreResponsable} ${result.apellidoResponsable}`}
                    icon={
                      selectedChipIndex === index ? <CheckCircleIcon /> : null
                    }
                    onClick={() => handleChipClick(index, result)}
                    sx={{
                      backgroundColor:
                        selectedChipIndex === index ? "#A8EB12" : "#2196f3",
                      transition: "none",
                    }}
                  />
                </ListItem>
              ))}
            </ul>
          </TableContainer>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="info"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Grid>
  );
};

export default BoxBuscador;
