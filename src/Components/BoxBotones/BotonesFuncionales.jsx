import React from "react";
import { Grid, Button } from "@mui/material";
import BotonCrearCliente from "../Botones/BotonCrearCliente"; // Importa el botón de crear cliente
import BotonBorrarVentas from "../Botones/BotonBorrarVentas";
import BotonDeudas from "../Botones/BotonDeudas";
import BotonFamilias from "../Botones/BotonFamilias";
const BotonesFuncionales = () => {
  return (
    <Grid container spacing={2} sx={{ padding: "2%" }}>
      {/* Boton Borrar ventas */}
      <Grid item xs={12} md={4}>
        <BotonBorrarVentas />
      </Grid>
      {/* Botón para crear un cliente */}
      <Grid item xs={12} md={4}>
        <BotonCrearCliente />
      </Grid>
      <Grid item xs={12} md={4}>
        <BotonFamilias/>
      </Grid>

    
    </Grid>
  );
};

export default BotonesFuncionales;
