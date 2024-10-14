/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useMemo } from "react";
import ModelConfig from '../../Models/ModelConfig'
import User from '../../Models/User'

export const SelectedOptionsContext = React.createContext();

export const SelectedOptionsProvider = ({ children }) => {
  const [selectedOptions, setSelectedOptions] = useState({
    category: null,
    subcategory: null,
    family: null,
    subfamily: null,
    selectedProduct: null,
  });
  const [productInfo, setProductInfo] = useState(/* initial value */);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [description, setDescription] = useState(/* initial value */);
  const [quantity, setQuantity] = useState(1);
  const [precioData, setPrecioData] = useState(null);
  const [ventaData, setVentaData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [salesDataTimestamp, setSalesDataTimestamp] = useState(Date.now());

  const [selectedCodigoCliente, setSelectedCodigoCliente] = useState("");
  const [selectedCodigoClienteSucursal, setSelectedCodigoClienteSucursal] =
    useState("");

  const [selectedUser, setSelectedUser] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [selectedChipIndex, setSelectedChipIndex] = useState([]);

  const [searchResults, setSearchResults] = useState([]);
  const updateSearchResults = (results) => {
    setSearchResults(results);
  };

  // const [userData, setUserData] = useState([]);
  // const updateUserData = (data) => {
  //   setUserData(data);
  // };

  const calculateTotalPrice = (quantity, price) => {
    return quantity * price;
  };
  const calculateGrandTotal = () => {
    return salesData.reduce((total, sale) => {
      return total + calculateTotalPrice(sale.quantity, sale.precio);
    }, 0);
  };

  useEffect(() => {
    setGrandTotal(calculateGrandTotal());
  }, [salesData]);
  useEffect(() => {
    setSalesDataTimestamp(Date.now());
  }, [salesData, grandTotal]); // Add other dependencies as needed
  useEffect(() => {
    // Do additional actions if needed after salesData is cleared
    // This block of code will run after the state is updated
    // ...

    // Example: Log a message
    console.log("Sales data :", salesData);
  }, [salesData]);
  const addToSalesData = (product, quantity) => {
    const precioVenta = product.precioVenta || 0;
    const cantidad = quantity !== undefined ? quantity : product.cantidad || 1;

    // Busca si el producto ya está en la lista de ventas
    const existingProductIndex = salesData.findIndex(
      (sale) => sale.idProducto === product.idProducto
    );

    if (existingProductIndex !== -1) {
      // Si el producto ya está en la lista, actualiza su cantidad sumando la cantidad adicional
      const updatedSalesData = [...salesData];
      updatedSalesData[existingProductIndex].quantity += cantidad;
      updatedSalesData[existingProductIndex].total = calculateTotalPrice(
        updatedSalesData[existingProductIndex].quantity,
        precioVenta
      );

      // Actualiza el gran total sumando el total del nuevo producto o la cantidad adicional del producto existente
      setGrandTotal((prevTotal) => prevTotal + cantidad * precioVenta);

      // Actualiza el estado de salesData con los cambios
      setSalesData(updatedSalesData);
    } else {
      // Si el producto no está en la lista, agrégalo normalmente
      const newSale = {
        quantity: cantidad,
        descripcion: product.nombre,
        precio: precioVenta,
        total: calculateTotalPrice(cantidad, precioVenta),
        idProducto: product.idProducto,
      };

      setSalesData((prevSalesData) => {
        const updatedSalesData = [...prevSalesData, newSale];
        // Actualiza el gran total sumando el total del nuevo producto
        setGrandTotal((prevTotal) => prevTotal + newSale.total);
        return updatedSalesData;
      });
    }
  };

  

  //////LOGIN//////


  const clearSalesData = () => {
    setSalesData([]);
    setGrandTotal(0);
    // Update the timestamp to trigger a re-render
    setTimeout(() => {
      // Update the timestamp to trigger a re-render
      setSalesDataTimestamp(Date.now());
    }, 400);
  };
  const [selectedButtons, setSelectedButtons] = useState([]);

  const handleNumberClick = (value) => {
    // Existing code...

    // Add the selected button and its amount to the state
    setSelectedButtons([...selectedButtons, { value, amount: payment }]);
  };

  // Function to calculate the total amount from selected buttons
  const calculateTotalAmount = () => {
    return selectedButtons.reduce((total, button) => total + button.amount, 0);
  };

  const removeFromSalesData = (index) => {
    setSalesData((prevSalesData) =>
      prevSalesData.filter((_, i) => i !== index)
    );
  };

  const incrementQuantity = (index, productInfo) => {
    const updatedSalesData = salesData.map((sale, i) => {
      if (i === index) {
        const newQuantity = sale.quantity + 1; // Usar 'quantity' en lugar de 'cantidad'
        return { ...sale, quantity: isNaN(newQuantity) ? 1 : newQuantity };
      }
      return sale;
    });

    setSalesData(updatedSalesData);

    if (productInfo) {
      addToSalesData(productInfo, selectedQuantity); // Usar 'quantity' en lugar de 'cantidad'
    }
  };

  const decrementQuantity = (index, productInfo) => {
    const updatedSalesData = salesData.map((sale, i) => {
      if (i === index && sale.quantity > 1) {
        const newQuantity = sale.quantity - 1; // Usar 'quantity' en lugar de 'cantidad'
        return { ...sale, quantity: isNaN(newQuantity) ? 1 : newQuantity };
      }
      return sale;
    });

    setSalesData(updatedSalesData);

    if (productInfo) {
      addToSalesData(productInfo, setQuantity); // Usar 'quantity' en lugar de 'cantidad'
    }
  };

  const suspenderVenta = async (salesData) => {
    try {
      // Construct the data object for the request
      const data = {
        usuario: 0,
        descripcion: "string",
        ventaSuspenderDetalle: [
          {
            cantidad: salesData.quantity, // Use selectedQuantity from the function parameter
            codProducto: salesData.idProducto.toString(), // Use codProducto from productInfo
          },
        ],
      };

      // Send the request to the API
      const response = await axios.post(
        "https://www.easypos.somee.com/api/Ventas/SuspenderVenta",
        data
      );

      // Handle the API response according to your needs
      console.log("API Response:", response.data);

      // You can also perform other actions after suspending the sale if necessary
      clearSalesData(); // Clear sales data after suspending the sale
      setPlu(""); // Clear the PLU code
      setPeso(""); // Clear the weight value
    } catch (error) {
      // Handle errors in case the request fails
      console.error("Error suspending sale:", error);
    }
  };

  ////////contextos proyecto poslite////////
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const [snackMessage, setSnackMessage] = useState(null)
  
  //set general dialog variables
  const [showLoadingDialog, setShowLoadingDialogx] = useState(false)
  const [loadingDialogText, setLoadingDialogText] = useState("")
  
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [textConfirm, setTextConfirm] = useState("")
  const [handleConfirm, setHandleConfirm] = useState(null)
  const [handleNotConfirm, setHandleNotConfirm] = useState(null)
  const [userData, setUserData] = useState(null);
  const [CONFIG, setCONFIG] = useState(null)
  
  const showMessage = (message)=>{
    setSnackMessage(message)
    setOpenSnackbar(true)
  }

  const init = ()=>{
    // console.log("init de SelectedOptionsProvider");
    if(!CONFIG)
      setCONFIG(ModelConfig.getInstance().getFirst())
    if(!userData)
      getUserData()
  }
  
  useEffect(()=>{
    init();
  },[]);
  

  //mostrar un dialog con la animacion del cargando
  const setShowLoadingDialog = (value)=>{
    setShowLoadingDialogx(value);
  }
  
  const setShowLoadingDialogWithTitle = (textToShow = "", value)=>{
    setLoadingDialogText(textToShow)
    setShowLoadingDialogx(value);
  }

  const showLoading = (textToShow = "")=>{
    setLoadingDialogText(textToShow)
    setShowLoadingDialogx(true);
  }
  
  //ocultar el dialog en x milisegundos
  const hideLoadingDialog = (timeOut = 200)=>{
    setTimeout(function(){
      setShowLoadingDialog(false);
    },timeOut);
  }

  const hideLoading = (timeOut = 200)=>{
    setTimeout(function(){
      setShowLoadingDialog(false);
    },timeOut);
  }


  const showConfirm = (text, callbackYes, callbackNo)=>{
    setTextConfirm(text)
    setHandleConfirm(()=>callbackYes)
    setHandleNotConfirm(()=>callbackNo)
    setShowConfirmDialog(true)
  }

  const updateUserData = (data) => {
    setUserData(User.getInstance().saveInSesion(data));
  };

  const getUserData = () => {
    if(User.getInstance().sesion.hasOne())
      setUserData(User.getInstance().getFromSesion());
  };

  const clearSessionData = () => {
    User.getInstance().sesion.truncate();
    setUserData([])
    setUserData([])
  };

  const GeneralElements = ()=>{
    return (
      <>
      <Snackbar
        open={openSnackbar}
        message={snackMessage}
        autoHideDuration={3000}
        onClose={()=>{ setOpenSnackbar(false) }}
      />
      <LoadingDialog openDialog = {showLoadingDialog} text={loadingDialogText} />
      <Confirm 
        openDialog={showConfirmDialog}
        setOpenDialog={setShowConfirmDialog}
        textConfirm={textConfirm}
        handleConfirm={handleConfirm}
        handleNotConfirm={handleNotConfirm}
      />
      </>
    )
  }

  return (
    <SelectedOptionsContext.Provider
      value={{
        selectedOptions,
        setSelectedOptions,
        salesData,
        setSalesData,
        grandTotal,
        setGrandTotal,
        addToSalesData,
        removeFromSalesData,
        incrementQuantity,
        decrementQuantity,
        clearSalesData,
        products,
        setProducts,
        salesDataTimestamp,
        suspenderVenta,
        productInfo,
        setProductInfo,
        quantity,
        selectedUser,
        setSelectedUser,
        clearSessionData,
        calculateTotalPrice,
        description,
        setDescription,
        userData,
        updateUserData,
        precioData,
        setPrecioData,
        ventaData,
        setVentaData,
        searchResults,
        setSearchResults,
        updateSearchResults,
        selectedCodigoCliente,
        setSelectedCodigoCliente,
        selectedCodigoClienteSucursal,
        setSelectedCodigoClienteSucursal,
        selectedChipIndex,
        setSelectedChipIndex,
        searchText,
        setSearchText,
        searchedProducts,
         setSearchedProducts,
         showConfirm,
         showMessage,
         showLoading,
         showLoadingDialog,
         hideLoading,
         loadingDialogText,
         setLoadingDialogText,
         hideLoadingDialog,
         setShowLoadingDialog,
         setShowLoadingDialogWithTitle,
         GeneralElements,
         init,
         snackMessage,
      }}
    >
      {children}
    </SelectedOptionsContext.Provider>
  );
};

export default SelectedOptionsProvider;
