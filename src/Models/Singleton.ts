import StorageSesion from '../Helpers/StorageSesion.ts';
import Sale from './Sale.ts';
import Sales from './Sales.ts';

import BaseConfig from "../definitions/BaseConfig.ts";


class Singleton{
    static instance = null;

    static getInstance(){
        if(this.instance == null){
            console.log("new " + this.prototype.constructor.name + "()" );
            this.instance = eval("new " + this.prototype.constructor.name + "()" );
        }

        return this.instance;
    }
};

export default Singleton;