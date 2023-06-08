import CRouter from "./router.js";
import {
    getProducts_controller, getProductById_controller,
    createProduct_controller, updateProduct_controller,
    deleteProduct_controller
} from "../controllers/products.controller.js";

export default class ProductRouter extends CRouter{
    init(){

        this.get("/",["PUBLIC"], getProducts_controller);
        
        this.get("/:pid?",["PUBLIC"], getProductById_controller);
        
        this.post("/",["ADMIN", "PREMIUM"], createProduct_controller);
        
        this.put('/:pid',["ADMIN", "PREMIUM"], updateProduct_controller);
        
        this.delete("/:pid",["ADMIN", "PREMIUM"], deleteProduct_controller);
    }
}