/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  Button,
  DialogContent,
  Dialog,
  Table,
  TableBody,
  TableCell,
  Autocomplete,
  TableContainer,
  TableHead,
  DialogActions,
  DialogTitle,
  TableRow,
  Snackbar,
  MenuItem,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import MuiAlert from "@mui/material/Alert";

import axios from "axios";

const apiUrl =
  "https://www.easyposdev.somee.com/api/Clientes/AddClienteCliente";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const IngresoClientes = () => {
  const [formData, setFormData] = useState({
    rut: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    region:"",
    correo: "",
    giro: "",
    urlPagina: "",
    formaPago: "",
    usaCuentaCorriente: 0,
    fechaIngreso: new Date().toISOString(),
    fechaUltAct: new Date().toISOString(),
    bajaLogica: true,
    clientesSucursalAdd: {
      rutResponsable: "",
      nombreResponsable: "",
      apellidoResponsable: "",
      direccion: "",
      telefono: "",
      region: "",
      comuna: "",
      correo: "",
      giro: "",
      urlPagina: "",
      formaPago: "",
      usaCuentaCorriente: 0,
      fechaIngreso: new Date().toISOString(),
      fechaUltAct: new Date().toISOString(),
      bajaLogica: true,
    },
  });
  const [openDialog, setOpenDialog] = useState(false);
 
  const [dialogMessage, setDialogMessage] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedComuna, setSelectedComuna] = useState(null);
  const [selectedSucursalRegion, setSelectedSucursalRegion] = useState(null);
  const [selectedSucursalComuna, setSelectedSucursalComuna] = useState(null);

  const [regionOptions, setRegionOptions] = useState([]);
  const [comunaOptions, setComunaOptions] = useState([]);
  const [sucursalRegionOptions, setSucursalRegionOptions] = useState([]);
  const [sucursalComunaOptions, setSucursalComunaOptions] = useState([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/RegionComuna/GetAllRegiones"
        );
        setRegionOptions(response.data.regiones);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRegions();
  }, []);

  useEffect(() => {
    const fetchComunas = async () => {
      if (selectedRegion) {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/RegionComuna/GetComunaByIDRegion?IdRegion=${selectedRegion}`
          );
          setComunaOptions(response.data.comunas.map((comuna) => comuna.comunaNombre));
        } catch (error) {
          console.error(error);
        }
      }
    };
  
    fetchComunas();
  }, [selectedRegion]);

  useEffect(() => {
    const fetchSucursalRegions = async () => {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/RegionComuna/GetAllRegiones"
        );

        setSucursalRegionOptions(response.data.regiones);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSucursalRegions();
  }, []);

  useEffect(() => {
    const fetchSucursalComunas = async () => {
      if (selectedSucursalRegion) {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/RegionComuna/GetComunaByIDRegion?IdRegion=${selectedSucursalRegion}`
          );
          setSucursalComunaOptions(response.data.comunas.map((comuna) => comuna.comunaNombre));
        } catch (error) {
          console.error(error);
        }
      }
    };
  
    fetchSucursalComunas();
  }, [selectedSucursalRegion]);
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const updateNestedField = (field, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      let currentLevel = updatedData;
  
      const fieldArray = field.split('.');
      for (let i = 0; i < fieldArray.length - 1; i++) {
        currentLevel[fieldArray[i]] = { ...currentLevel[fieldArray[i]] };
        currentLevel = currentLevel[fieldArray[i]];
      }
  
      currentLevel[fieldArray[fieldArray.length - 1]] = value;
  
      return updatedData;
    });
  };
  const handleNestedInputChange = (e, nestedFields) => {
    const { name, value } = e.target;
    updateNestedField(nestedFields, value);
  };
  
  

  
  const handleSubmit = async () => {
    const formDataToSend = {
      ...formData,
      region: String(formData.region),
      comuna: String(formData.comuna),
      clientesSucursalAdd: {
        ...formData.clientesSucursalAdd,
        region: String(formData.clientesSucursalAdd.region),
        comuna: String(formData.clientesSucursalAdd.comuna),
      },


    };
    console.log("Form Data before submission:", formDataToSend);
  
    try {
      const response = await axios.post(apiUrl, formDataToSend);
      if (response.status === 200) {
        const responseData = response.data;
        console.log("Form Data after submission:", responseData);
  
        if (responseData ) {
          alert("Operación exitosa");
          // setOpenSnackbar(true);
          // Puedes hacer más cosas en caso de éxito, como limpiar el formulario
        } else {
          setSnackbarMessage("Error en la operación");
          setOpenSnackbar(true);
        }
      } else {
        setSnackbarMessage("Error en la operación");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("API Request Error:", error);
      setSnackbarMessage("Error en la operación");
      setOpenSnackbar(true);
    }
  };
  

  const handleDialogClose = () => {
    setOpenDialog(false);
  };


  return (
    <Paper>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Rut"
            name="rut"
            fullWidth
            value={formData.rut}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre"
            name="nombre"
            fullWidth
            value={formData.nombre}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Apellido"
            name="apellido"
            fullWidth
            value={formData.apellido}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Dirección"
            name="direccion"
            fullWidth
            value={formData.direccion}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Teléfono"
            name="telefono"
            fullWidth
            value={formData.telefono}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            sx={{ marginTop: 2 }}
            fullWidth
            id="region"
            select
            label="Región"
            value={selectedRegion}
            onChange={(e) => {
              const regionID = e.target.value;
              setSelectedRegion(regionID);
              // Actualizar el valor en formData
              setFormData((prevFormData) => ({
                ...prevFormData,
                region: regionID,
              }));
            }}
          
          >
            {regionOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.regionNombre}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            sx={{ marginTop: 2 }}
            id="comuna"
            select
            fullWidth
            label="Comuna"
            value={selectedComuna}
            onChange={(e) => {
              const comunaValue = e.target.value;
              setSelectedComuna(comunaValue);
              // Actualizar el valor en formData.comuna (sin sucursal)
              setFormData((prevFormData) => ({
                ...prevFormData,
                comuna: comunaValue,
              }));
            }}
          >
            {comunaOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Correo"
            name="correo"
            fullWidth
            value={formData.correo}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Giro"
            name="giro"
            fullWidth
            value={formData.giro}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="URL Página"
            name="urlPagina"
            fullWidth
            value={formData.urlPagina}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Forma de Pago"
            name="formaPago"
            fullWidth
            value={formData.formaPago}
            onChange={handleInputChange}
          />
        </Grid>
        {/* Campos de clientesSucursalAdd */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Rut Responsable"
            name="clientesSucursalAdd.rutResponsable"
            fullWidth
            value={formData.clientesSucursalAdd.rutResponsable}
            onChange={(e) =>
              handleNestedInputChange(e, "clientesSucursalAdd.rutResponsable")
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre Responsable"
            name="clientesSucursalAdd.nombreResponsable"
            fullWidth
            value={formData.clientesSucursalAdd.nombreResponsable}
            onChange={(e) =>
              handleNestedInputChange(
                e,
                "clientesSucursalAdd.nombreResponsable"
              )
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Apellido Responsable"
            name="clientesSucursalAdd.apellidoResponsable"
            fullWidth
            value={formData.clientesSucursalAdd.apellidoResponsable}
            onChange={(e) =>
              handleNestedInputChange(
                e,
                "clientesSucursalAdd.apellidoResponsable"
              )
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Dirección Sucursal"
            name="clientesSucursalAdd.direccion"
            fullWidth
            value={formData.clientesSucursalAdd.direccion}
            onChange={(e) =>
              handleNestedInputChange(e, "clientesSucursalAdd.direccion")
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Teléfono Sucursal"
            name="clientesSucursalAdd.telefono"
            fullWidth
            value={formData.clientesSucursalAdd.telefono}
            onChange={(e) =>
              handleNestedInputChange(e, "clientesSucursalAdd.telefono")
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            sx={{ marginTop: 2 }}
            fullWidth
            id="sucursalRegion"
            select
            label="Región Sucursal"
            value={selectedSucursalRegion}
            // value={formData.clientesSucursalAdd.region}
            onChange={(e) => {
              const regionIDSucursal = e.target.value;
              setSelectedSucursalRegion(regionIDSucursal);
              // Actualizar el valor en formData.clientesSucursalAdd.region
              updateNestedField("clientesSucursalAdd.region", regionIDSucursal);
            }}
          >
            {sucursalRegionOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.regionNombre}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            sx={{ marginTop: 2 }}
            id="sucursalComuna"
            select
            fullWidth
            label="Comuna Sucursal"
            value={selectedSucursalComuna}
            // value={formData.clientesSucursalAdd.comuna}
            onChange={(e) => {
              const comunaValueSucursal = e.target.value;
              setSelectedSucursalComuna(comunaValueSucursal);
              // Actualizar el valor en formData.clientesSucursalAdd.comuna
              updateNestedField("clientesSucursalAdd.comuna", comunaValueSucursal);
            }}
          
          >
            {sucursalComunaOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Correo Sucursal"
            name="clientesSucursalAdd.correo"
            fullWidth
            value={formData.clientesSucursalAdd.correo}
            onChange={(e) =>
              handleNestedInputChange(e, "clientesSucursalAdd.correo")
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Giro Sucursal"
            name="clientesSucursalAdd.giro"
            fullWidth
            value={formData.clientesSucursalAdd.giro}
            onChange={(e) =>
              handleNestedInputChange(e, "clientesSucursalAdd.giro")
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="URL Página Sucursal"
            name="clientesSucursalAdd.urlPagina"
            fullWidth
            value={formData.clientesSucursalAdd.urlPagina}
            onChange={(e) =>
              handleNestedInputChange(e, "clientesSucursalAdd.urlPagina")
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Forma de Pago Sucursal"
            name="clientesSucursalAdd.formaPago"
            fullWidth
            value={formData.clientesSucursalAdd.formaPago}
            onChange={(e) =>
              handleNestedInputChange(e, "clientesSucursalAdd.formaPago")
            }
          />
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <TextField
            label="Usa Cuenta Corriente Sucursal"
            name="clientesSucursalAdd.usaCuentaCorriente"
            fullWidth
            value={formData.clientesSucursalAdd.usaCuentaCorriente}
            onChange={(e) => handleNestedInputChange(e, 'clientesSucursalAdd.usaCuentaCorriente')}

          />
        </Grid> */}
        {/* <Grid item xs={12} sm={6}>
          <TextField
            label="Fecha de Ingreso Sucursal"
            name="clientesSucursalAdd.fechaIngreso"
            fullWidth
            value={formData.clientesSucursalAdd.fechaIngreso}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Fecha de Última Act. Sucursal"
            name="clientesSucursalAdd.fechaUltAct"
            fullWidth
            value={formData.clientesSucursalAdd.fechaUltAct}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Baja Lógica Sucursal"
            name="clientesSucursalAdd.bajaLogica"
            fullWidth
            value={formData.clientesSucursalAdd.bajaLogica}
            onChange={handleInputChange}
          />
        </Grid> */}

        {/* <Grid item xs={12} sm={6}>
        <TextField label="Usa Cuenta Corriente" name="usaCuentaCorriente" fullWidth value={formData.usaCuentaCorriente} onChange={handleInputChange} />
      </Grid> */}
        {/* <Grid item xs={12} sm={6}>
        <TextField label="Fecha de Ingreso" name="fechaIngreso" fullWidth value={formData.fechaIngreso} onChange={handleInputChange} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Fecha de Última Act." name="fechaUltAct" fullWidth value={formData.fechaUltAct} onChange={handleInputChange} />
      </Grid> */}
        {/* <Grid item xs={12} sm={6}>
        <TextField label="Baja Lógica" name="bajaLogica" fullWidth value={formData.bajaLogica} onChange={handleInputChange} />
      </Grid> */}
        {/* Agrega más campos según tus necesidades */}

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Enviar
          </Button>
        </Grid>

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Resultado de la Operación</DialogTitle>
          <DialogContent>
            <Typography>{dialogMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

      </Grid>
    </Paper>
  );
};

export default IngresoClientes;
