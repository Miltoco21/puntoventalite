/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Typography,
  IconButton,
  Menu,
  TextField,
  Chip,
  Box,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Settings } from "@mui/icons-material";

const NavBar = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isEstablishmentVisible, setIsEstablishmentVisible] = useState(true);

  useEffect(() => {
    // Update the date and time every second (1000 milliseconds)
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const formattedDate = dateTime.toLocaleDateString();
  const formattedTime = dateTime.toLocaleTimeString();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Implement your logout logic here
    // For example, you can clear user session and redirect to the login page
    console.log("Logging out...");
    // Replace the following line with your actual logout logic
    // logout();
  };

  const handleEstablishmentToggle = (event, newValue) => {
    setIsEstablishmentVisible(newValue === "show");
  };

  return (
    <Paper
      elevation={3}
      style={{ backgroundColor: "#283048", padding: "1px", marginTop: "2px" }}
    >
      <Grid container item xs={12}>
        <Grid item xs={12} sx={{ display: "flex" }}>
          <Grid item xs={3} sm={2} md={2} sx={{ marginTop: "6px" }}>
            <Box variant="h5" color="white">
              EasyPOS
            </Box>
          </Grid>
          <Grid item xs={8} sm={9} md={9}>
            <Chip
              label="Establecimiento"
              sx={{
                marginTop: "6px",
                borderRadius: "6px",
                backgroundColor: "white",
                width: "90%",
              }}
            >
              {" "}
              ESTABLECIMIENTO
            </Chip>
          </Grid>
          <Grid item xs={2} sm={2} md={1}>
            <IconButton onClick={handleMenuOpen} style={{ padding: "8px" }}>
              <Settings fontSize="medium" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => setIsLogoutDialogOpen(true)}>
                Cerrar sesión
              </MenuItem>
              <MenuItem onClick={() => setIsLogoutDialogOpen(true)}>
                Configuración
              </MenuItem>
              <MenuItem onClick={() => setIsLogoutDialogOpen(true)}>
                Más
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={10}
          sx={{ display: "flex", margin: "1%", justifyContent: "center" }}
        >
          <Grid item xs={6} sm={6}>
            <Typography
              sx={{
                width: "100%",
                color: "white",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Fecha: {formattedDate}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6}>
            {" "}
            <Typography
              sx={{
                width: "100%",
                color: "white",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {" "}
              Hora: {formattedTime}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
      >
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsLogoutDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default NavBar;
