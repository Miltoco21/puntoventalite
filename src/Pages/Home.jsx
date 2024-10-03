// /* eslint-disable no-undef */
// /* eslint-disable react-refresh/only-export-components */
// /* eslint-disable no-unused-vars */
// import React from "react";
// import CssBaseline from "@mui/material/CssBaseline";
// import { Grid, Container } from "@mui/material";

// import BoxDatosCaja from "../Components/BoxOptions/BoxDatosCaja";
// import BoxGestionCaja from "../Components/BoxOptions/BoxGestionCaja";

// import BoxSumaProd from "../Components/BoxOptions/BoxSumaProd";
// import Navbar from "../Components/Navbar/Navbar";
// import BoxBuscador from "../Components/BoxOptions/BoxBuscador";

// const Home = () => {
//   return (
//     <>
//       <CssBaseline />
//       <Container
//         sx={{
//           background: "rgb(146, 181, 176)",
//         }}
//       >
//         <Grid container spacing={1}>
//           <Grid item xs={12}>
//             <Navbar />
//             <BoxDatosCaja />
//           </Grid>

//           {/* Main Content */}
//           <Grid item xs={12}
//           sm={12}
//           md={12}
//           lg={12}>
//             <Grid container>
//               {/* BoxDatosCaja */}
//               <Grid
//                 item
//                 xs={12}
//                 sm={12}
//                 md={6}
//                 lg={6}
//                 // style={{ position: "relative" }}
//               >
              
//                 <BoxBuscador />

//                 <BoxSumaProd />
//               </Grid>

//               {/* BoxGestionCaja */}
//               <Grid item xs={12} sm={12} md={6} lg={6}>
//                 <BoxGestionCaja />
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Container>
//     </>
//   );
// };

// export default Home;
/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Grid, Container, Box } from "@mui/material";

import BoxDatosCaja from "../Components/BoxOptions/BoxDatosCaja";
import BoxGestionCaja from "../Components/BoxOptions/BoxGestionCaja";
import BoxSumaProd from "../Components/BoxOptions/BoxSumaProd";
import Navbar from "../Components/Navbar/Navbar";
import BoxBuscador from "../Components/BoxOptions/BoxBuscador";

const Home = () => {
  return (
    <>
      <CssBaseline />
      <Container
        sx={{
          background: "rgb(146, 181, 176)",
          paddingTop: 2, // Agrega espacio en la parte superior
          paddingBottom: 2, // Agrega espacio en la parte inferior
        }}
      >
        <Grid container spacing={2}> {/* Espaciado entre filas */}
          {/* Navbar y BoxDatosCaja */}
          <Grid item xs={12}>
            <Navbar />
            <BoxDatosCaja />
          </Grid>

          {/* Contenido Principal */}
          <Grid item xs={12}>
            <Grid container spacing={3}> {/* Ajusta el espaciado entre columnas */}
              {/* Columna izquierda con BoxBuscador y BoxSumaProd */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1, // Espacio entre BoxBuscador y BoxSumaProd
                }}
              >
                <BoxBuscador />
                <BoxSumaProd />
              </Grid>

              {/* Columna derecha con BoxGestionCaja */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
              >
                <BoxGestionCaja />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
