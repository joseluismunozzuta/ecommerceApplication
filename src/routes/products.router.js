import CRouter from "./router.js";
import { passportCall, IfAuthenticated } from "../utils.js";
import {
    getProducts_controller, getProductById_controller,
    createProduct_controller, updateProduct_controller,
    deleteProduct_controller
} from "../controllers/products.controller.js";

export default class ProductRouter extends CRouter{
    init(){

        this.get("/",["PUBLIC"], getProducts_controller);
        
        this.get("/:pid?",["PUBLIC"], getProductById_controller);
        
        this.post('/',["PUBLIC"], createProduct_controller);
        
        this.put('/:pid',["PUBLIC"], updateProduct_controller);
        
        this.delete("/:pid",["PUBLIC"], deleteProduct_controller);
    }
}