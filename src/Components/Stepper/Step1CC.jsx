/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Button,
  Dialog,
  Typography,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
} from "@mui/material";
 
import ModelConfig from "../../Models/ModelConfig";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ProductStepper from "../../Models/ProductStepper";
import Product from "../../Models/Product";
import { Check, Dangerous, Percent } from "@mui/icons-material";

const Step1CC = ({ data, onNext, setStepData }) => {
  const {
    userData, 
    showMessage
  } = useContext(SelectedOptionsContext);

  const apiUrl = ModelConfig.get().urlBase;

  const [categoryId, setCategoryId] = useState(0);
  const [subCategoryId, setSubCategoryId] = useState(0);
  const [familyId, setFamilyId] = useState(0);
  const [subFamilyId, setSubFamilyId] = useState(0);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);
  
  const [nombre, setNombre] = useState(data.nombre || "");
  const [marca, setMarca] = useState(data.marca || "");
  const [codigoBarras, setCodigoBarras] = useState(data.codBarra || "");
  const [descripcionCorta, setDescripcionCorta] = useState(data.DescCorta || "");
  
  const [puedeAvanzar, setPuedeAvanzar] = useState(false);
  const [codigoNoRepetido, setCodigoNoRepetido] = useState(null);

  const validateFields = (showError = true) => {

    if (codigoBarras==="") {
      if(showError)showMessage("Falta completar codigo.");
      return false;
    }

    if (categoryId == 0) {
      if(showError)showMessage("Debe seleccionar una Categoría.");
      return false;
    }
    if (subCategoryId == 0) {
      if(showError)showMessage("Debe seleccionar una Subcategoría.");
      return false;
    }
    if (familyId == 0) {
      if(showError)showMessage("Debe seleccionar una Familia.");
      return false;
    }
    if (subFamilyId == 0) {
      if(showError)showMessage("Debe seleccionar una Subfamilia.");
      return false;
    }
    if (nombre==="") {
      if(showError)showMessage("Falta completar la descricion.");
      return false;
    }

    if (!/^[a-zA-Z0-9\s]*[a-zA-Z0-9][a-zA-Z0-9\s]*$/.test(nombre.trim()) || /^\s{1,}/.test(nombre)) {
      if(showError)showMessage("Ingresar nombre válido.");
      return false;
    }

    if (descripcionCorta==="") {
      if(showError)showMessage("Falta completar la descripcion corta.");
      return false;
    }
    
    if (marca==="") {
      if(showError)showMessage("Falta completar marca.");
      return false;
    }

    if (!/^[a-zA-Z0-9\s]*[a-zA-Z0-9][a-zA-Z0-9\s]*$/.test(marca.trim()) || /^\s{1,}/.test(marca)) {
      if(showError)showMessage("Ingresar marca válida.");
      return false;
    }
    
    // Si todos los campos están llenos y se ha seleccionado al menos una opción para cada nivel, limpiar los mensajes de error
    return true;
  };
  

 

  const handleNext = () => {
    const isValid = validateFields();
    if (isValid) {
      // Resto del código para continuar si los campos son válidos
      const step1Data = {
        categoryId,
        subCategoryId,
        familyId,
        subFamilyId,
        marca,
        codBarra: codigoBarras,
        descripcionCorta,
        nombre,
      };
      ProductStepper.getInstance().sesion.guardar({
        "step1": step1Data
      })
      setStepData((prevData) => ({ ...prevData, ...step1Data }));
      onNext();
    }
  };

  const checkCodigo = ()=>{
    // console.log("checkCodigo")
    if(codigoBarras === "") return
    Product.getInstance().findByCodigoBarras({
      codigoProducto: codigoBarras
    },(prods)=>{
      // console.log(prods)
      if(prods.length>0){
        showMessage("Ya existe el codigo ingresado")
        setCodigoNoRepetido(false)
      }else{
        showMessage("Codigo correcto")
        setCodigoNoRepetido(true)
      }
    }, (err)=>{

    })
  }


  useEffect(() => {
    Product.getInstance().getCategories((cats)=>{
      setCategories(cats);
    },(err)=>{
      showMessage("No se pudo cargar categorias")
    })
  }, []);

  useEffect(() => {
    if (categoryId >0) {
      Product.getInstance().getSubCategories(categoryId,(subs)=>{
        setSubCategories(subs)
      },(err)=>{
        showMessage("No se pudo cargar subcategorias")
      })
    }
  }, [categoryId]);

  useEffect(() => {
    if (subCategoryId >0 && categoryId >0) {
      Product.getInstance().getFamiliaBySubCat({
        categoryId,subcategoryId : subCategoryId
      },(fams)=>{
        setFamilies(fams)
      },(err)=>{
        showMessage("No se pudo cargar familias")
      })
    }
  }, [categoryId, subCategoryId]);

  useEffect(() => {
      if (
        familyId >0 &&
        categoryId >0 &&
        subCategoryId >0
      ) {
        Product.getInstance().getSubFamilia({
          categoryId,subcategoryId : subCategoryId,familyId
        },(subs)=>{
          setSubFamilies(subs)
        },(erro)=>{
          showMessage("No se pudo cargar subfamilias")
        })
      }
  }, [familyId, categoryId, subCategoryId]);

  const handleKeyDown = (event, field) => {
    if (field === "nombre" ) {
      const regex = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\s]+$/;// Al menos un carácter alfanumérico
      if (
        !regex.test(event.key) &&
        event.key !== "Backspace" &&
        event.key !== " "
      ) {
        event.preventDefault();
        showMessage("El nombre no puede consistir únicamente en espacios en blanco.");
        setSnackbarOpen(true);
      }
    }
    if ( field === "marca") {
      const regex = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\s]*$/; // Al menos un carácter alfanumérico
      if (
        !regex.test(event.key) &&
        event.key !== "Backspace" &&
        event.key !== " "
      ) {
        event.preventDefault();
        showMessage("La marca no puede consistir únicamente en espacios en blanco.");
        setSnackbarOpen(true);
      }
    }
    
    if (field === "telefono") {
      if (event.key === "-" && formData.telefono === "") {
        event.preventDefault();
      }
    }
  };


  useEffect(() => {
    setPuedeAvanzar( validateFields(false) && codigoNoRepetido )
  }, [codigoBarras, 
    codigoNoRepetido,
    categoryId, 
    subCategoryId, 
    familyId, 
    subFamilyId,
    nombre,
    descripcionCorta,
    marca]);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "16px",
        width: "100%",
      }}
    >
      <Grid container spacing={2} item xs={12} md={12}>
      <Grid item xs={12} md={12}>
        <InputLabel>C&oacute;digo</InputLabel>
        <TextField
          fullWidth
          label="Ingresar c&oacute;digo"
          value={codigoBarras}
          onClick={(e) => { 
            setCodigoNoRepetido(null)
          }}
          onChange={(e) => setCodigoBarras(e.target.value)}
          onKeyDown={(event) => handleKeyDown(event, "codigoBarras")}
          onBlur={checkCodigo}

          sx={{
            paddingLeft:"10px"
          }}

          InputProps={{
            inputMode: "numeric", // Establece el modo de entrada como numérico
            pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
            startAdornment: (
              <InputAdornment position="end">
                <Check sx={{
                  color:"#06AD16",
                  display: (codigoNoRepetido && codigoBarras!="" ? "flex" : "none"),
                  marginRight:"10px"
                }} />

                <Dangerous sx={{
                  color:"#CD0606",
                  display: ( ( codigoNoRepetido !== null && codigoNoRepetido === false ) ? "flex" : "none")
                }} />
              </InputAdornment>
            ),
          }}

        />
        </Grid>


        <Grid item xs={12} md={6}>
          <InputLabel>Seleccionar Categoría</InputLabel>
          <Select
            fullWidth
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            label="Seleccionar Categoría"
          >
            <MenuItem value={0}>Sin categoría</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.idCategoria} value={category.idCategoria}>
                {category.descripcion}
              </MenuItem>
            ))}
          </Select>
        </Grid>

    

        <Grid item xs={12} md={6}>
          <InputLabel>Seleccionar Subcategoría</InputLabel>
          <Select
            fullWidth
            value={subCategoryId}
           
            onChange={(e) => setSubCategoryId(e.target.value)}
            label="Seleccionar Sub-Categoría"
          >
            <MenuItem value={0}>Sin subcategoría</MenuItem>
            {subcategories.map((subcategory) => (
              <MenuItem
                key={subcategory.idSubcategoria}
                value={subcategory.idSubcategoria}
              >
                {subcategory.descripcion}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel>Seleccionar Familia</InputLabel>
          <Select
            fullWidth
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
            label="Seleccionar Familia"
          >
            <MenuItem value={0}>Sin familia</MenuItem>
            {families.map((family) => (
              <MenuItem key={family.idFamilia} value={family.idFamilia}>
                {family.descripcion}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel>Seleccionar Subfamilia</InputLabel>
          <Select
            fullWidth
            value={subFamilyId}
            onChange={(e) => setSubFamilyId(e.target.value)}
            label="Seleccionar Subfamilia"
          >
            <MenuItem value={0}>Sin subfamilia</MenuItem>
            {subfamilies.map((subfamily) => (
              <MenuItem
                key={subfamily.idSubFamilia}
                value={subfamily.idSubFamilia}
              >
                {subfamily.descripcion}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={12}>
        <InputLabel>Descripci&oacute;n</InputLabel>
          <TextField
            fullWidth
            label="Ingresar Descripci&oacute;n"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(event) => handleKeyDown(event, "nombre")}
          />
        </Grid>

        <Grid item xs={12} md={6}>
        <InputLabel>Desc. corta</InputLabel>
          <TextField
            fullWidth
            label="Ingresar Desc. corta"
            value={descripcionCorta}
            onChange={(e) => setDescripcionCorta(e.target.value)}
            onKeyDown={(event) => handleKeyDown(event, "descripcionCorta")}
          />
        </Grid>

        <Grid item xs={12} md={6}>
        <InputLabel>Marca</InputLabel>
          <TextField
            fullWidth
            type="text"
            label="Ingresar Marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            onKeyDown={(event) => handleKeyDown(event, "marca")}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Button
              // fullWidth
              variant="contained"
              color="secondary"
              onClick={handleNext}
              disabled={!puedeAvanzar}
              sx={{
                width:"50%",
                height:"55px",
                margin: "0 25%"
              }}
            >
              Continuar
            </Button>


        </Grid>
      </Grid>

    </Paper>
  );
};

export default Step1CC;
