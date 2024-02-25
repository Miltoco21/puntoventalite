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
import FaceIcon from "@mui/icons-material/Face";
import axios from "axios";
const BoxBuscador = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [serverResponse, setServerResponse] = useState("");
  const [ultimaVenta, setUltimaVenta] = useState("");
  useEffect(() => {
    if (ultimaVenta !== null) {
      console.log("Última venta:", ultimaVenta);
    }
  }, [ultimaVenta]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/Clientes/GetClientesByNombreApellido?nombreApellido=${searchText}`
      );
      console.log(" resultado busqueda", response.data.clienteSucursal);
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

  const handleUltimaCompraCliente = async (codigoCliente, codigoClienteSucursal) => {
    try {
      const response = await axios.get(`https://www.easyposdev.somee.com/api/Clientes/GetClienteUltimaVentaByIdCliente?codigoClienteSucursal=${codigoClienteSucursal}&codigoCliente=${codigoCliente}`);
      setUltimaVenta(response.data);
      console.log("Última venta response:", response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  return (
    <Paper elevation={13} sx={{ marginBottom: "3px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <Grid container spacing={2}>
            <Grid item xs={10} md={12} sx={{ display: "flex", margin: "8px" }}>
              <Grid item md={8}>
                <div style={{ display: "flex" }}></div>
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
              {searchResults.length > 0 ? (
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
                          label={
                            <div style={{ margin: "2px", padding: "13px" }}>
                              {result.nombreResponsable}{" "}
                              {result.apellidoResponsable}
                            </div>
                          }
                          onClick={() => handleUltimaCompraCliente(result.codigoCliente, result.codigoClienteSucursal)}

                        />
                      </ListItem>
                    ))}
                  </ul>
                </TableContainer>
              ) : (
                <Typography variant="subtitle1">
                  Rut no encontrado. Ir a la página de clientes:{" "}
                  <Button variant="outlined">Clientes</Button>
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              {searchResults.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {/* <TableCell>ID Cabecera</TableCell>
                        <TableCell>ID Usuario</TableCell> */}
                        <TableCell>Total</TableCell>
                        <TableCell>Método de Pago</TableCell>
                        <TableCell>Productos</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ultimaVenta && ultimaVenta.ticketBusqueda.map((ticket) => (
                        <TableRow key={ticket.idCabecera}>
                          {/* <TableCell>{ticket.idCabecera}</TableCell>
                          <TableCell>{ticket.idUsuario}</TableCell> */}
                          <TableCell>{ticket.total}</TableCell>
                          <TableCell>{ticket.metodoPago}</TableCell>
                          <TableCell>
                            <ul>
                              {ticket.products.map((product) => (
                                <li key={product.codProducto}>
                                  {product.descripcion} - Cantidad: {product.cantidad} - Precio Unidad: {product.precioUnidad}
                                </li>
                              ))}
                            </ul>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="subtitle1">
                  Rut no encontrado. Ir a la página de clientes:{" "}
                  <Button variant="outlined">Clientes</Button>
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BoxBuscador;
