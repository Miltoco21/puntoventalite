import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../Components/Definitions/Constants.ts";


class ModelConfig {
    static instance: ModelConfig | null = null;
    sesion: StorageSesion;

    constructor(){
        this.sesion = new StorageSesion("config");
    }

    static getInstance():ModelConfig{
        if(ModelConfig.instance == null){
            ModelConfig.instance = new ModelConfig();
        }

        return ModelConfig.instance;
    }

    static get(propName = ""){
        var rs = ModelConfig.getInstance().sesion.cargar(1)
        if(!rs){
            this.getInstance().sesion.guardar(BaseConfig);
        }
        rs = ModelConfig.getInstance().sesion.cargar(1)

        if(propName != ""){
            if( rs[propName] != undefined ){
                return rs[propName]
            }else{
                rs[propName] = BaseConfig[propName]
                this.getInstance().sesion.guardar(rs);
                return rs[propName]
            }
        }
        return rs;
    }

    static getValueOrDefault(name){
        const all = ModelConfig.get()

        if(all[name] == undefined){
            if(BaseConfig[name] != undefined){
                ModelConfig.change(name, BaseConfig[name])
                return BaseConfig[name]
            }
            console.log("no existe el valor defualt para '" + name + "'")
        }else{
            return all[name] 
        }
    }

    static change(propName, propValue){
        var all = ModelConfig.get();
        all[propName] = propValue;
        ModelConfig.getInstance().sesion.guardar(all); 
    }

    getAll(){
        return this.sesion.cargarGuardados();
    }

    getFirst(){
        if(!this.sesion.hasOne()){
            this.sesion.guardar(BaseConfig);
        }
        return(this.sesion.getFirst())
    }

};

export default ModelConfig;