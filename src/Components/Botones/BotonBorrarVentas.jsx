import React, { useState,useContext } from "react";
import { Button } from "@mui/material";

import { estilosBoton } from "./estilosBotones"; // Importa los estilos
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const BotonBorrarVentas = () => {
  const { clearSalesData } = useContext(SelectedOptionsContext);

  const [openDialog, setOpenDialog] = useState(false);
  const handleClearSalesData = () => {
    clearSalesData();
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      {/* Botón que abrirá el diálogo de creación de clientes */}
      <Button sx={estilosBoton} onClick={handleClearSalesData}>
    Borrar ventas
      </Button>

      
    </div>
  );
};

export default BotonBorrarVentas;
