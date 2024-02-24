/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext } from "react";
import {
  Paper,
  Grid,
  Button,
  TextField,
  ListItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Container,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Slider,
  Dialog,
  DialogContent,
} from "@mui/material";
import axios from "axios";
const BoxBuscador = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/Clientes/GetClientesByNombreApellido?nombreApellido=${searchText}`
      );
      console.log(" resultado busqueda", response.data.clienteSucursal);
      if (Array.isArray(response.data.clienteSucursal)) {
        setSearchResults(response.data.clienteSucursal);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setSearchResults([]);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchText(inputValue);
    if (inputValue.trim() === "") {
      setSearchResults([]);
    
    }
  };

  return (
    <Paper elevation={13} sx={{ marginBottom: "3px" }}>
      <TextField
        label="Buscar"
        value={searchText}
        onChange={handleInputChange}

      />
      <Button variant="contained" onClick={handleSearch}>
        Buscar
      </Button>
      <TableContainer>
  <ul style={{ display: "flex" }}>
    {Array.isArray(searchResults) && searchText.trim() !== "" &&
      searchResults.map((result) => (
        <ListItem key={result.id}>
          <Chip
            sx={{ display: "flex", margin: "auto" }}
            label={
              <div style={{ margin: "2px", padding: "13px" }}>
                {result.nombreResponsable} {result.apellidoResponsable}
              </div>
            }
          />
        </ListItem>
      ))}
  </ul>
</TableContainer>
    </Paper>
  );
};

export default BoxBuscador;
