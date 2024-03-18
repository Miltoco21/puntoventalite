import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Card,
  Chip,
  TextField,
  Typography,
  Button,
  DialogContent,
  Dialog,
  Table,
  TableBody,
  TableCell,
  Autocomplete,
  TableContainer,
  TableHead,
  DialogActions,
  DialogTitle,
  TableRow,
  Snackbar,
} from "@mui/material";

import axios from "axios";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import BoxRecuperarVenta from "./BoxRecuperarVenta";
import BoxDevolucion from "./BoxDevolucion";
import BoxIngreso from "./BoxIngreso";
import BoxStock from "./BoxStock";
import IngresoClientes from "./IngresoClientes";
import BoxPago from "./BoxPago";
import BoxPagoTicket from "./BoxPagoTicket";
import BoxBuscador from "./BoxBuscador";

const BoxPreciosClientes = ({
  onClosePreciosClientes,
  onOpenPreciosClientesDialog,
}) => {
  const {
    precioData,
    setPrecioData,
    userData,
    setUserData,
    searchResults,
    setSearchResults,
    selectedCodigoCliente,
    selectedCodigoClienteSucursal,
    setSelectedCodigoCliente,
    setSelectedCodigoClienteSucursal,
  } = useContext(SelectedOptionsContext);
  console.log("PrecioDataAA:", precioData);
  console.log("searchResults:", searchResults);
  console.log("selectedCodigoCliente:",selectedCodigoCliente);
  console.log("selectedCodigoClienteSucursal:",selectedCodigoClienteSucursal);

  const [preciosModificados, setPreciosModificados] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchPrecioData = async () => {
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/Clientes/GetClientesProductoPrecioByIdCliente?codigoCliente=${selectedCodigoCliente}&codigoClienteSucursal=${selectedCodigoClienteSucursal}`
      );

      console.log("Nuevos precios:", response.data);
      setPrecioData(response.data);
    } catch (error) {
      console.error("Error al obtener los nuevos precios:", error);
    }
  };

  useEffect(() => {
    fetchPrecioData();
  }, [selectedCodigoCliente, selectedCodigoClienteSucursal, setPrecioData]);

  const handlePrecioChange = (e, itemId) => {
    const updatedPrices = {
      ...preciosModificados,
      [itemId]: e.target.value.trim() !== "" ? parseFloat(e.target.value) : "",
    };
    setPreciosModificados(updatedPrices);
  };

  const handleSaveChanges = async (
    idProducto,
    codigoCliente,
    codigoClienteSucursal
  ) => {
    try {
      const requestBody = {
        codigoCliente: codigoCliente,
        codigoClienteSucursal: codigoClienteSucursal,
        preciosProductos: [
          {
            idProducto: parseInt(idProducto),
            precio: preciosModificados[idProducto],
          },
        ],
      };

      console.log("Datos antes de la solicitud:", requestBody);

      const response = await axios.put(
        "https://www.easyposdev.somee.com/api/Clientes/PutClientesProductoActualizarPrecioByIdCliente",
        requestBody
      );

      console.log("Datos después de la solicitud:", requestBody);
      console.log("Respuesta de la API:", response.data);

      if (response.status === 200) {
        const updatePrecios = await axios.get(
          `https://www.easyposdev.somee.com/api/Clientes/GetClientesProductoPrecioByIdCliente?codigoCliente=${codigoCliente}&codigoClienteSucursal=${codigoClienteSucursal}`
        );

        setSnackbarMessage(response.data.descripcion);
        setSnackbarOpen(true);

        // Realizar la segunda llamada a la API para obtener las deudas del cliente
        const deudasResponse = await axios.get(
          `https://www.easyposdev.somee.com/api/Clientes/GetClientesDeudasByIdCliente?codigoCliente=${codigoCliente}&codigoClienteSucursal=${codigoClienteSucursal}`
        );

        console.log("Respuesta de la API de deudas:", deudasResponse.data);

        // Esperar 4 segundos antes de cerrar el modal
        setTimeout(() => {
          // setSearchResults();
          onClosePreciosClientes(); ////Cierre Modal al finalizar
        }, 2000);
      }
    } catch (error) {
      console.error("Error al actualizar los precios:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      {precioData && searchResults &&(
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={12} lg={12}>
            <Paper>
              <Card
                sx={{
                  backgroundColor: "#2196f3",
                  padding: "5px",
                  display: "flex",
                  justifyContent: "center",
                }}
                p={2}
              >
                {precioData && precioData.clientesProductoPrecioMostrar && (
                  <Typography variant="h7" id="codCliente">
                    ID Cliente:{" "}
                    {precioData.clientesProductoPrecioMostrar[0] &&
                      precioData.clientesProductoPrecioMostrar[0]
                        .codigoCliente}{" "}
                  </Typography>
                )}
                {precioData && precioData.clientesProductoPrecioMostrar && (
                  <Typography variant="h7">
                    Nombre Cliente:{" "}
                    {precioData.clientesProductoPrecioMostrar[0] &&
                      precioData.clientesProductoPrecioMostrar[0]
                        .nombreCliente}{" "}
                  </Typography>
                )}
              </Card>
              <TableContainer sx={{ overflowX: "auto" }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "3%" }}>ID </TableCell>
                      <TableCell sx={{ width: "9%" }}>
                        Nombre Producto
                      </TableCell>
                      <TableCell sx={{ width: "8%" }}>Precio</TableCell>
                      <TableCell sx={{ width: "8%" }}>Guardar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {precioData.clientesProductoPrecioMostrar.map((item) => (
                      <TableRow key={item.idProducto}>
                        <TableCell>{item.idProducto}</TableCell>
                        <TableCell>{item.nombre}</TableCell>
                        <TableCell>
                          <TextField
                            variant="outlined"
                            fullWidth
                            value={
                              preciosModificados[item.idProducto] !== undefined
                                ? preciosModificados[item.idProducto]
                                : item.precio
                            }
                            onChange={(e) =>
                              handlePrecioChange(e, item.idProducto)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              handleSaveChanges(
                                item.idProducto,
                                precioData.clientesProductoPrecioMostrar[0]
                                  .codigoCliente,
                                precioData.clientesProductoPrecioMostrar[0]
                                  .codigoClienteSucursal
                              );
                            }}
                          >
                            Guardar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </>
  );
};

export default BoxPreciosClientes;