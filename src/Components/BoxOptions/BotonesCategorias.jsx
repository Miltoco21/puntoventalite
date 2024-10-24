import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Grid,
  Snackbar,
  Alert,
  Breadcrumbs,
  Typography,
} from "@mui/material";
import axios from "axios";
import { estilosBoton } from "../Botones/estilosBotones"; // Estilos
import NavigateNextIcon from "@mui/icons-material/NavigateNext"; // Icono para breadcrumbs
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const BASE_API_URL = import.meta.env.VITE_URL_API2;

const BotonesCategorias = ({ openDialog, onClose, onPreviousStep }) => {
  const {
    // userData,
    // salesData,
    addToSalesData,
    // setPrecioData,
    // grandTotal,
    // ventaData,
    // setVentaData,
    // searchResults,
    // setSearchResults,
    // updateSearchResults,
    // selectedUser,
    // setSelectedUser,
    // selectedCodigoCliente,
    // setSelectedCodigoCliente,
    // selectedCodigoClienteSucursal,
    // setSelectedCodigoClienteSucursal,
    // setSelectedChipIndex,
    // selectedChipIndex,
    // searchText,
    // setSearchText,
    // clearSalesData,
  } = useContext(SelectedOptionsContext);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);
  const [products, setProducts] = useState([]); // Nuevo estado para productos
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado del snackbar
  const [step, setStep] = useState("categoria"); // Paso actual
  const [stepHistory, setStepHistory] = useState([]); // Historial de pasos
  const [breadcrumb, setBreadcrumb] = useState([]); // Para mostrar selección

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [selectedSubfamily, setSelectedSubfamily] = useState(null);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleNextStep = (newStep, label) => {
    setStepHistory([...stepHistory, step]); // Almacena el paso actual en el historial
    setStep(newStep); // Cambia al nuevo paso
    setBreadcrumb([...breadcrumb, label]); // Actualiza el breadcrumb con la nueva selección
  };

  const handlePreviousStep = () => {
    if (stepHistory.length > 0) {
      const previousStep = stepHistory.pop(); // Retrocede al paso anterior
      setStep(previousStep);
      setStepHistory([...stepHistory]); // Actualiza el historial
      breadcrumb.pop(); // Elimina el último elemento del breadcrumb
      setBreadcrumb([...breadcrumb]);
    }
  };

  // Fetch de categorías
  useEffect(() => {
    if (step === "categoria") {
      axios
        .get(`${BASE_API_URL}/NivelMercadoLogicos/GetAllCategorias`)
        .then((response) => {
          if (response.data.categorias.length === 0) {
            setSnackbarOpen(true); // Si no hay categorías, mostrar el snackbar
          }
          setCategories(response.data.categorias || []);
        })
        .catch((error) => console.error("Error fetching categories:", error));
    }
  }, [step]);

  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    axios
      .get(`${BASE_API_URL}/NivelMercadoLogicos/GetSubCategoriaByIdCategoria`, {
        params: { CategoriaID: category.idCategoria },
      })
      .then((response) => {
        if (response.data.subCategorias.length === 0) setSnackbarOpen(true);
        setSubCategories(response.data.subCategorias || []);
        handleNextStep("subcategoria", `Categoria: ${category.descripcion}`);
      })
      .catch((error) => console.error("Error fetching subcategories:", error));
  }, []);

  const handleSubCategorySelect = useCallback(
    (subcategory) => {
      setSelectedSubcategory(subcategory);
      axios
        .get(`${BASE_API_URL}/NivelMercadoLogicos/GetFamiliaByIdSubCategoria`, {
          params: {
            SubCategoriaID: subcategory.idSubcategoria,
            CategoriaID: selectedCategory.idCategoria,
          },
        })
        .then((response) => {
          if (response.data.familias.length === 0) setSnackbarOpen(true);
          setFamilies(response.data.familias || []);
          handleNextStep("familia", `Subcategoria: ${subcategory.descripcion}`);
        })
        .catch((error) => console.error("Error fetching families:", error));
    },
    [selectedCategory]
  );

  const handleFamilySelect = useCallback(
    (family) => {
      setSelectedFamily(family);
      axios
        .get(`${BASE_API_URL}/NivelMercadoLogicos/GetSubFamiliaByIdFamilia`, {
          params: {
            FamiliaID: family.idFamilia,
            SubCategoriaID: selectedSubcategory.idSubcategoria,
            CategoriaID: selectedCategory.idCategoria,
          },
        })
        .then((response) => {
          if (response.data.subFamilias.length === 0) setSnackbarOpen(true);
          setSubFamilies(response.data.subFamilias || []);
          handleNextStep("subfamilia", `Familia: ${family.descripcion}`);
        })
        .catch((error) => console.error("Error fetching subfamilies:", error));
    },
    [selectedCategory, selectedSubcategory]
  );

  ///Busqueda Producto/////
  const handleSubfamilySelect = useCallback(
    (subfamily) => {
      setSelectedSubfamily(subfamily);
      axios
        .get(`${BASE_API_URL}/ProductosTmp/GetProductosByIdNML`, {
          params: {
            idcategoria: selectedCategory.idCategoria,
            idsubcategoria: selectedSubcategory.idSubcategoria,
            idfamilia: selectedFamily.idFamilia,
            idsubfamilia: subfamily.idSubFamilia,
          },
        })
        .then((response) => {
          setProducts(response.data.productos || []);
          console.log('ProductoNML',response.data.productos)
          handleNextStep("productos", `Subfamilia: ${subfamily.descripcion}`);
        })
        .catch((error) => console.error("Error fetching products:", error));
    },
    [selectedCategory, selectedSubcategory, selectedFamily]
  );

  //Agregar producto //
  const handleAddProductToSales = (product) => {
    try {
      // Add the selected product to the sales data using the context method
      addToSalesData(product);
  
      // Optionally, log the product or trigger a success notification
      console.log("Product added to sales:", product);
  
      // If needed, you can also trigger any additional logic like closing the dialog
      // onClose(); // Uncomment this if you want to close the dialog after adding the product
  
    } catch (error) {
      // Handle any potential errors that might occur
      console.error("Error adding product to sales:", error);
    }
  };
  

  const renderStepContent = () => {
    switch (step) {
      case "categoria":
        return categories.map((category) => (
          <Grid item key={category.idCategoria} xs={12}>
            <Button
              sx={estilosBoton}
              onClick={() => handleCategorySelect(category)}
              fullWidth
            >
              {category.descripcion}
            </Button>
          </Grid>
        ));
      case "subcategoria":
        return subcategories.map((subcategory) => (
          <Grid item key={subcategory.idSubcategoria} xs={12}>
            <Button
              sx={estilosBoton}
              onClick={() => handleSubCategorySelect(subcategory)}
              fullWidth
            >
              {subcategory.descripcion}
            </Button>
          </Grid>
        ));
      case "familia":
        return families.map((family) => (
          <Grid item key={family.idFamilia} xs={12}>
            <Button
              sx={estilosBoton}
              onClick={() => handleFamilySelect(family)}
              fullWidth
            >
              {family.descripcion}
            </Button>
          </Grid>
        ));
      case "subfamilia":
        return subfamilies.map((subfamily) => (
          <Grid item key={subfamily.idSubFamilia} xs={12}>
            <Button
              sx={estilosBoton}
              onClick={() => handleSubfamilySelect(subfamily)}
              fullWidth
            >
              {subfamily.descripcion}
            </Button>
          </Grid>
        ));
      case "productos":
        return products.map((product) => (
          <Grid item key={product.idProducto} xs={12}>
            <Button
              sx={estilosBoton}
              fullWidth
              onClick={() => handleAddProductToSales(product)}
            >
              {product.nombre}
            </Button>
          </Grid>
        ));
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={openDialog} onClose={onClose}>
        <DialogContent>
          {/* Breadcrumb */}
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            {breadcrumb.map((item, index) => (
              <Typography key={index} color="text.primary">
                {item}
              </Typography>
            ))}
          </Breadcrumbs>

          {/* Renderizado dinámico basado en el paso actual */}
          <Grid container spacing={2}>
            {renderStepContent()}
          </Grid>

          {/* Botón 'Atrás' */}
          {step !== "categoria" && (
            <Button sx={{ mt: 2 }} onClick={handlePreviousStep}>
              Atrás
            </Button>
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar para alertar sobre errores */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
          sx={{ width: "100%" }}
        >
          No hay elementos disponibles.
        </Alert>
      </Snackbar>
    </>
  );
};

export default BotonesCategorias;
