import React, { useState, useContext, useEffect } from "react";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  InputLabel,
  Box,
  IconButton,
  Collapse,
  Grid, // Importamos Grid de Material UI
} from "@mui/material";
import { ExpandLess, ExpandMore, Grid3x3Outlined } from "@mui/icons-material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig"
const UserProfileCard = () => {
  const { userData } = useContext(SelectedOptionsContext);
  console.log("userdata model ",userData );
  
  const [vendedor, setVendedor] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      setTimeout(() => {
        setVendedor({
          codigo: userData.codigoUsuario || "21",
          nombre:
            userData.nombres + " " + userData.apellidos || "Nombre Apellido",
          caja: "1",
          rol: userData.rol || "Rol del usuario",
          boleta: "323232321",
          operacion: "12123141",
        });
      }, 2000);
    };

    fetchData();
  }, [userData]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <Paper sx={{ background: "#859398", padding: 1, margin: "0 auto" }}>
      <Grid
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <InputLabel
          sx={{
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          Información Vendedor
        </InputLabel>
        <IconButton onClick={handleToggle} sx={{ color: "black" }}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Grid>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <TableContainer>
          <Grid
            container
            spacing={2} // Añadimos espaciado entre los elementos
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {vendedor && (
              <>
                <Grid item xs={12} sm={6} md={2}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ backgroundColor: "gainsboro", padding: "4px" }}
                        >
                          <strong>Nombre</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ fontSize: "0.85rem", padding: "4px" }}
                        >
                          {vendedor.nombre}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>

                <Grid item xs={6} sm={6} md={2}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ backgroundColor: "gainsboro", padding: "4px" }}
                        >
                          <strong>Código</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ fontSize: "0.85rem", padding: "4px" }}
                        >
                          {vendedor.codigo}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>

                <Grid item xs={6} sm={6} md={2}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ backgroundColor: "gainsboro", padding: "4px" }}
                        >
                          <strong>Caja</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ fontSize: "0.85rem", padding: "4px" }}
                        >
                          {vendedor.caja}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>

                <Grid item xs={6} sm={6} md={2}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ backgroundColor: "gainsboro", padding: "4px" }}
                        >
                          <strong>Nº Última Operación</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ fontSize: "0.85rem", padding: "4px" }}
                        >
                          {vendedor.operacion}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>

                <Grid item xs={6} sm={6} md={2}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ backgroundColor: "gainsboro", padding: "4px" }}
                        >
                          <strong>Última Boleta</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ fontSize: "0.85rem", padding: "4px" }}
                        >
                          {vendedor.boleta}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              </>
            )}
          </Grid>
        </TableContainer>
      </Collapse>
    </Paper>
  );
};

export default UserProfileCard;
