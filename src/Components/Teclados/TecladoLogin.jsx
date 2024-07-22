import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import axios from "axios";

const Login = () => {
  const [rutOrCode, setRutOrCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [activeInput, setActiveInput] = useState("rutOrCode");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { updateUserData } = useContext(SelectedOptionsContext);

  const saveSessionData = (userData) => {
    sessionStorage.setItem('userData', JSON.stringify(userData));
  };

  const apiUrl = import.meta.env.VITE_URL_API2;

  const handleLogin = async () => {
    try {
      if (!rutOrCode || !password) {
        setError("Por favor, completa ambos campos.");
        return;
      }
      setLoading(true);

      console.log("Datos antes de enviar el formulario:", { rutOrCode, password });

      const response = await axios.post(
        `${apiUrl}/Usuarios/LoginUsuario`,
        {
          codigoUsuario: 0,
          rut: rutOrCode,
          clave: password,
        }
      );

      console.log("Respuesta del servidor:", response.data);

      if (response.data.responseUsuario) {
        const userData = response.data.responseUsuario;

        // Guardar los datos del usuario en sessionStorage
        saveSessionData(userData);

        // Actualizar userData después del inicio de sesión exitoso
        updateUserData(userData);

        // Redirigir a la página de inicio
        navigate("/home");
      } else {
        setError("Error de inicio de sesión. Verifica tus credenciales.");
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
      if (error.response) {
        setError(
          "Credenciales incorrectas. Por favor, verifica tu nombre de usuario y contraseña." + error.message
        );
      } else if (error.response && error.response.status === 500) {
        setError("Error interno del servidor. Por favor, inténtalo de nuevo más tarde.");
      } else {
        setError("Error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleNumberClick = (number) => {
    if (activeInput === "rutOrCode") {
      setRutOrCode((prevRutOrCode) => prevRutOrCode + number);
    } else {
      setPassword((prevPassword) => prevPassword + number);
    }
  };

  const handleClearAll = () => {
    setRutOrCode("");
    setPassword("");
  };

  const handleDeleteLastCharacter = () => {
    if (activeInput === "rutOrCode") {
      setRutOrCode((prevRutOrCode) => prevRutOrCode.slice(0, -1));
    } else {
      setPassword((prevPassword) => prevPassword.slice(0, -1));
    }
  };

  const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, "-"];

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
            inputProps={{
              inputMode: "decimal",
              pattern: "[0-9]*"
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Clave"
            type={showPassword ? "text" : "password"}
            value={password}
            onFocus={() => setActiveInput("password")}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*"
            }}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress color="inherit" size={20} sx={{ marginRight: 1 }} />
                Ingresando
              </Box>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
