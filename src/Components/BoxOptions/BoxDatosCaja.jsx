import React, { useState, useContext, useEffect } from "react";
import {
  Paper,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  TableContainer,
  Grid,
  useTheme,
  useMediaQuery,
  InputLabel
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const UserProfileCard = () => {
  const { userData } = useContext(SelectedOptionsContext);
  const [vendedor, setVendedor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // Simulación de obtención de datos del usuario después de un tiempo de espera
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

  return (
    <Paper sx={{ background: "#859398" }}>
      <InputLabel
              sx={{
                display: "flex",
                alignItems: "center",
                margin: 1,
               // Cambiar el color del texto a azul
                fontSize: "1.2rem", // Cambiar el tamaño del texto
                fontWeight: "bold", // Hacer el texto en negrita
                // Puedes agregar más estilos aquí según tus necesidades
              }}
            >
              Información Vendedor
            </InputLabel>
            
      <TableContainer>
        <Table aria-label="simple table" sx={{ minWidth: 140 }}>
          <TableBody>
            {vendedor && (
              <>
                <TableRow>
                  <TableCell
                    sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                    component="th"
                    scope="row"
                  >
                    Nombre y Apellidos
                  </TableCell>
                  <TableCell
                    sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                    align="right"
                  >
                    {vendedor.nombre}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                    component="th"
                    scope="row"
                  >
                    Código
                  </TableCell>
                  <TableCell
                    sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                    align="right"
                  >
                    {vendedor.codigo}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                    component="th"
                    scope="row"
                  >
                    Caja
                  </TableCell>
                  <TableCell
                    sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                    align="right"
                  >
                    {vendedor.caja}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                    component="th"
                    scope="row"
                  >
                    Nº Última Operación
                  </TableCell>
                  <TableCell
                    sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                    align="right"
                  >
                    {vendedor.operacion}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                    component="th"
                    scope="row"
                  >
                    Última Boleta
                  </TableCell>
                  <TableCell
                    sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                    align="right"
                  >
                    {vendedor.boleta}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UserProfileCard;
