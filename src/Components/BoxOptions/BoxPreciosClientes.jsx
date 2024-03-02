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
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {precioData && precioData.clientesProductoPrecioMostrar.map((item) => (
                  <TableRow key={item.codigoCliente}>
                    <TableCell>{item.codigoCliente}</TableCell>
                    <TableCell>{item.nombreCliente}</TableCell>
                    <TableCell>{item.idProducto}</TableCell>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.precio}</TableCell>
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
