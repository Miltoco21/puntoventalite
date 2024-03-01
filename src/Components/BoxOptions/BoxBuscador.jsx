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
import BoxSumaProd from "./BoxSumaProd";
import axios from "axios";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const BoxBuscador = () => {
  const { salesData, addToSalesData ,setPrecioData} = useContext(SelectedOptionsContext);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [ultimaVenta, setUltimaVenta] = useState(null); // Estado para los datos de la última venta
  const [selectedUser, setSelectedUser] = useState(null);
 
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/Clientes/GetClientesByNombreApellido?nombreApellido=${searchText}`
      );
      if (Array.isArray(response.data.clienteSucursal)) {
        setSearchResults(response.data.clienteSucursal);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setSearchResults([]);
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

      console.log("Datos enviados por chip:", response.data); // Console log de los datos enviados por el chip

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
  const handleOpenPreciosClientesDialog = async (codigoCliente, codigoClienteSucursal) => {
    try {
      console.log(codigoCliente, codigoClienteSucursal);
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/Clientes/GetClientesProductoPrecioByIdCliente?codigoCliente=${codigoCliente}&codigoClienteSucursal=${codigoClienteSucursal}`
      );
  
      // Actualiza el estado con los datos obtenidos de la API
      setPrecioData(response.data);
      console.log("Respuesta Precios Clientes:", response.data);
  
      // Abre el diálogo
      setOpenPrecioDialog(true);
    } catch (error) {
      console.error("Error Precios Clientes", error);
    }
  };
  // const handleOpenDialog = async (codigoCliente, codigoClienteSucursal) => {
  //   try {
  //     console.log(codigoCliente, codigoClienteSucursal);
  //     const response = await axios.get(
  //       `https://www.easyposdev.somee.com/api/Clientes/GetClientesProductoPrecioByIdCliente?codigoCliente=${codigoCliente}&codigoClienteSucursal=${codigoClienteSucursal}`
  //     );
  
  //     // Aquí puedes abrir el diálogo con los datos obtenidos
  //     console.log("Datos del diálogo:", response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // const handleUltimaCompraCliente = async (codigoCliente, codigoClienteSucursal, producto) => {
  //   try {
  //     const response = await axios.get(
  //       `https://www.easyposdev.somee.com/api/Clientes/GetClienteUltimaVentaByIdCliente?codigoClienteSucursal=${codigoClienteSucursal}&codigoCliente=${codigoCliente}`
  //     );
  //     setUltimaVenta(response.data);
  //     console.log("Datos enviados por chip:", response.data); // Console log de los datos enviados por el chip

  //     // Enviar los datos de los productos de la última venta a addToSalesData
  //     response.data.products.forEach((product) => {
  //       addToSalesData({
  //         nombre: product.descripcion,
  //         precioVenta: product.precioUnidad, // Ajustar según el precio correcto en la respuesta de la API
  //         idProducto: product.codProducto, // Ajustar según el identificador correcto en la respuesta de la API
  //       });
  //     });
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  return (
    <Paper elevation={13} sx={{ marginBottom: "3px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <Grid container spacing={2}>
            <Grid
              item
              xs={10}
              md={12}
              sx={{
                display: "flex",
                margin: "8px",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Grid item md={8}>
                <TextField
                  fullWidth
                  label="Ingrese Nombre Apellido"
                  value={searchText}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item md={3}>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={handleSearch}
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
                    {searchResults.map((result) => (
                      <ListItem key={result.codigoCliente}>
                        <Chip
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
                          }}
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
    </Paper>
  );
};

export default BoxBuscador;
