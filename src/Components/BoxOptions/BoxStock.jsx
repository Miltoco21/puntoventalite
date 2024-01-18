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
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

const BoxStock = () => {
  const [openFacturamanual, setOpenFacturamanual] = useState(false);
  const [openMercaderia, setOpenMercaderia] = useState(false);
  const handleOpenFactura = () => {
    setOpenFacturamanual(true);
  };
  const handleCloseFactura = () => {
    setOpenFacturamanual(false);
  };
  const handleOpenMercaderia = () => {
    setOpenMercaderia(true);
  };
  const handleCloseMercaderia = () => {
    setOpenMercaderia(false);
  };

  return (
    <>
      <Paper style={{ display: "flex", justifyContent: "center" }}>
        <Button
          onClick={handleOpenFactura}
          sx={{ margin: "5px" }}
          variant="contained"
          color="primary"
        >
          Ingreso factura Manual{" "}
        </Button>
        <Button sx={{ margin: "5px" }} 
          onClick={handleOpenMercaderia}variant="contained" color="primary">
          {" "}
          Movimiento Mercadería
        </Button>
        <Button sx={{ margin: "5px" }} variant="contained" color="primary">
          Ingreso Automático de Facturas
        </Button>
      </Paper>

      <Dialog open={openFacturamanual}>
        <DialogTitle>Ingreso Facturas Manual</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFactura}>Cancelar</Button>
          {/* <Button onClick={handleButtonRecuperarVenta}>Seleccionar</Button> */}
        </DialogActions>
      </Dialog>

      <Dialog open={openMercaderia}>
        <DialogTitle>Moviento mercaderia</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMercaderia}>Cancelar</Button>
          {/* <Button onClick={handleButtonRecuperarVenta}>Seleccionar</Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BoxStock;
