/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import BoxSumaProd from "./BoxSumaProd";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const BotonesCategorias = ({ onClose }) => {
  const { selectedOptions, setSelectedOptions } = useContext(
    SelectedOptionsContext
  );
  const { addToSalesData } = useContext(SelectedOptionsContext);
  const [value, setValue] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [subcategories, setSubCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);

  const [openFamily, setOpenFamily] = useState(false);
  const [openSubFamily, setOpenSubFamily] = useState(false);

  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openNoProductDialog, setOpenNoProductDialog] = useState(false);

  ////data para enviar a componente

  const handleCategorySelect = (categoryId) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      category: categoryId,
    }));
  };

  const [open, setOpen] = useState(false);

  const handleCloseAddProduct = () => {
    // Add logic to handle the selectedProduct, for example:
    // You can set the selectedProduct to the context
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      selectedProduct: selectedProduct,
    }));

    // You can also perform additional logic based on the selectedProduct

    // Finally, close the product dialog
    setOpenProductDialog(false);
  };

  const handleOpenDialog = async (categoryId) => {
    setOpen(true);
    // Fetch the subcategories for the clicked category
    const response = await axios.get(
      `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=${categoryId}`
    );
    setSubCategories(response.data.subCategorias);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedCategoryId !== "") {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=${selectedCategoryId}`
          );

          console.log("Subcategories Response:", response.data.subCategorias);
          setSubCategories(response.data.subCategorias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubCategories();
  }, [selectedCategoryId]);

  const handleOpenFamilyDialog = async (subCategoryId) => {
    console.log("subCategoryId:", subCategoryId);
    setOpen(false); // Close the subcategory dialog
    // Fetch the families for the clicked subcategory
    const response = await axios.get(
      `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?SubCategoriaID=${subCategoryId}`
    );
    setFamilies(response.data.familias);
    setOpenFamily(true); // Open the family dialog
  };
  const handleCloseFamilyDialog = () => {
    setOpenFamily(false);
  };

  const handleNavigationChange = (event, newValue) => {
    console.log(`Button ${newValue} clicked`);
    setValue(newValue);
  };

  const handleCloseCategoria = () => {
    onClose(true);
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetAllCategorias"
        );
        console.log("API response:", response.data.categorias); // Add this line
        setCategories(response.data.categorias);
      } catch (error) {
        console.log(error);
      }
    }

    fetchCategories();
  }, []);

  const handleOpenSubFamilyDialog = async (familyId) => {
    console.log("familyId:", familyId);
    setOpenFamily(false); // Close the family dialog

    // Fetch the subfamilies for the clicked family
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?FamiliaID=${familyId}`
      );

      // Set the selected family in state
      setSelectedFamilyId(familyId);

      // Set the fetched subfamilies in the state
      setSubFamilies(response.data.subFamilias);

      // Open the subfamily dialog
      setOpenSubFamily(true);
    } catch (error) {
      console.error("Error fetching subfamilies:", error);
    }
  };

  const handleCloseSubFamilyDialog = () => {
    setOpenSubFamily(false);
  };
  ///consumo de prodcutos por ids

  const handleSubfamilyClick = async (subfamily) => {
    console.log("Subfamily selected:", subfamily);

    // Log IDs of the selected subfamily
    const {
      idCategoria,
      idSubcategoria,
      idFamilia,
      idSubFamilia,
      descripcion,
    } = subfamily;
    console.log("IDs:", {
      idCategoria,
      idSubcategoria,
      idFamilia,
      idSubFamilia,
      descripcion,
    });

    // Fetch productos data based on the selected subfamily
    try {
      const productosResponse = await axios.get(
        `https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByIdNML?idcategoria=${idCategoria}&idsubcategoria=${idSubcategoria}&idfamilia=${idFamilia}&idsubfamilia=${idSubFamilia}`
      );

      // Handle the fetched productos data as needed
      console.log("Productos Response:", productosResponse.data);

      if (productosResponse.data.cantidadRegistros > 0) {
        // Create and display a map of products
        setSelectedProduct(productosResponse.data.productos);
        setOpenProductDialog(true);

        // Display the map of products (you may use a Dialog or any other UI component)
        console.log("Products Map:", productosResponse.data.productos[0]);
      } else {
        setOpenNoProductDialog(true);
      }
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };
  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
  };

  const handleCloseNoProductDialog = () => {
    setOpenNoProductDialog(false);
  };
  const handleProductClick = (product) => {
    console.log("Product clicked:", product);
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      selectedProduct: product,
     
    }));
    addToSalesData(product)
    // You can also perform additional logic based on the selected product

    // Finally, close the product dialog
    setOpenProductDialog(false);
  };

