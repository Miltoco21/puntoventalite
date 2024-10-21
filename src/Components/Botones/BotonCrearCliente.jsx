import React, { useState } from "react";
import { Button } from "@mui/material";
import IngresoClientesModel from "../BoxOptions/IngresoClientesModel";
import { estilosBoton } from "./estilosBotones"; // Importa los estilos

const BotonCrearCliente = () => {
  const [openDialog, setOpenDialog] = useState(false);


  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      {/* Botón que abrirá el diálogo de creación de clientes */}
      <Button
     sx={estilosBoton} 
        onClick={handleOpenDialog}
        
      >
        Crear Cliente
      </Button>

      {/* Componente de IngresoClientesModel que contiene el formulario */}
      <IngresoClientesModel
        openDialog={openDialog}
        setOpendialog={setOpenDialog}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default BotonCrearCliente;
