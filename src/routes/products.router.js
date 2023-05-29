import CRouter from "./router.js";
import { passportCall, IfAuthenticated } from "../utils.js";
import {
    getProducts_controller, getProductById_controller,
    createProduct_controller, updateProduct_controller,
    deleteProduct_controller
} from "../controllers/products.controller.js";

export default class ProductRouter extends CRouter{
    init(){

        this.get("/",["PUBLIC"], async (req, res) => {

            await getProducts_controller(req, res);
        
        });
        
        this.get("/:pid?",["PUBLIC"], async (req, res) => {
        
            await getProductById_controller(req, res);
        
        })
        
        this.post('/',["PUBLIC"], async (req, res) => {
        
            await createProduct_controller(req, res);
        
        })
        
        this.put('/:pid',["PUBLIC"], async (req, res) => {
        
            await updateProduct_controller(req, res);
        
        })
        
        this.delete("/:pid",["PUBLIC"], async (req, res) => {
        
            await deleteProduct_controller(req, res);
        
        })
    }
}