// const handleProductSelection = (selectedProduct) => {
//   // Assuming you have access to addToSalesData function from the context
//   // Add selected product to sales list
//   addToSalesData(selectedProduct, 1);
// };

  return (
    <SelectedOptionsContext.Provider
      value={{ selectedProduct, setSelectedProduct }}
    >
      <Paper
        elevation={13}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%", // Add this line
          overflow: "hidden", // Add this line
        }}
      >
        <Grid container spacing={1} sx={{ margin: "0 auto" }}>
          <Grid item xs={6} sm={6} md={2} lg={12} xl={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography>Categorias</Typography>
            </Box>

            <Button
              onClick={handleCloseCategoria}
              elevation={8}
              sx={{
                margin: 1,
                width: "90px",
                height: "30px",
                backgroundColor: "purple",
                color: "white",
                "&:hover": {
                  backgroundColor: "red",
                  color: "white",
                },
              }}
            >
              <Typography variant="h7">Cerrar </Typography> <HighlightOffIcon />
            </Button>
          </Grid>

          {categories.map((category) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              lg={3}
              xl={2}
              key={category.idCategoria}
            >
              <Button
                value={category.idCategoria}
                // onClick={() => handleOpenDialog(category.idCategoria)}
                onClick={() => {
                  handleOpenDialog(category.idCategoria);
                  setSelectedOptions((prevOptions) => ({
                    ...prevOptions,
                    category: category.idCategoria,
                  }));
                }}
                sx={{
                  margin: 1,
                  width: "90px",
                  height: "60px",
                  backgroundColor: "lightSalmon",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "coral",
                    color: "white",
                  },
                }}
              >
                {category.descripcion}
              </Button>
            </Grid>
          ))}
        </Grid>
        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle> Selecciona Subcategorias</DialogTitle>
          <DialogContent>
            {subcategories.map((subcategory) => (
              <Button
                key={subcategory.idSubcategoria}
                onClick={() =>
                  handleOpenFamilyDialog(subcategory.idSubcategoria)
                }
                sx={{
                  margin: 1,
                  width: "90px",
                  height: "60px",
                  backgroundColor: "lightSalmon",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "coral",
                    color: "white",
                  },
                }}
              >
                {subcategory.descripcion}
              </Button>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cerrar</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openFamily} onClose={handleCloseFamilyDialog}>
          <DialogTitle>Familias</DialogTitle>
          <DialogContent>
            {families.map((family) => (
              <Button
                key={family.idFamilia}
                onClick={() => handleOpenSubFamilyDialog(family.idFamilia)}
                sx={{
                  margin: 1,
                  width: "90px",
                  height: "60px",
                  backgroundColor: "lightSalmon",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "coral",
                    color: "white",
                  },
                }}
              >
                {family.descripcion}
              </Button>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFamilyDialog}>Cerrar</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openSubFamily} onClose={handleCloseSubFamilyDialog}>
          <DialogTitle>Subfamilias</DialogTitle>
          <DialogContent>
            {subfamilies.map((subfamily) => (
              <Button
                key={subfamily.idSubFamilia}
                onClick={() => handleSubfamilyClick(subfamily)}
                // onClick={() => {
                //   console.log("Subfamily selected:", subfamily);
                //   setSelectedOptions((prevOptions) => ({
                //     ...prevOptions,
                //     subFamily: subfamily,
                //   }));
                // }}
                sx={{
                  margin: 1,
                  width: "90px",
                  height: "60px",
                  backgroundColor: "lightSalmon",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "coral",
                    color: "white",
                  },
                }}
              >
                {subfamily.descripcion}
              </Button>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSubFamilyDialog}>Cerrar</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openProductDialog} onClose={handleCloseProductDialog}>
          <DialogTitle>Selecciona Producto</DialogTitle>
          <DialogContent>
            <Typography variant="h6">Selecciona un producto:</Typography>
            {Array.isArray(selectedProduct) && selectedProduct.length > 0 ? (
              <Grid container spacing={1}>
                {selectedProduct.map((product) => (
                  <Grid item key={product.idProducto}>
                    <Button
                      onClick={() => {
                        console.log("Product Clicked:", product);
                        handleProductClick(product);
                      }}
                      sx={{
                        margin: 1,
                        width: "150px",
                        height: "60px",
                        backgroundColor: "lightSalmon",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "coral",
                          color: "white",
                        },
                      }}
                    >
                      {product.nombre}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No hay productos disponibles.</Typography>
            )}
          </DialogContent>

          <DialogActions>
           
          </DialogActions>
          <DialogActions>
            <Button
              onClick={() => {
                console.log("Cerrar Clicked");
                handleCloseProductDialog();
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openNoProductDialog} onClose={handleCloseNoProductDialog}>
          <DialogTitle>Producto no asociado</DialogTitle>
          <DialogContent>
            <Typography>
              No hay productos asociados a esta subfamilia.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNoProductDialog}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </SelectedOptionsContext.Provider>
  );
};

export default BotonesCategorias;
