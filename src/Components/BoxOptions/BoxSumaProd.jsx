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
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import TecladoPLU from "../Teclados/TecladoPLU";
import TecladoPeso from "../Teclados/TecladoPeso";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const BoxSumaProd = () => {
  const {
    salesData,
    grandTotal,
    addToSalesData,
    removeFromSalesData,
    incrementQuantity,
    decrementQuantity,
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

  const calculateTotalPrice = (quantity, price) => quantity * price;

  const handlePluSubmit = (productInfo) => {
    setPlu(productInfo.idProducto);
    handleClose();
    if (productInfo) {
      addToSalesData(productInfo, 1);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleOpenPeso = () => setOpenPeso(true);
  const handleClose = () => setOpen(false);
  const handleClosePeso = () => setOpenPeso(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    if (productInfo) {
      addToSalesData(productInfo, 1);
    }
  };

  const handlePesoSubmit = (pesoValue) => {
    setPeso(pesoValue);
    handleClose();
    if (productInfo) {
      addToSalesData(productInfo, 1);
    }
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
            width: "100%"
          }}
        >
          <Grid item xs={12} lg={14}sx={{ minWidth: 200, width: "80%" }}> 
            <div style={{ display: "flex" }}>
              <TextField
                fullWidth
                focused
                placeholder="Ingresa Código"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Button size="large" variant="outlined" onClick={handleOpen}>
                PLU
              </Button>
              <Button
                size="large"
                variant="outlined"
                onClick={handleOpenPeso}
              >
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
          <TableContainer component={Paper}>
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
                    <TableCell>
                      <IconButton
                        onClick={() => incrementQuantity(index, productInfo)}
                      >
                        <AddIcon />
                      </IconButton>
                      {sale.quantity}
                      <IconButton
                        onClick={() => decrementQuantity(index, productInfo)}
                      >
                        <RemoveIcon />
                      </IconButton>
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

      <Dialog sx={{ width: "500px" }} open={open} onClose={handleClose}>
        <DialogContent>
          <TecladoPLU
            plu={plu}
            setPlu={setPlu}
            onClose={handleClose}
            onPluSubmit={handlePluSubmit}
          />
        </DialogContent>
      </Dialog>
      <Dialog sx={{ width: "500px" }} open={openPeso} onClose={handleClosePeso}>
        <DialogContent>
          <TecladoPeso
            peso={peso}
            setPeso={setPeso}
            onClose={handleClosePeso}
            onPesoSubmit={handlePesoSubmit}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default BoxSumaProd;
