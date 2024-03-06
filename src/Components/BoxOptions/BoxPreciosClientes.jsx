/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
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

const BoxPreciosClientes = () => {
  const { precioData, setPrecioData } = useContext(SelectedOptionsContext);
  console.log("PrecioData:", precioData);
  const [preciosModificados, setPreciosModificados] = useState({});

  // const handlePrecioChange = (e, itemId) => {
  //   const updatedPrices = {
  //     ...preciosModificados,
  //     [itemId]: parseFloat(e.target.value)
  //   };
  //   setPreciosModificados(updatedPrices);
  // };
  const handlePrecioChange = (e, itemId) => {
    const updatedPrices = {
      ...preciosModificados,
      [itemId]: e.target.value.trim() !== "" ? parseFloat(e.target.value) : "",
    };
    setPreciosModificados(updatedPrices);
  };

  const handleSaveChanges = async (idProducto, codigoCliente, codigoClienteSucursal) => {
    try {
      const requestBody = {
        codigoCliente,
        codigoClienteSucursal,
        preciosProductos: [
          {
            idProducto: parseInt(idProducto),
            precio: preciosModificados[idProducto]
          }
        ]
      };

      console.log("Datos antes de la solicitud:", requestBody);

      const response = await axios.put('https://www.easyposdev.somee.com/api/Clientes/PutClientesProductoActualizarPrecioByIdCliente', requestBody);
      
      console.log("Datos después de la solicitud:", requestBody);
      console.log("Respuesta de la API:", response.data); 

      // Manejar la respuesta según sea necesario
    } catch (error) {
      console.error("Error al actualizar los precios:", error);
    }
  };


  // const handleSaveChanges = async () => {
  //   try {
  //     const preciosProductos = Object.keys(preciosModificados).map(
  //       (idProducto) => ({
  //         idProducto: parseInt(idProducto),
  //         precio: preciosModificados[idProducto],
  //       })
  //     );
  //     const requestBody = {
  //       codigoCliente: 0,
  //       codigoClienteSucursal: 0,
  //       preciosProductos: preciosProductos,
  //     };
  //     const response = await axios.put(
  //       "https://www.easyposdev.somee.com/api/Clientes/PutClientesProductoActualizarPrecioByIdCliente",
  //       requestBody
  //     );
  //     console.log(response.data); // Manejar la respuesta según sea necesario
  //   } catch (error) {
  //     console.error("Error al actualizar los precios:", error);
  //   }
  // };
  return (
    <Grid container spacing={2} justifyContent="center">
    <Grid item xs={12} md={12} lg={12}>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Cliente</TableCell>
                <TableCell>Nombre Cliente</TableCell>
                <TableCell>ID Producto</TableCell>
                <TableCell>Nombre Producto</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Guardar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {precioData &&
                precioData.clientesProductoPrecioMostrar.map((item) => (
                  <TableRow key={item.codigoCliente}>
                    <TableCell>{item.codigoCliente}</TableCell>
                    <TableCell>{item.nombreCliente}</TableCell>
                    <TableCell>{item.idProducto}</TableCell>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        value={
                          preciosModificados[item.idProducto] !== undefined
                            ? preciosModificados[item.idProducto]
                            : item.precio
                        }
                        onChange={(e) => handlePrecioChange(e, item.idProducto)}
                      />
                    </TableCell>
                    <TableCell>
                    <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSaveChanges(item.idProducto, item.codigoCliente, item.codigoClienteSucursal)}
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
  );
};

export default BoxPreciosClientes;
