// import React, { useState } from "react";
// import { Button } from "@mui/material";
// import { estilosBoton } from "./estilosBotones"; // Importa los estilos
// import BotonesCategorias from "../BoxOptions/BotonesCategorias";

// const BotonFamilias = () => {

//   const [openDialog, setOpenDialog] = useState(false);


//   const handleOpenDialog = () => {
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };
//   return (
//     <div>
//       {/* Botón que abrirá el diálogo de creación de clientes */}
//       <Button
//      sx={estilosBoton} 
//         onClick={handleOpenDialog}
        
//       >
//      Familias
//       </Button>

//       {/* Componente de IngresoClientesModel que contiene el formulario */}
//       <BotonesCategorias
//         openDialog={openDialog}
//         setOpendialog={setOpenDialog}
//         onClose={handleCloseDialog}
//       />
//     </div>
//   )
// }

// export default BotonFamilias
import React, { useState } from "react";
import { Button } from "@mui/material";
import { estilosBoton } from "./estilosBotones"; // Importa los estilos
import BotonesCategorias from "../BoxOptions/BotonesCategorias";

const BotonFamilias = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [step, setStep] = useState("categoria"); // 'categoria', 'subcategoria', 'familia', 'subfamilia'

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Función para cambiar el paso de navegación (categoría -> subcategoría, etc.)
  const handleNextStep = (nextStep) => {
    setStep(nextStep);
  };

  // Función para volver al paso anterior (si quisieras incluir un botón "Atrás")
  const handlePreviousStep = (previousStep) => {
    setStep(previousStep);
  };

  return (
    <div>
      {/* Botón que abrirá el diálogo de creación de clientes */}
      <Button
        sx={estilosBoton}
        onClick={handleOpenDialog}
      >
        Familias
      </Button>

      {/* Componente de BotonesCategorias que contiene la lógica */}
      {openDialog && (
        <BotonesCategorias
          openDialog={openDialog}
          step={step}
          onClose={handleCloseDialog}
          onNextStep={handleNextStep}
          onPreviousStep={handlePreviousStep}
        />
      )}
    </div>
  );
};

export default BotonFamilias;
