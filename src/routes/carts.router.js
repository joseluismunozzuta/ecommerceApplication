import {
    getCarts_controller, createCart_controller,
    updateCart_controller, deleteProductFromCart_controller,
    emptyCart_controller, getCartById
} from "../controllers/carts.controller.js";
import CRouter from "./router.js";

export default class CartRouter extends CRouter{
    init(){
        this.get("/",["PUBLIC"], getCarts_controller);

        this.get("/:cid",["PUBLIC"], getCartById);
        
        this.post("/",["PUBLIC"], createCart_controller);
        
        this.put("/:cid/products/:pid",["PUBLIC"], updateCart_controller);
        
        this.delete("/:cid/products/:pid",["PUBLIC"], deleteProductFromCart_controller);
        
        this.delete("/:cid",["PUBLIC"],  emptyCart_controller);
    }
}