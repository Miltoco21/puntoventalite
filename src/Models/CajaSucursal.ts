
import axios from "axios";
import Model from "./Model.ts";
import ModelConfig from "./ModelConfig.ts";

class CajaSucursal extends Model {

  // codigoUsuario: number;
  // rut: string;
  // clave: string;

  // deudaIds: any
  // idUsuario:number


  static instance: CajaSucursal | null = null;
  static getInstance(): CajaSucursal {
    if (CajaSucursal.instance == null) {
      CajaSucursal.instance = new CajaSucursal();
    }

    return CajaSucursal.instance;
  }

  async add(data,callbackOk, callbackWrong){
    try {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        + "/CajaSucursales/AddCajaSucursal"
        const response = await axios.post(url,data);
        if (
        response.status === 200
        || response.status === 201
        ) {
        // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
        callbackOk(response.data, response)
        } else {
        callbackWrong("Respuesta desconocida del servidor")
        }
    } catch (error) {
        if (error.response && error.response.status && error.response.status === 409) {
            callbackWrong(error.response.descripcion)
        } else {
            callbackWrong(error.message)
          }


    }
}
}

export default CajaSucursal;
