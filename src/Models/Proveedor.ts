import StorageSesion from '../Helpers/StorageSesion.ts';
import Model from './Model.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';


class Proveedor extends Model{
  codigoProveedor: number
  razonSocial: string
  giro: string
  rut: string
  email: string
  telefono: string
  direccion: string
  comuna: string
  region: string | null
  pagina: string
  formaPago: string
  nombreResponsable: string
  correoResponsable: string
  telefonoResponsable: string
  sucursal: string

  compraDeudaIds:any
  montoPagado:any
  metodoPago:any

  static instance: Proveedor | null = null;

    static getInstance():Proveedor{
        if(Proveedor.instance == null){
            Proveedor.instance = new Proveedor();
        }

        return Proveedor.instance;
    }

    async existRut({rut},callbackOk, callbackWrong){
      try {
          const configs = ModelConfig.get()
          var url = configs.urlBase
          + "/Proveedores/GetProveedorByRut?rutProveedor=" + rut
          const response = await axios.get(url);
          if (
          response.data.statusCode === 200
          || response.data.statusCode === 201
          ) {
          // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
          callbackOk(response.data.proveedores, response)
          } else {
          callbackWrong("Respuesta desconocida del servidor")
          }
      } catch (error) {
          callbackWrong(error)
      }
  }

  async getAll(callbackOk, callbackWrong){
    try {
      const response = await axios.get(
          ModelConfig.get("urlBase") 
          + `/Proveedores/GetAllProveedores`);

      if (response.status === 200) {
        callbackOk(response.data.proveedores)
      } 
    } catch (error) {
      callbackWrong(error)
    }
  }

  async update(data,callbackOk, callbackWrong){
    try {
        const response = await axios.put(
            ModelConfig.get("urlBase") 
            + `/Proveedores/UpdateProveedor`,
          data
        );
  
        if (response.status === 200) {
          callbackOk(response)
        } 
      } catch (error) {
        callbackWrong(error)
      }
  }

  async findProductsByCodigo({
    codigoBuscar, 
    codigoProveedor,
  },callbackOk, callbackWrong){
    try {
        const configs = ModelConfig.get()
        var url = configs.urlBase +
        "/ProductosTmp/GetProductosByCodigoSegunProveedor?codigoSProveedor=" + codigoBuscar
        url += "&codigoProveedor=" + codigoProveedor
        const response = await axios.get(url);
        if(
            response.data.statusCode == 200
            || response.data.statusCode == 201

        ){
            callbackOk(response.data.productos, response);
        }else{
           callbackWrong("respuesta incorrecta del servidor") 
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        callbackWrong(error) 
      }
  }

  async findProductsByDescription({
    description,
    codigoProveedor
  },
    callbackOk, callbackWrong){
    try {
        const configs = ModelConfig.get()
        var url = configs.urlBase +
        "/ProductosTmp/GetProductosByDescripcionSegunProveedor?"
        url += "DescripcionSProveedor=" + (description+"")
        url += "&codigoProveedor=" + codigoProveedor
        const response = await axios.get(url);
        if(
            response.data.statusCode == 200
            || response.data.statusCode == 201

        ){
            callbackOk(response.data.productos, response);
        }else{
           callbackWrong("respuesta incorrecta del servidor") 
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        callbackWrong(error) 
      }
  }
  
  async asociateProduct(data,callbackOk, callbackWrong){
    try {
        const configs = ModelConfig.get()
        var url = configs.urlBase +
        "/ProductosTmp/PostProductosByCodigoSegunProveedor"
        const response = await axios.post(url, data);
        if(
            response.data.statusCode == 200
            || response.data.statusCode == 201

        ){
            // callbackOk(response.data.productos, response);
            callbackOk(response);
        }else{
           callbackWrong("respuesta incorrecta del servidor") 
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        callbackWrong(error) 
      }
  }

  static assignAndAssociateProduct(product, {
    codigoProveedor,
    countPackage,
    searchCodProv,
    searchDescProv,
  }, callbackOk, callbackWrong){


    const data = [{
      codigoProveedor: codigoProveedor,
      codigoSegunProveedor: "",
      descripcionSegunProveedor: "",
      codBarra: product.idProducto + "",
      cantidadProveedor: parseInt(countPackage + ""),
      cantidadProducto: 1,
    }]
    
    data[0].codigoSegunProveedor = searchCodProv
    data[0].descripcionSegunProveedor = searchDescProv
    
    product.cantidadProveedor = data[0].cantidadProveedor
    product.codigoSegunProveedor = data[0].codigoSegunProveedor
    product.descripcionSegunProveedor = data[0].descripcionSegunProveedor
    
    console.log("datos para asociar:", data)
    Proveedor.getInstance().asociateProduct(data, (res)=>{
      callbackOk(product,res)
    },(error)=>{
      callbackWrong(error)
    })
  }

};

export default Proveedor;