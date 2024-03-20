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
  Chip,
  Typography,
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
  } = useContext(SelectedOptionsContext);

  const [searchText, setSearchText] = useState("");

  const [ultimaVenta, setUltimaVenta] = useState(null); // Estado para los datos de la última venta

  const [selectedChipIndex, setSelectedChipIndex] = useState(null);

  const handleChipClick = (index, result) => {
    // Verificar si el usuario seleccionado es el mismo que el usuario actualmente seleccionado
    if (
      selectedUser !== null &&
      selectedUser.codigoCliente === result.codigoCliente &&
      selectedUser.codigoClienteSucursal === result.codigoClienteSucursal
    ) {
      // Si es el mismo usuario, limpiar los datos de la venta
      clearSalesData();
      // Desseleccionar el usuario estableciendo selectedUser a null
      setSelectedUser(null);
      // Establecer el índice del chip seleccionado a null
      setSelectedChipIndex(null);
    } else {
      // Si es un usuario diferente, realizar las acciones normales de selección
      setSelectedUser(result); // Establecer el usuario seleccionado
      setSelectedChipIndex(index); // Establecer el índice del chip seleccionado directamente
      // Llamar a las funciones asociadas al clic en el chip seleccionado
      handleUltimaCompraCliente(
        result.codigoCliente,
        result.codigoClienteSucursal
      );
      handleOpenPreciosClientesDialog(
        result.codigoCliente,
        result.codigoClienteSucursal
      );
      // handleOpenDeudasClientesDialog(
      //   result.codigoCliente,
      //   result.codigoClienteSucursal
      // );
      clearSalesData();
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/Clientes/GetClientesByNombreApellido?nombreApellido=${searchText}`
      );
      if (Array.isArray(response.data.clienteSucursal)) {
        setSearchResults(response.data.clienteSucursal);
        // También actualiza el contexto con los resultados de la búsqueda
        updateSearchResults(response.data.clienteSucursal);
      } else {
        setSearchResults([]);
        // También actualiza el contexto con los resultados de la búsqueda vacíos
        updateSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setSearchResults([]);
      // También actualiza el contexto con los resultados de la búsqueda vacíos en caso de error
      updateSearchResults([]);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchText(inputValue);
    if (inputValue.trim() === "") {
      setSearchResults([]);
    }
  };
  const handleUltimaCompraCliente = async (
    codigoCliente,
    codigoClienteSucursal
  ) => {
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/Clientes/GetClienteUltimaVentaByIdCliente?codigoClienteSucursal=${codigoClienteSucursal}&codigoCliente=${codigoCliente}`
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
    <Paper
      elevation={13}
      sx={{ marginBottom: "3px", backgroundColor: "#859398" }}
    >
      <Grid container spacing={1}>
        <Grid item xs={12} md={12} lg={12}>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              sx={{
                display: "flex",

                justifyContent: "center",
                gap: 1,
              }}
            >
              <Grid
                item
                xs={10}
                sm={8}
                md={8}
                sx={{
                  display: "flex",

                  justifyContent: "center",
                }}
              >
                <TextField
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "5px", // Ajusta el radio de los bordes según tus preferencias
                    // boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Ajusta el sombreado según tus preferencias
                  }}
                  fullWidth
                  label="Ingrese Nombre Apellido"
                  value={searchText}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item md={3}>
                <Button
                  sx={{
                    width: "90%",
                    height: "100%",
                    backgroundColor: " #283048",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1c1b17 ",
                      color: "white",
                    },
                  }}
                  fullWidth
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                >
                  Buscar
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {searchResults && searchResults.length > 0 && (
                <TableContainer>
                  <ul
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "3px",
                    }}
                  >
                    {searchResults.map((result, index) => (
                      <ListItem key={result.codigoCliente}>
                        <Chip
                          sx={{
                            display: "flex",
                            margin: "auto",
                            backgroundColor:
                              selectedChipIndex === index
                                ? "#A8EB12"
                                : "#2196f3",
                            transition: "background-color 0.3s ease",
                          }}
                          label={`${result.nombreResponsable} ${result.apellidoResponsable}`}
                          icon={
                            selectedChipIndex === index ? (
                              <CheckCircleIcon />
                            ) : null
                          } // Agrega el icono de verificación si el chip está seleccionado
                          onClick={() => handleChipClick(index, result)} // Pasar el índice y el resultado al handleChipClick
                        />
                      </ListItem>
                    ))}
                  </ul>
                </TableContainer>
              )}
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
        </Grid>
      </Grid>

      <div style={{ display: "none" }}>
        <BoxPreciosClientes
          onClosePreciosClientes={handleClosePreciosClientes}
          onOpenPreciosClientesDialog={handleOpenPreciosClientesDialog}
        />
      </div>
      <div style={{ display: "none" }}>
        <BoxCtaCorriente
          onCloseDeudaClientes={handleClosePreciosClientes}
          onOpenPreciosClientesDialog={handleOpenDeudasClientesDialog}
        />
      </div>
    </Paper>
  );
};

export default BoxBuscador;
{
  /* <Chip
                          sx={{ display: "flex", margin: "auto" }}
                          label={`${result.nombreResponsable} ${result.apellidoResponsable}`}
                          onClick={() => {
                            handleUltimaCompraCliente(
                              result.codigoCliente,
                              result.codigoClienteSucursal
                            );
                            handleOpenPreciosClientesDialog(
                              result.codigoCliente,
                              result.codigoClienteSucursal
                            );
                            handleOpenDeudasClientesDialog(
                              result.codigoCliente,
                              result.codigoClienteSucursal
                            );
                          }}
                        /> */
}
