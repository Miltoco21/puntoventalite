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
  Tab,
  Tabs,
  Card,
  CardActions,
  CardContent,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
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
import BuscadorClientes from "./BuscadorClientes";

import MuiAlert from "@mui/material/Alert";

import axios from "axios";

const apiUrl = "https://www.easyposdev.somee.com/api/Clientes/AddCliente";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const IngresoClientes = ({onClose}) => {
  const validarRutChileno = (rut) => {
    // Expresión regular para validar RUT chileno
    const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/;

    // Comprobar si el RUT cumple con el formato
    return rutRegex.test(rut);
  };

  const [formData, setFormData] = useState({
    rut: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    region: "",
    comuna: "",
    correo: "",
    giro: "",
    urlPagina: "",
    formaPago: "",
    razonSocial: "",
    usaCuentaCorriente: 0,
    // fechaIngreso: new Date().toISOString(),
    // fechaUltAct: new Date().toISOString(),
    // bajaLogica: true,
    // clientesSucursalAdd: [
    //   {
    //     rutResponsable: "",
    //     nombreResponsable: "",
    //     apellidoResponsable: "",
    //     direccion: "",
    //     telefono: "",
    //     region: "",
    //     comuna: "",
    //     correo: "",
    //     giro: "",
    //     urlPagina: "",
    //     formaPago: "",
    //     razonSocial: "",
    //     usaCuentaCorriente: 0,
    //     // fechaIngreso: new Date().toISOString(),
    //     // fechaUltAct: new Date().toISOString(),
    //     // bajaLogica: true,
    //   },
    // ],
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedComuna, setSelectedComuna] = useState("");
  const [selectedSucursalRegion, setSelectedSucursalRegion] = useState("");
  const [selectedSucursalComuna, setSelectedSucursalComuna] = useState("");

  const [regionOptions, setRegionOptions] = useState([]);
  const [comunaOptions, setComunaOptions] = useState([]);
  const [sucursalRegionOptions, setSucursalRegionOptions] = useState([]);
  const [sucursalComunaOptions, setSucursalComunaOptions] = useState([]);

  const [selectedTab, setSelectedTab] = useState(0);

  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  const [errorMessage, setErrorMessage] = useState("");

  const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/;

  const [branchData, setBranchData] = useState({
    codigoCliente: 0,
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
    razonSocial: "",
    usaCuentaCorriente: 0,
    // Add other branch data fields
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/Clientes/GetAllClientes"
        );
        setCustomers(response.data.cliente);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOpenModal = (customerId) => {
    setSelectedCustomerId(customerId);
    setBranchData({
      ...branchData,
      codigoCliente: customerId,
    });
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleAddBranch = async () => {
    try {
      console.log("Before formatting:", branchData);

      // Format branch data according to the URL schema
      const formattedBranchData = {
        codigoCliente: branchData.codigoCliente,
        rutResponsable: branchData.rutResponsable,
        nombreResponsable: branchData.nombreResponsable,
        apellidoResponsable: branchData.apellidoResponsable,
        direccion: branchData.direccion,
        telefono: branchData.telefono,
        region: branchData.region,
        comuna: branchData.comuna,
        correo: branchData.correo,
        giro: branchData.giro,
        razonSocial: branchData.razonSocial,
        urlPagina: branchData.urlPagina,
        formaPago: branchData.formaPago,
        usaCuentaCorriente: branchData.usaCuentaCorriente,
      };

      console.log("After formatting:", formattedBranchData);

      // Make API request to add branch using formattedBranchData
      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/Clientes/AddClienteSucursal",
        formattedBranchData
      );
      console.log("Response:", response.data);

      // Close the modal and update data
      setOpenModal(false);
      const fetchResponse = await axios.get(
        "https://www.easyposdev.somee.com/api/Clientes/GetAllClientes"
      );
      setCustomers(fetchResponse.data.cliente);
    } catch (error) {
      console.error("Error adding branch:", error);
    }
  };

  const handleBranchDataChange = (event) => {
    setBranchData({
      ...branchData,
      [event.target.name]: event.target.value,
    });
  };

  /////////Buscador////////
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  ///////////Fin Buscador///////
  /////////sucursalClientes////////////

  const filteredCustomers = customers.filter((customer) => {
    if (customer) {
      const { nombre, apellido, rut, codigoCliente } = customer;
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        nombre.toLowerCase().includes(lowerSearchTerm) ||
        apellido.toLowerCase().includes(lowerSearchTerm) ||
        rut.toLowerCase().includes(lowerSearchTerm) ||
        codigoCliente.toString().includes(lowerSearchTerm)
      );
    }
    return false; // or handle the case when customer is null or undefined
  });

  //////////fin suursalcleinte///////////



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
          setComunaOptions(
            response.data.comunas.map((comuna) => comuna.comunaNombre)
          );
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
          setSucursalComunaOptions(
            response.data.comunas.map((comuna) => comuna.comunaNombre)
          );
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
  const handleSubmit = async () => {
    try {
      if (!validarRutChileno(formData.rut)) {
        setErrorMessage("Por favor ingresa un RUT válido.");
        return;
      }

      const emptyFields = Object.entries(formData)
        .filter(([key, value]) => value === "")
        .map(([key]) => key);

      if (emptyFields.length > 0) {
        const emptyField = emptyFields[0];
        setErrorMessage(
          `El campo ${emptyField} está vacío. Por favor completa todos los campos antes de enviar el formulario.`
        );
        return;
      } else {
        setErrorMessage("");
      }

      const formDataToSend = {
        ...formData,
        rut: String(formData.rut),
        region: String(formData.region),
        comuna: String(formData.comuna),
      };
      console.log("Form Data antes de submit:", formDataToSend);

      const response = await axios.post(apiUrl, formDataToSend);
      console.log(
        "Propiedad 'cliente' en la respuesta:",
        response.data.cliente
      );
      if (response.status === 200) {
        const responseData = response.data;
        console.log("Form Data after submission:", responseData);

        if (responseData) {
          setSnackbarMessage("Cliente generado exitosamente");
          setOpenSnackbar(true);
          setTimeout(() => {
            
            onClose(); ////Cierre Modal al finalizar
          }, 3000);
          
        } else {
          setSnackbarMessage("Error en la operación");
          setOpenSnackbar(true);
        }
      } else {
        setSnackbarMessage("Error en la operación");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setSnackbarMessage("Error en la operación");
      setOpenSnackbar(true);
    }
  };

  // const handleSubmit = async () => {
  //   if (!validarRutChileno(formData.rut)) {
  //     setErrorMessage("Por favor ingresa un RUT válido.");
  //     return;
  //   }

  //   const emptyFields = Object.entries(formData)
  //     .filter(([key, value]) => value === "")
  //     .map(([key]) => key);

  //   if (emptyFields.length > 0) {
  //     const emptyField = emptyFields[0]; // Tomamos el primer campo vacío
  //     setErrorMessage(
  //       `El campo ${emptyField} está vacío. Por favor completa todos los campos antes de enviar el formulario.`
  //     );
  //     return;
  //   } else {
  //     setErrorMessage("");
  //   }

  //   const formDataToSend = {
  //     ...formData,
  //     rut: String(formData.rut),
  //     region: String(formData.region),
  //     comuna: String(formData.comuna),
  //   };
  //   console.log("Form Data before submission:", formDataToSend);

  //   try {
  //     const response = await axios.post(apiUrl, formDataToSend);
  //     if (response.status === 200) {
  //       const responseData = response.data;
  //       console.log("Form Data after submission:", responseData);

  //       if (responseData) {
  //         setSnackbarMessage(responseData.descripcion);
  //         setOpenSnackbar(true);
  //       } else {
  //         setSnackbarMessage("Error en la operación");
  //         setOpenSnackbar(true);
  //       }
  //     } else {
  //       setSnackbarMessage("Error en la operación");
  //       setOpenSnackbar(true);
  //     }
  //   } catch (error) {
  //     console.error("API Request Error:", error);
  //     setSnackbarMessage("Error en la operación");
  //     setOpenSnackbar(true);
  //   }
  // };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  //////Manejo de sucursales//////

  // const [sucursalData, setSucursalData] = useState(null);
  const [selectedBranchData, setSelectedBranchData] = useState({});

  const handleShowBranch = async (codigoCliente) => {
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/Clientes/GetClientesSucursalByCodigoCliente?codigocliente=${codigoCliente}`
      );

      const sucursales = response.data.clienteSucursal;
      setSelectedBranchData({
        ...selectedBranchData,
        [codigoCliente]: sucursales,
      });

      toggleBranchDetails(codigoCliente);
    } catch (error) {
      console.error("Error al obtener los datos de la sucursal:", error);
      // Manejar errores, por ejemplo, mostrar un mensaje al usuario.
    }
  };
  ///////////togle resultados/////
  const [showResults, setShowResults] = useState(false);
  //////deatleas mostara surscal button///
  const [showDetails, setShowDetails] = useState(false);
  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleToggleResults = () => {
    setShowResults(!showResults);
  };

  ///Manejo de toglesursal////////
  const [showBranchDetails, setShowBranchDetails] = useState({});

  const toggleBranchDetails = (customerId) => {
    setShowBranchDetails((prevState) => ({
      ...prevState,
      [customerId]: !prevState[customerId], // Invierte el estado anterior
    }));
  };
  return (
    <Paper>
      <Grid container item xs={12} sm={11} md={10} lg={12} spacing={2}>
        <Tabs
          sx={{ margin: "auto" }}
          centered
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Crear Cliente" />
          <Tab label="Ver Clientes" />
        </Tabs>

        {selectedTab === 0 && (
          <Grid
            container
            sx={{ margin: "auto", display: "flex", justifyContent: "center" }}
            item
            xs={12}
            sm={11}
            md={10}
            lg={8}
            spacing={2}
          >
            {errorMessage && <p style={{ color: "red" }}> {errorMessage}</p>}
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                label="Rut"
                name="rut"
                fullWidth
                value={formData.rut}
                onChange={handleInputChange}
                inputProps={{
                  inputMode: "numeric", // textEstablece el modo de entrada como numérico
                  pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
                }}
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
                inputProps={{
                  inputMode: "numeric", // Establece el modo de entrada como numérico
                  pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
                }}
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
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Razón Social"
                name="razonSocial"
                value={formData.razonSocial}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item sx={{ marginBottom: "10px" }} xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Enviar
              </Button>
            </Grid>
          </Grid>
        )}

        {selectedTab === 1 && (
          <Grid
            container
            sx={{ margin: "auto" }}
            item
            xs={12}
            sm={11}
            md={12}
            lg={12}
            xl={12}
            spacing={2}
          >
            <Grid item xs={12} sm={6} md={12} lg={12}>
              <Paper>
                <Grid
                  container
                  spacing={2}
                  itemlg={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <div>
                    <Grid item lg={10}>
                      <TextField
                        label="Buscar cliente..."
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        margin="dense"
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid container spacing={2}>
                      {filteredCustomers.map((customer) => (
                        <Grid
                          item
                          sx={{ display: "flex", justifyContent: "center" }}
                          xs={12}
                          sm={6}
                          md={4}
                          lg={6}
                          key={customer.codigoCliente}
                        >
                          <Card
                            sx={{
                              margin: "5px",
                              background: "rgb(174,238,229)",
                              backgroundImage:
                                "radial-gradient(linear, rgba(174,238,229,1) 33%, rgba(238, 174, 202, 1) 100%)",
                            }}
                          >
                            <CardContent>
                              <Typography variant="h7" component="h4">
                                ID Cliente: {customer.codigoCliente}
                              </Typography>
                              <Typography variant="body1" component="p">
                                Nombre: {customer.nombre} {customer.apellido}
                                <br /> <hr />
                                Rut: {customer.rut}
                                <br />
                                <hr />
                                Dirección:{customer.direccion},<br />
                                {customer.comuna}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Button
                                size="small"
                                color="primary"
                                variant="contained"
                                onClick={() =>
                                  handleOpenModal(customer.codigoCliente)
                                }
                              >
                                Agregar Sucursal
                              </Button>
                              <Button
                                size="small"
                                color="primary"
                                variant="contained"
                                onClick={() =>
                                  handleShowBranch(customer.codigoCliente)
                                }
                              >
                                {/* Cambiar el texto del botón según si se están mostrando o no los detalles */}
                                {showBranchDetails[customer.codigoCliente]
                                  ? "Ocultar Sucursal"
                                  : "Mostrar Sucursal"}
                              </Button>
                            </CardActions>
                            {selectedBranchData[customer.codigoCliente] &&
                              selectedBranchData[customer.codigoCliente].map(
                                (sucursal, index) => (
                                  <Card
                                    key={index}
                                    sx={{ margin: "10px", padding: "10px" }}
                                  >
                                    <CardContent>
                                      <Typography variant="h6" component="h2">
                                        Sucursal : {index + 1}
                                      </Typography>

                                      {/* Agregar otros campos según sea necesario */}
                                    </CardContent>
                                    <CardActions>
                                      <Button
                                        size="small"
                                        color="primary"
                                        onClick={() =>
                                          setShowDetails(!showDetails)
                                        }
                                      >
                                        {showDetails
                                          ? "Ocultar Detalles"
                                          : "Mostrar Detalles"}
                                      </Button>
                                    </CardActions>
                                    {showDetails && (
                                      <CardContent>
                                        <Typography
                                          variant="body1"
                                          component="p"
                                        >
                                          Responsable:{" "}
                                          {sucursal.nombreResponsable}
                                        </Typography>
                                        <Typography
                                          variant="body1"
                                          component="p"
                                        >
                                          Apellido Responsable:{" "}
                                          {sucursal.apellidoResponsable}
                                        </Typography>
                                        <Typography
                                          variant="body1"
                                          component="p"
                                        >
                                          Dirección: {sucursal.direccion}
                                        </Typography>
                                        {/* Otros detalles específicos de la sucursal */}
                                      </CardContent>
                                    )}
                                  </Card>
                                )
                              )}
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                </Grid>
              </Paper>

              {/* Add Branch Modal */}
              <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>
                  Ingresa Sucursal {selectedCustomerId}{" "}
                </DialogTitle>
                <DialogContent>
                  {/* Add form fields for branch data */}
                  <TextField
                    label="RUT Responsable"
                    name="rutResponsable"
                    margin="dense"
                    value={branchData.rutResponsable}
                    onChange={handleBranchDataChange}
                    inputProps={{
                      inputMode: "numeric", // Establece el modo de entrada como numérico
                      pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
                    }}
                  />
                  <TextField
                    label="Nombre Responsable"
                    name="nombreResponsable"
                    margin="dense"
                    value={branchData.nombreResponsable}
                    onChange={handleBranchDataChange}
                  />
                  <TextField
                    label="Apellido Responsable"
                    name="apellidoResponsable"
                    margin="dense"
                    value={branchData.apellidoResponsable}
                    onChange={handleBranchDataChange}
                  />
                  <TextField
                    label="Dirección"
                    name="direccion"
                    margin="dense"
                    value={branchData.direccion}
                    onChange={handleBranchDataChange}
                  />
                  <TextField
                    margin="dense"
                    label="Teléfono"
                    name="telefono"
                    value={branchData.telefono}
                    onChange={handleBranchDataChange}
                    inputProps={{
                      inputMode: "numeric", // Establece el modo de entrada como numérico
                      pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
                    }}
                  />
                  <TextField
                    margin="dense"
                    label="Giro"
                    name="giro"
                    value={branchData.giro}
                    onChange={handleBranchDataChange}
                  />
                  <TextField
                    margin="dense"
                    label="urlPagina"
                    name="urlPagina"
                    value={branchData.urlPagina}
                    onChange={handleBranchDataChange}
                  />
                  <TextField
                    margin="dense"
                    id="region"
                    fullWidth
                    select
                    label="Región"
                    name="region"
                    value={branchData.region}
                    onChange={(e) => {
                      const regionID = e.target.value;
                      handleBranchDataChange(e); // Usamos el mismo controlador de cambio
                      console.log("Región seleccionada:", regionID); // Imprimir en consola
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
                  <TextField
                    sx={{ marginTop: 2 }}
                    id="comuna"
                    select
                    fullWidth
                    label="Comuna"
                    name="comuna"
                    value={branchData.comuna}
                    onChange={(e) => {
                      const comunaValue = e.target.value;
                      handleBranchDataChange(e); // Usamos el mismo controlador de cambio
                      console.log("Comuna seleccionada:", comunaValue); // Imprimir en consola
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
                  <TextField
                    margin="dense"
                    label="Forma de Pago"
                    name="formaPago"
                    value={branchData.formaPago}
                    onChange={handleBranchDataChange}
                  />

                  {/* Add other form fields based on your branch data */}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal} color="primary">
                    Cerrar
                  </Button>
                  <Button
                    onClick={handleAddBranch}
                    variant="contained"
                    color="primary"
                  >
                    Agregar Sucursal
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>

            {/* Aquí mostrar sucursales seleccionadas */}
          </Grid>
        )}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          // onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Grid>
    </Paper>
  );
};

export default IngresoClientes;
