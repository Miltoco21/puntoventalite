import React, { useState } from "react";
import { Button } from "@mui/material";
import BoxCtaCorriente from "../BoxOptions/BoxCtaCorriente";
import { estilosBoton } from "./estilosBotones"; // Importa los estilos

const BotonDeudas = () => {
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
        Deudas
      </Button>

      {/* Componente de deudas-ctacorriente */}
      {/* <BoxCtaCorriente
        openDialog={openDialog}
        setOpendialog={setOpenDialog}
        onClose={handleCloseDialog}
      /> */}
    </div>
  );
};

export default BotonDeudas;
