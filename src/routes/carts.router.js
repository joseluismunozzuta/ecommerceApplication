import {
    getCarts_controller, createCart_controller,
    updateCart_controller, deleteProductFromCart_controller,
    emptyCart_controller
} from "../controllers/carts.controller.js";
import CRouter from "./router.js";

export default class CartRouter extends CRouter{
    init(){
        this.get("/",["PUBLIC"], async (req, res) => {

            await getCarts_controller(req, res);
        
        })
        
        this.post("/",["PUBLIC"], async (req, res) => {
        
            await createCart_controller(req, res);
        
        })
        
        this.put("/:cid/products/:pid",["PUBLIC"], async (req, res) => {
        
            await updateCart_controller(req, res);
        
        })
        
        this.delete("/:cid/products/:pid",["PUBLIC"], async (req, res) => {
        
            await deleteProductFromCart_controller(req, res);
        
        })
        
        this.delete("/:cid",["PUBLIC"],  async (req, res) => {
        
            await emptyCart_controller(req, res);
        
        })
    }
}