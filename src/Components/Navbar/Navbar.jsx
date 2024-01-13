/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Typography,
  IconButton,
  Menu,
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
    <Paper elevation={3} style={{ backgroundColor: "blue", padding: "6px" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3} sm={2} md={2}>
          <Typography variant="h4" color="white">
            EasyPOS
          </Typography>
        </Grid>
        <Grid item xs={12} sm={9} md={9}>
          {/* <ToggleButtonGroup
            value={isEstablishmentVisible ? "show" : "hide"}
            exclusive
            onChange={handleEstablishmentToggle}
          >
            <ToggleButton value="show">Mostrar Establecimiento</ToggleButton>
            <ToggleButton value="hide">Ocultar Establecimiento</ToggleButton>
          </ToggleButtonGroup> */}
          {isEstablishmentVisible && (
            <Paper elevation={3} >
              <Typography variant="h4">NOMBRE ESTABLECIMIENTO</Typography>
            </Paper>
          )}
        </Grid>
        <Grid item xs={6} sm={1} md={1}>
          <IconButton onClick={handleMenuOpen} style={{ padding: "8px" }}>
            <Settings fontSize="large" />
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
            <MenuItem onClick={() => setIsLogoutDialogOpen(true)}>Más</MenuItem>
          </Menu>
        </Grid>
        <Grid sx={{display:"flex"}} item xs={12} sm={12} md={10}>
          <Typography variant="h5">Fecha: {formattedDate}</Typography> 
          <Typography variant="h5">Hora: {formattedTime}</Typography>
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
