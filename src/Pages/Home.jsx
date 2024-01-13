/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Grid, Container } from "@mui/material";

import BoxDatosCaja from "../Components/BoxOptions/BoxDatosCaja";
import BoxGestionCaja from "../Components/BoxOptions/BoxGestionCaja";

import BoxSumaProd from "../Components/BoxOptions/BoxSumaProd";
import Navbar from "../Components/Navbar/Navbar";

const Home = () => {
  return (
    <>
      <CssBaseline />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Navbar />
          </Grid>

          {/* Main Content */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {/* BoxDatosCaja */}
              <Grid item xs={12} sm={12} md={6}lg={6} style={{ position: "relative" }}>
                <BoxDatosCaja />
                {/* BoxSumaProd with absolute positioning */}
                <BoxSumaProd
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                  }}
                />
              </Grid>

              {/* BoxGestionCaja */}
              <Grid item xs={12}  sm={12} md={6}>
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
