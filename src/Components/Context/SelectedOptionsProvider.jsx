/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useMemo } from "react";

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
  const [selectedQuantity, setSelectedQuantity] = useState(/* initial value */);
 
  const[description,setDescription]=useState(/* initial value */);
  const [quantity, setQuantity] = useState(1);
 
  const [salesData, setSalesData] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [salesDataTimestamp, setSalesDataTimestamp] = useState(Date.now());
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
    console.log("Sales data cleared!");
  
  }, [salesData]); 
 const addToSalesData = (product, quantity) => {
    const precioVenta = product.precioVenta || 0;
    const newSale = {
      
      cantidad: quantity,
      descripcion: product.nombre,
      precio: precioVenta,
      total: quantity * precioVenta,
      idProducto: product.idProducto,
    };

    setSalesData((prevSalesData) => {
      const updatedSalesData = [...prevSalesData, newSale];
      return updatedSalesData;
    });
  };
  // const addToSalesData = (product, quantity) => {
  //   const precioVenta = product.precioVenta || "";
  //   const newSale = {
  //     cantidad: quantity,
  //     descripcion: product.nombre,
  //     precio: precioVenta,
  //     total: quantity * precioVenta,
  //     quantity: 1,
  //     idProducto: product.idProducto,
  //   };
  
  //   setSalesData((prevSalesData) => {
  //     const updatedSalesData = [...prevSalesData, newSale];
  //     return updatedSalesData;
  //   });
  // };
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
        const newQuantity = sale.quantity + 1;
        return { ...sale, quantity: isNaN(newQuantity) ? 1 : newQuantity };
      }
      return sale;
    });
  
    setSalesData(updatedSalesData);
  
    if (productInfo) {
      addToSalesData(productInfo, selectedQuantity);
    }
  };
  
  const decrementQuantity = (index, productInfo) => {
    const updatedSalesData = salesData.map((sale, i) => {
      if (i === index && sale.quantity > 1) {
        const newQuantity = sale.quantity - 1;
        return { ...sale, quantity: isNaN(newQuantity) ? 1 : newQuantity };
      }
      return sale;
    });
  
    setSalesData(updatedSalesData);
  
    if (productInfo) {
      addToSalesData(productInfo, setQuantity);
    }
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value, 10));
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
      const response = await axios.post('https://www.easyposdev.somee.com/api/Ventas/SuspenderVenta', data);
  
      // Handle the API response according to your needs
      console.log('API Response:', response.data);
  
      // You can also perform other actions after suspending the sale if necessary
      clearSalesData(); // Clear sales data after suspending the sale
      setPlu(""); // Clear the PLU code
      setPeso(""); // Clear the weight value
    } catch (error) {
      // Handle errors in case the request fails
      console.error('Error suspending sale:', error);
    }
  };

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
        suspenderVenta,productInfo,
        setProductInfo,
        selectedQuantity,
        setSelectedQuantity,
        calculateTotalPrice,    description,
        setDescription,
    

      }}
    >
      {children}
    </SelectedOptionsContext.Provider>
  );
};

export default SelectedOptionsProvider;
