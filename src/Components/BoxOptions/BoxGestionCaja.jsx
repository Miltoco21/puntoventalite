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
 
  DialogActions,
  DialogTitle,
  TableRow,
  Snackbar,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import MuiAlert from "@mui/material/Alert";
import { createTheme } from "@mui/material/styles";

import axios from "axios";
import BotonesCategorias from "./BotonesCategorias";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import BoxRecuperarVenta from "./BoxRecuperarVenta";
import BoxDevolucion from "./BoxDevolucion";
import BoxIngreso from "./BoxIngreso";
import BoxStock from "./BoxStock";
import IngresoClientes from "./IngresoClientes";
import BoxPago from "./BoxPago";
import BoxPagoTicket from "./BoxPagoTicket";
import BoxBuscador from "./BoxBuscador";
import BoxPreciosClientes from "./BoxPreciosClientes";
import StepperSI from "../Stepper/StepperSI";
import StepperNo from "../Stepper/StepperNo"
import BoxCtaCorriente from "../BoxOptions/BoxCtaCorriente";

const BoxGestionCaja = () => {
  const {
    grandTotal,
    setGrandTotal,
    suspenderVenta,
    salesData,
    calculateTotalPrice,
    clearSalesData,
    addToSalesData,
  } = useContext(SelectedOptionsContext);

  const [openCrearProductoDialog, setOpenCrearProductoDialog] = useState(false);
  const [clickedDigits, setClickedDigits] = useState([]);
  const [totalAPagar, setTotalAPagar] = useState(0);
  const [change, setChange] = useState(0);
  const [value, setValue] = useState("");
  const [sellerCode, setSellerCode] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [typedNumber, setTypedNumber] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [activeField, setActiveField] = useState(false);
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [recordList, setRecordList] = useState([]);
  const [inputDigits, setInputDigits] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isOpenCategoria, setIsOpenCategoria] = useState(false);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [openDescriptionDialog, setOpenDescriptionDialog] = useState(false);
  const [openRecoveryDialog, setOpenRecoveryDialog] = useState(false);
  const [openClienteDialog, setopenClienteDialog] = useState(false);
  const [openPreciosClienteDialog, setOpenPreciosClienteDialog] =
    useState(false);
  const [openStockDialog, setOpenStockDialog] = useState(false);
  const [openTicketDialog, setOpenTicketDialog] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openDevolucionDialog, setOpenDevolucionDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedSaleEntry, setSelectedSaleEntry] = useState(salesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedId, setSelecteddId] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [selectedCabecera, setSelectedCabecera] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [productoData, setProductoData] = useState([]);

  useEffect(() => {
    fetchData();
    fetchDataProducts();
  }, []);

  const fetchDataProducts = () => {
    axios
      .get("https://www.easyposdev.somee.com/api/ProductosTmp/GetProductos")
      .then((response) => {
        setProducts(response.data.productos);

        console.log("prod:", response.data.productos);
      })

      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const fetchData = async () => {
    try {
      const ventaSuspenderResponse = await axios.get(
        "https://www.easyposdev.somee.com/api/Ventas/GetAllSuspenderVenta"
      );

      const productsResponse = await axios.get(
        "https://www.easyposdev.somee.com/api/ProductosTmp/GetProductos"
      );

      const ventaSuspenderCabeceras =
        ventaSuspenderResponse.data.ventaSuspenderCabeceras;
      const productos = productsResponse.data.productos;

      // Map ventaSuspenderCabeceras and include product details
      const enhancedData = ventaSuspenderCabeceras.map((cabecera) => {
        const enhancedDetalle = cabecera.ventaSuspenderDetalle.map(
          (detalle) => {
            const matchingProduct = productos.find(
              (product) => product.idProducto === detalle.idProducto
            );

            return {
              ...detalle,
              productDetails: matchingProduct || null,
            };
          }
        );

        return {
          ...cabecera,
          ventaSuspenderDetalle: enhancedDetalle,
        };
      });

      setData(enhancedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleButtonRecuperarVenta = () => {
    console.log("handleButtonRecuperarVenta is called");
    fetchData();
    fetchDataProducts();
    setOpenRecoveryDialog(true);
  };

  const handleButtonClick = (cabeceraId) => {
    setSelectedCabecera(cabeceraId);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSearchInputChange = (event, newValue) => {
    setSearchTerm(newValue);
  };

  const PAYMENT_METHODS = [
    "Efectivo",
    "Tarjeta",
    "Cuenta corriente",
    "Transferencia",
  ];
  const handleCloseSuccessSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccessSnackbar(false);
  };

  const handleTypedNumberClick = (number) => {
    setActiveField(true);
    setInputDigits((prevDigits) => prevDigits + number);

    // Set the selected amount to the new value directly
    const newAmount = parseFloat(inputDigits + number) || 0;
    setSelectedAmount(newAmount);

    // Update totalPaidAmount in real-time
    setTotalPaidAmount(newAmount);
  };

  const handleZeroClick = () => {
    setActiveField(true);
    setInputDigits((prevDigits) => prevDigits + "0");
    updateSelectedValues("0");
  };
  const updateSelectedValues = (digit) => {
    // Convert the concatenated string to a number
    const newAmount = parseFloat(digit) || 0;

    // Concatenate the selected amount
    setSelectedAmount((prevAmount) => prevAmount + newAmount);
  };
  const handleOpenDescriptionDialog = () => {
    if (salesData.length > 0) {
      // Set selectedQuantity based on the existing quantity in the sales data
      const selectedProduct = salesData[0];
      setSelectedQuantity(selectedProduct.quantity);
    }
    setOpenDescriptionDialog(true);
  };

  const handleCloseDescriptionDialog = () => {
    setOpenDescriptionDialog(false);
  };
  const handleCloseRecoveryDialog = () => {
    setOpenRecoveryDialog(false);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleEnterClick = () => {
    // Define the logic for handleEnterClick
    // For example, you can perform actions when the Enter button is clicked
  };

  const handlePaymentMethodClick = (method) => {
    // Add logic to handle payment method selection
    setSelectedPaymentMethod(method);
    setValidationMessage(""); // Clear any previous validation messages
  };

  const handleDeleteOne = () => {
    setActiveField(true);
    setInputDigits((prevDigits) => prevDigits.slice(0, -1));
    // Update the selected amount by removing the last digit
    setSelectedAmount((prevAmount) => {
      const newAmount = Math.floor(prevAmount / 10);
      return newAmount;
    });
  };

  const handleSuspenderVentaDetalle = () => {
    // Verificar si hay algún producto en la venta antes de suspender
    if (salesData.length > 0) {
      const productInfo = salesData[0]; // Obtener la información del primer producto (puedes ajustar esto según tus necesidades)
      // Guardar la descripción en el estado antes de suspender la venta
      setDescription(productInfo.descripcion);
      handleOpenDescriptionDialog();
    } else {
      // Manejar caso donde no hay productos en la venta
      console.warn("No hay productos en la venta para suspender.");
    }
  };
  const handlePostSuspenderVentaDetalle = async () => {
    // Check if sale data is available
    if (salesData.length === 0) {
      console.error("No se proporcionaron detalles de la venta.");
      return;
    }

    // Check if description is provided
    if (!description || typeof description !== "string") {
      console.error("Description is required and must be a string.");
      return;
    }

    // Include ventaSuspenderCabecera field (replace 'your_value' with the actual value)
    const ventaSuspenderCabecera = [];

    // Create payload with ventaSuspenderCabecera
    const data = {
      usuario: 0,
      descripcion: description,
      ventaSuspenderCabecera: ventaSuspenderCabecera, // Include this field
      ventaSuspenderDetalle: salesData.map((sale) => ({
        cantidad: sale.quantity,
        CodProducto: String(sale.idProducto), // Convert to string if needed
      })),
    };

    try {
      // Make a POST request to the API endpoint using Axios
      console.log("posted", data);
      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/Ventas/SuspenderVenta",
        data
      );
      if (response.data.descripcion === "Venta suspendida grabada con exito.") {
        // Handle successful response
        console.log("Sale suspended successfully:", response.data);
        setSuccessMessage(response.data.descripcion);
        setOpenSuccessSnackbar(true);

        // Clear sales data and close dialog
        clearSalesData();
        handleCloseDescriptionDialog();

        // Open success dialog
        setOpenSuccessDialog(true);
      } else {
        // Handle unexpected response
        console.error("Unexpected response:", response.data);
      }

      // Handle the response...
    } catch (error) {
      // Handle Axios error
      console.error("Axios error:", error);
    }
  };
  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  const handleSuspenderVenta = async () => {
    setSelectedSaleEntry();

    setOpenDescriptionDialog(true);
    try {
      // Verificar si hay algún producto en la venta antes de suspender
      if (salesData.length > 0) {
        // Assuming you want the productInfo from the first item in salesData
        const productInfo = salesData[0];

        const currentSelectedQuantity = salesData.reduce(
          (total, sale) => total + sale.quantity,
          0
        );

        // Use setProductInfo and setSelectedQuantity to update the context values
        setProductInfo(productInfo);
        setSelectedQuantity(currentSelectedQuantity);

        // Lógica para suspender la venta
        await suspenderVenta(productInfo, currentSelectedQuantity);

        // Puedes realizar otras acciones después de suspender la venta si es necesario
      } else {
        console.warn("No hay productos en la venta para suspender.");
      }
    } catch (error) {
      console.error("Error al suspender la venta:", error);
      // Manejar errores en caso de que la solicitud falle
    }
  };

  const handleConfirmClick = () => {
    if (inputDigits && selectedPaymentMethod) {
      // Convierte los dígitos ingresados en un número
      const typedAmount = parseFloat(inputDigits) || 0;

      // Agrega los valores acumulados al registro de productos vendidos
      setRecordList([
        ...recordList,
        { amount: typedAmount, paymentMethod: selectedPaymentMethod },
      ]);
      setTotalPaidAmount(totalPaidAmount + typedAmount);
      // Limpia los dígitos ingresados, el monto seleccionado y el método de pago después de la confirmación
      setInputDigits("");
      setSelectedAmount(0);
      setSelectedPaymentMethod("");
    }
  };

  const updateTotalAPagar = (newTotalAPagar) => {
    setTotalAPagar(newTotalAPagar);
  };

  const updateGrandTotal = (newGrandTotal) => {
    setGrandTotal(newGrandTotal);
  };

  const updateChange = (newChange) => {
    setChange(newChange);
  };

  const updateSelectedButtons = (newValue, newAmount) => {
    setSelectedButtons([
      ...selectedButtons,
      { value: newValue, amount: newAmount },
    ]);
  };

  const updateSelectedAmount = (newAmount) => {
    setSelectedAmount(selectedAmount + newAmount);
  };

  const updateSelectedPaymentMethod = (newMethod) => {
    setSelectedPaymentMethod(newMethod);
  };
  const handleDeleteSales = () => {
    // Add logic to delete all sales items
    // For example, set the grand total to zero and clear the seller code
    setGrandTotal(0);
    setSellerCode("");
    setInputValue("");
    setChange(0);
  };

  const handleDeleteAll = () => {
    // Borrar todos los números escritos cuando se hace clic en "Borrar Todo"
    setTypedNumber("");

    // Limpiar los valores seleccionados
    setSelectedAmount(0);
    setSelectedPaymentMethod("");
  };
  // const handleDeleteAll = () => {
  //   if (activeField === "sellerCode") {
  //     setSellerCode("");
  //   } else if (activeField === "code") {
  //     setCode("");
  //   }
  // };
  const handleClearSalesData = () => {
    clearSalesData();
  };
  const handleAmountMethod = () => {
    // Implement the logic for handleAmountMethod
  };
  const handleOpenDevolucion = () => {
    setOpenDevolucionDialog(true);
  };
  const handleCloseDevolucion = () => {
    setOpenDevolucionDialog(false);
  };
  const handleOpenIngreso = () => {
    setopenClienteDialog(true);
  };
  const handleCloseIngreso = () => {
    setopenClienteDialog(false);
  };
  const handleOpenStock = () => {
    setOpenStockDialog(true);
  };
  const handleCloseStock = () => {
    setOpenStockDialog(false);
  };
  const handleOpenTicket = () => {
    setOpenTicketDialog(true);
  };
  const handleCloseTicket = () => {
    setOpenTicketDialog(false);
  };
  const handleOpenPrecioCliente = () => {
    setOpenPreciosClienteDialog(true);
  };
  const handleClosePrecioCliente = () => {
    setOpenPreciosClienteDialog(false);
  };
  const handleOpenCrearProductoDialog = () => {
    setOpenCrearProductoDialog(true);
  };

  const handleCloseCrearProductoDialog = () => {
    setOpenCrearProductoDialog(false);
  };

  const [openCategoria, setOpenCategoria] = useState(false);
  const handleOpenCategoria = () => {
    setOpenCategoria(true);
  };
  const handleCloseCategoria = () => {
    setOpenCategoria(false);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    // Reset the seller code, input value, and change
    setSellerCode("");
    setInputValue("");
    setChange(0);
    setSelectedAmount(0);
    // Close the dialog
    setOpenDialog(false);
  };

  const [openDeudasDialog, setOpenDeudasDialog] = useState(false);

  // Paso 2: Funciones para manejar la apertura y el cierre del diálogo
  const handleOpenDeudasDialog = () => {
    setOpenDeudasDialog(true);
  };

  const handleCloseDeudasDialog = () => {
    setOpenDeudasDialog(false);
  };

  return (
    <Paper
      elevation={13}
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "1000px",
        margin: "0 auto",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        spacing={2}
        // sx={{ marginLeft: "5px", marginTop: "5px", }}
      >
        <Grid item xs={6} sm={4} md={4} lg={3} xl={3}>
          <Button
            elevation={8}
            sx={{
              width: "90%",
              height: "80px",
              backgroundColor: "lightSalmon",
              color: "white",
              "&:hover": {
                backgroundColor: "coral",
                color: "white",
              },
              margin: "5px",
            }}
            onClick={handleClearSalesData}
          >
            <Typography variant="h7">Borrar Ventas</Typography>
          </Button>
        </Grid>
        <Grid item xs={6} sm={4} md={4} lg={3} xl={2}>
          <Button
            disabled={true}
            sx={{
              disabled: true,
              width: "90%",
              height: "80px",
              backgroundColor: "lightSalmon",
              color: "white",
              "&:hover": {
                backgroundColor: "coral",
                color: "white",
              },
              margin: "5px",
            }}
            onClick={handleOpenStock}
          >
            {/* <EditIcon /> */}
            <Typography variant="h7">Stock</Typography>
          </Button>
        </Grid>
        <Grid item xs={6} sm={4} md={4} lg={3} xl={2}>
          <Button
            sx={{
              width: "90%",
              height: "80px",
              backgroundColor: "lightSalmon",
              color: "white",
              "&:hover": {
                backgroundColor: "coral",
                color: "white",
              },
              margin: "5px",
            }}
            onClick={handleOpenCategoria}
          >
            {/* <LockPersonIcon /> */}
            <Typography variant="h7">Familias</Typography>
          </Button>
        </Grid>

        {/*  */}
        {/* <Button
            sx={{
              width: "90%",
              height: "80px",
              backgroundColor: "lightSalmon",
              color: "white",
              "&:hover": {
                backgroundColor: "coral",
                color: "white",
              },
              margin: "5px",
            }}
            onClick={handleOpenDevolucion}
          >
          
            <Typography variant="h7">Devolución</Typography>
          </Button> */}

        <Grid item xs={6} sm={4} md={4} lg={3} xl={2}>
          <Button
            sx={{
              width: "90%",
              height: "80px",
              backgroundColor: "lightSalmon",
              color: "white",
              "&:hover": {
                backgroundColor: "coral",
                color: "white",
              },
              margin: "5px",
            }}
            onClick={handleOpenCrearProductoDialog}
          >
            <Typography variant="h7">Crear Producto</Typography>
          </Button>
        </Grid>

        <Grid item xs={6} sm={4} md={4} lg={3} xl={2}>
          <Button
            sx={{
              width: "90%",
              height: "80px",
              backgroundColor: "lightSalmon",
              color: "white",
              "&:hover": {
                backgroundColor: "coral",
                color: "white",
              },
              margin: "5px",
            }}
            onClick={handleOpenIngreso}
          >
            {/* <CoffeeIcon /> */}
            <Typography variant="h7">Crear Cliente</Typography>
          </Button>
        </Grid>
        <Grid item xs={6} sm={4} md={4} lg={3} xl={2}>
          <Button
            sx={{
              width: "90%",
              height: "80px",
              backgroundColor: "lightSalmon",
              color: "white",
              "&:hover": {
                backgroundColor: "coral",
                color: "white",
              },
              margin: "5px",
            }}
            onClick={handleOpenDeudasDialog}
          >
            {/* <CoffeeIcon /> */}
            <Typography variant="h7">Deudas</Typography>
          </Button>
        </Grid>
        <Grid item xs={6} sm={4} md={4} lg={3} xl={2}>
          <Button
            sx={{
              width: "90%",
              height: "80px",
              backgroundColor: "lightSalmon",
              color: "white",
              "&:hover": {
                backgroundColor: "coral",
                color: "white",
              },
              margin: "5px",
            }}
            onClick={handleOpenPrecioCliente}
          >
            {/* <CoffeeIcon /> */}
            <Typography variant="h7">Precios</Typography>
          </Button>
        </Grid>

        {/* <Grid item xs={6} sm={6} md={4} lg={3} xl={2}>
          <Button
            sx={{
              width: "100px",
              height: "100px",
              backgroundColor: "lightSalmon",
              color: "white",
              "&:hover": {
                backgroundColor: "coral",
                color: "white",
              },
            }}
            onClick={() => handleNavigationChange(null, 11)}
          >
            <Typography variant="h7">otro </Typography>
          </Button>
        </Grid> */}
        <Grid item xs={12} sm={10} md={12} lg={12} xl={10}>
          <Grid>
            <Box
              sx={{
                borderRadius: "8px",
                border: "4px solid #ccc",
                display: "flex",

                //   justifyContent: "center",
                margin: "5px",
              }}
            >
              <Grid container item xs={12}>
                <Grid
                  item
                  xs={12}
                  sx={{
                    margin: "6px",
                    color: "#ffffff",
                    backgroundColor: "#E1213B",

                    borderRadius: "5px",
                  }}
                >
                  <p
                    style={{
                      margin: "6px",
                      fontSize: "36px",
                      fontWeight: "bold",
                      fontFamily: "Victor Mono"
                    }}
                  >
                    TOTAL : $
                    <span
                      style={{
                        color: "#00878889",
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                    >
                      <span
                        style={{
                          height:"600%",
                          color: "white",
                          fontSize: "36px",
                          fontFamily: "Victor Mono",
                         
                          fontWeight: "700",
                        }}
                      >
                        {grandTotal}
                      </span>{" "}
                    </span>{" "}
                  </p>
                </Grid>

                <Grid
                  item
                  xs={4}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    sx={{
                      margin: "7px",
                      width: "80%",
                      height: "60px",
                      backgroundColor: "green",
                      color: "whitesmoke",
                      "&:hover": {
                        backgroundColor: "red",
                        color: "white",
                      },
                    }}
                    onClick={handleOpenDialog}
                    // onClick={() => handleNavigationChange(null, 12)}
                  >
                    <Typography variant="h7"> Boleta</Typography>
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    sx={{
                      margin: "7px",
                      width: "80%",
                      height: "60px",
                      backgroundColor: "green",
                      color: "whitesmoke",
                      "&:hover": {
                        backgroundColor: "red",
                        color: "white",
                      },
                    }}
                    onClick={handleOpenDialog}
                    // onClick={() => handleNavigationChange(null, 12)}
                  >
                    <Typography variant="h7">Factura</Typography>
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    style={{
                      margin: "7px",
                      width: "80%",
                      height: "60px",
                      backgroundColor: "green",
                      color: "whitesmoke",
                      "&:hover": {
                        backgroundColor: "red",
                        color: "white",
                      },
                    }}
                    onClick={() => {
                      console.log("Botón de Ticket presionado");
                      handleOpenTicket(); // También puedes llamar a la función handleOpenTicket aquí si es necesario
                    }}

                    // onClick={() => handleNavigationChange(null, 12)}
                  >
                    <Typography variant="h7">Ticket</Typography>
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={openCategoria} onClose={handleCloseCategoria}>
        <DialogContent>
          <BotonesCategorias onClose={handleCloseCategoria} />
        </DialogContent>
      </Dialog>

      <Dialog
        sx={{ width: "100%" }}
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogContent sx={{ width: "100%" }}>
          <BoxPago />
        </DialogContent>
      </Dialog>

      <Dialog
        sx={{ width: "100%" }}
        open={openTicketDialog}
        onCloseTicket={handleCloseTicket}
      >
        <DialogContent sx={{ width: "100%" }}>
          <BoxPagoTicket onCloseTicket={handleCloseTicket} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTicket}>cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for entering description */}

      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSuccessSnackbar}
      >
        <MuiAlert onClose={handleCloseSuccessSnackbar} severity="success">
          {successMessage}
        </MuiAlert>
      </Snackbar>

      <Dialog open={openRecoveryDialog} onClose={handleCloseRecoveryDialog}>
        <DialogTitle>Seleccionar Venta</DialogTitle>
        <DialogContent>
          <BoxRecuperarVenta onClose={handleCloseRecoveryDialog} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRecoveryDialog}>cerrar</Button>
          <Button onClick={handleButtonRecuperarVenta}>Seleccionar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPreciosClienteDialog}
        onClose={handleClosePrecioCliente}
      >
        <DialogTitle>Precios Clientes</DialogTitle>
        <DialogContent>
          <BoxPreciosClientes
            onClosePreciosClientes={handleClosePrecioCliente}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrecioCliente}>cerrar</Button>
          {/* <Button onClick={handleButtonRecuperarVenta}>Seleccionar</Button> */}
        </DialogActions>
      </Dialog>

      <Dialog open={openDevolucionDialog} onClose={handleCloseDevolucion}>
        <DialogTitle>Devolución</DialogTitle>
        <DialogContent>
          <BoxDevolucion onClose={handleCloseDevolucion} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDevolucion}>cerrar</Button>
          <Button onClick={handleButtonRecuperarVenta}>Seleccionar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openClienteDialog} onClose={handleCloseIngreso}>
        <DialogTitle>Crear Cliente</DialogTitle>
        <DialogContent>
          <IngresoClientes onClose={handleCloseIngreso} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIngreso}>cerrar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openStockDialog} onClose={handleCloseStock}>
        <DialogTitle>Stock</DialogTitle>
        <DialogContent>
          <BoxStock onClose={handleCloseStock} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStock}>cerrar</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openCrearProductoDialog}
        onClose={handleCloseCrearProductoDialog}
      >
        <DialogTitle>Crear Producto</DialogTitle>
        <DialogContent>
          <StepperSI onClose={handleCloseCrearProductoDialog} />
          {/* Aquí puedes colocar el formulario para crear un nuevo producto */}
          {/* Por ejemplo, campos para nombre, precio, descripción, etc. */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCrearProductoDialog}>Cerrar</Button>
          {/* <Button onClick={handleCrearProducto}>Crear</Button> */}
        </DialogActions>
      </Dialog>
      <Dialog open={openDeudasDialog} onClose={handleCloseDeudasDialog}>
        <DialogContent onClose={handleCloseDeudasDialog}>
          <BoxCtaCorriente />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeudasDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BoxGestionCaja;
