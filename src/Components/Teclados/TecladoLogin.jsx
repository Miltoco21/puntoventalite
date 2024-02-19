import React, { useState,useContext } from "react";
import { TextField, Button, Container, Typography, Box, Grid } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider"


const Login = () => {
  const [rutOrCode, setRutOrCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [activeInput, setActiveInput] = useState("rutOrCode");
  
  const navigate = useNavigate();

  const { updateUserData } = useContext(SelectedOptionsContext);

  const handleLogin = async () => {
    try {
      if (!rutOrCode || !password) {
        setError("Por favor, completa ambos campos.");
        return;
      }

      const response = await axios.post(
        "https://www.easyposdev.somee.com/Usuarios/LoginUsuario",
        {
          codigoUsuario: 0,
          rut: rutOrCode,
          clave: password,
        }
      );
      console.log("Respuesta del servidor:", response.data.responseUsuario);

      if (response.data.responseUsuario) {
        // Actualizar userData después del inicio de sesión exitoso
        updateUserData(response.data.responseUsuario);

        // Redirigir a la página de inicio
        navigate("/home");
      } else {
        setError("Error de inicio de sesión. Verifica tus credenciales.");
      }
    } catch (error) {
      setError("Error de inicio de sesión. Verifica tus credenciales.");
    }
  };
  const handleNumberClick = (number) => {
    if (activeInput === "rutOrCode") {
      setRutOrCode((prevRutOrCode) => prevRutOrCode + number);
    } else {
      setPassword((prevPassword) => prevPassword + number);
    }
  };

  const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Iniciar sesión
        </Typography>
        {error && (
          <Typography sx={{ color: "red", marginTop: 2 }}>{error}</Typography>
        )}
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Código o Rut"
            autoFocus
            value={rutOrCode}
            onFocus={() => setActiveInput("rutOrCode")}
            onChange={(e) => setRutOrCode(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Clave"
            type="password"
            value={password}
            onFocus={() => setActiveInput("password")}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Grid container justifyContent="center" spacing={1} sx={{ mt: 2 }}>
            {numbers.map((number) => (
              <Grid item xs={4} lg={3} key={number}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleNumberClick(number)}
                >
                  {number}
                </Button>
              </Grid>
            ))}
          </Grid>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
          >
            Iniciar sesión
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
