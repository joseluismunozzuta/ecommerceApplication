import {
    getCarts_controller, createCart_controller,
    updateCart_controller, deleteProductFromCart_controller,
    emptyCart_controller, getCartById
} from "../controllers/carts.controller.js";
import { checkAuthentication, setUserIfSigned } from "../utils.js";
import CRouter from "./router.js";

export default class CartRouter extends CRouter{
    init(){
        this.get("/",["PUBLIC"], getCarts_controller);

        this.post("/",["PUBLIC"], createCart_controller);

        this.get("/:cid",["PUBLIC"], getCartById); //validar que el id del user logueado sea el que se quiere hacer cambios
        
        this.put("/:cid/products/:pid",["PUBLIC"], setUserIfSigned('jwt'), checkAuthentication(), updateCart_controller);
        
        this.delete("/:cid/products/:pid",["PUBLIC"], setUserIfSigned('jwt'), checkAuthentication(), deleteProductFromCart_controller);
        
        this.delete("/:cid",["PUBLIC"], emptyCart_controller);
    }
}