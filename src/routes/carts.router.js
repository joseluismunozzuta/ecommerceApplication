import {
    getCarts_controller, createCart_controller,
    updateCart_controller, deleteProductFromCart_controller,
    emptyCart_controller, getCartById, purchase_controller
} from "../controllers/carts.controller.js";
import CRouter from "./router.js";

export default class CartRouter extends CRouter{
    init(){
        this.get("/",["PUBLIC"], getCarts_controller);

        this.post("/",["PUBLIC"], createCart_controller);

        this.get("/:cid",["USER"], getCartById); //validar que el id del user logueado sea el que se quiere hacer cambios
        
        this.put("/:cid/products/:pid",["USER"], updateCart_controller);
        
        this.delete("/:cid/products/:pid",["USER"], deleteProductFromCart_controller);
        
        this.delete("/:cid",["USER"], emptyCart_controller);

        this.post("/:cid/purchase", ["USER"], purchase_controller);
    }
}