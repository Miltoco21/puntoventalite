import { Height } from "@mui/icons-material";
import CONSTANTS from '../Components/Definitions/Constants'
import dayjs from "dayjs";


class System {
    static instance: System | null = null;
    
    getAppName(){
        return CONSTANTS.appName  + " " + CONSTANTS.appVersion
    }

    static getInstance():System{
        if(System.instance == null){
            System.instance = new System();
        }

        return System.instance;
    }


    getWindowWidth(){
        return window.innerWidth;
    }

    getWindowHeight(){
        return window.innerHeight;
    }

    getCenterStyle(widthPercent = 80, heightPercent = 80){
        return {
            width : (widthPercent * (System.getInstance().getWindowWidth()) / 100) + "px",
            height :(heightPercent * (System.getInstance().getWindowHeight()) / 100) + "px",
            overflow:"auto"
        };
    }

    getMiddleHeigth(){
        return this.getWindowHeight() - 200 - 76
    }

    fechaYMD(){
        const fecha = new Date();
        const year = fecha.getFullYear();
        const month = (fecha.getMonth() + 1).toString().padStart(2, "0");
        const day = fecha.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

      bancosChile(){
        return [
        { id: 1, nombre: "Banco de Chile" },
        { id: 2, nombre: "Banco Santander Chile" },
        { id: 3, nombre: "Banco Estado" },
        { id: 4, nombre: "Scotiabank Chile" },
        { id: 5, nombre: "Banco BCI" },
        { id: 6, nombre: "Banco Itaú Chile" },
        { id: 7, nombre: "Banco Security" },
        { id: 8, nombre: "Banco Falabella" },
        { id: 9, nombre: "Banco Ripley" },
        { id: 10, nombre: "Banco Consorcio" },
        { id: 11, nombre: "Banco Internacional" },
        { id: 12, nombre: "Banco Edwards Citi" },
        { id: 13, nombre: "Banco de Crédito e Inversiones" },
        { id: 14, nombre: "Banco Paris" },
        { id: 15, nombre: "Banco Corpbanca" },
        { id: 16, nombre: "Banco BICE" },
        // Agrega más bancos según sea necesario
      ]
    }

    tiposDeCuenta(){
        return {
        "Cuenta Corriente": "Cuenta Corriente",
        "Cuenta de Ahorro": "Cuenta de Ahorro",
        "Cuenta Vista": "Cuenta Vista",
        "Cuenta Rut": "Cuenta Rut",
        "Cuenta de Depósito a Plazo (CDP)": "Cuenta de Depósito a Plazo (CDP)",
        "Cuenta de Inversión": "Cuenta de Inversión",
        }
    }

    //fechaactual con formato: 2024-05-12T02:06:22.000Z
    getDateForServer(){
        return (dayjs().format('YYYY-MM-DD HH:mm:ss') + ".000Z").replace(" ", "T")
    }

    en2Decimales(valor){
        return Math.round(parseFloat(valor) * 100) / 100
    }

    typeIntFloat(value){
        if((value + "").indexOf(".")>-1){
            return parseFloat(value+"")
        }else{
            return parseInt(value+"")
        }
    }

    static clone(obj){
        return JSON.parse(JSON.stringify(obj) )
    }

    static getUrlVars(){
        var allStr = window.location.href
        if(allStr.indexOf("?") == -1){
            return {}
        }
        var [location,allLast] = allStr.split("?")
        var vars = {}
        allLast.split("&").forEach((nameValue)=>{
            const [name, value] = nameValue.split("=")
            vars[name] = value
        })
        return vars
    }

    static addInObj(setFunction,fieldName,fieldValue){
        setFunction((oldProduct) => {
            const newProduct = {...oldProduct};
            newProduct[fieldName] = fieldValue
            return newProduct;
        });
    }

    static addAllInObj(setFunction,objValues){
        setFunction((oldProduct) => {
            const newProduct = {...oldProduct,...objValues};
            return newProduct;
        });
    }

    static addAllInArr(setFunction,arrayOriginal,index,objValues){
        const newArr = [...arrayOriginal]
        newArr[index] = objValues
        setFunction(newArr)
    }

    static allValidationOk = (validators,showMessageFunction)=>{
        // console.log("allValidationOk:", validators)
        var allOk = true
        // const keys = Object.keys(validators)
        Object.values(validators).forEach((validation:any,ix)=>{
          // console.log("validation de  " + keys[ix] + " :", validation)
          if(validation[0].message !="" && allOk){
            showMessageFunction(validation[0].message)
            allOk = false
          }
        })
        return allOk
      }

}


export default System;