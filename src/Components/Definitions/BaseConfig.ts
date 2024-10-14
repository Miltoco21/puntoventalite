import dayjs from "dayjs";

const BaseConfig =  {
    shopName:'EasyPOSAnibal-Panaderias',
    urlBase : (import.meta.env.VITE_URL_BASE),
    sesionStart: dayjs().format('DD/MM/YYYY-HH:mm:ss'),
    sesionExprire: 2 * 60 * 1000, //en milisegundos
    margenGanancia: 30, //en %
    iva: 19, //en %
    cantidadProductosBusquedaRapida:20,
    cantidadDescripcionCorta:30,
    buttonDelayClick: 1500, //en milisegundos
};

export default BaseConfig;