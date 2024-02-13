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
  TableBody,
  TableCell,
  TableContainer,
  Radio,
  RadioGroup,
  FormControlLabel,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogContent,
} from "@mui/material";

import BotonesCategorias from "../BoxOptions/BotonesCategorias";
import TecladoPLU from "../Teclados/TecladoPLU";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const MovimientoMercaderia = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [productInfo, setProductInfo] = useState(null);
  const [plu, setPlu] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePluSubmit = (productInfo) => {
    setPlu(productInfo.idProducto);
    handleClose();
    if (productInfo) {
      addToSalesData(productInfo, 1);
    }
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    if (productInfo) {
      addToSalesData(productInfo, 1);
    }
  };

  const [openCategoria, setOpenCategoria] = useState(false);
  const handleOpenCategoria = () => {
    setOpenCategoria(true);
  };
  const handleCloseCategoria = () => {
    setOpenCategoria(false);
  };
  const [selectedOption, setSelectedOption] = useState("entrada"); // Valor por defecto

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <Paper>
      <Grid item xs={12} sm={12} container>
        <Grid>
          <div style={{ display: "flex" }}>
            <TextField
              fullWidth
              focused
              placeholder="Ingresa Código"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button size="large" variant="outlined" onClick={handleOpen}>
              Código
            </Button>
            {/* <Button
                size="large"
                variant="outlined"
                onClick={handleOpenPeso}
              >
                Peso
              </Button> */}
          </div>
          <div style={{ display: "flex" }}>
            <TextField
              fullWidth
              //focused
              placeholder="Ingresa Descripción"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button size="large" variant="outlined" onClick={handleOpen}>
              Descripción
            </Button>
            {/* <Button
                size="large"
                variant="outlined"
                onClick={handleOpenPeso}
              >
                Peso
              </Button> */}
          </div>
          <div>
            <Button
              sx={{
                width: "60%",
                height: "60px",
                backgroundColor: "lightSalmon",
                color: "white",
                "&:hover": {
                  backgroundColor: "coral",
                  color: "white",
                },
                margin: "5px",
              }}
              onClick={handleOpenCategoria}
            >
              {/* <LockPersonIcon /> */}
              <Typography variant="h7">Familias</Typography>
            </Button>
          </div>
          <div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Entrada-Salida </TableCell>
                  <TableCell>Stock Actual</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Example rows */}
                <TableRow>
                  <TableCell>Data 1</TableCell>
                  <TableCell>Data 2</TableCell>
                  <TableCell>
                    <RadioGroup
                      row
                      value={selectedOption}
                      onChange={handleOptionChange}
                    >
                      <FormControlLabel
                        value="entrada"
                        control={<Radio />}
                        label="Entrada"
                      />
                      <FormControlLabel
                        value="salida"
                        control={<Radio />}
                        label="Salida"
                      />
                    </RadioGroup>
                    Cantidad Producto
                  </TableCell>
                  <TableCell>Data 4</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Data 5</TableCell>
                  <TableCell>Data 6</TableCell>
                  <TableCell>Data 7</TableCell>
                  <TableCell>Data 8</TableCell>
                </TableRow>
                {/* Add more rows as needed */}
              </TableBody>
            </Table>
          </div>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <TecladoPLU
            plu={plu}
            setPlu={setPlu}
            onClose={handleClose}
            onPluSubmit={handlePluSubmit}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={openCategoria} onClose={handleCloseCategoria}>
        <DialogContent>
          {/* Contenido del diálogo */}
          <Typography variant="h6">Selecciona una categoría</Typography>
          <BotonesCategorias />
          {/* Puedes agregar más contenido o personalizar según tus necesidades */}
          <Button variant="outlined" onClick={handleCloseCategoria}>
            Cerrar
          </Button>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default MovimientoMercaderia;
