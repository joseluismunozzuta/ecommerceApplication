import express from "express";
import { ProductManager } from "../FileManager.js";
import path from "path";

const viewRouter = express.Router();
const productFileManager = new ProductManager(path.resolve(process.cwd(), "src/public", "productos.json"));

viewRouter.get("/products", async (req, res) => {

    try {
        const productos = await productFileManager.getAll();

        let user = {
            role: "admin",
            name: "Jose",
            last_name: "Munoz"
        }
        res.render('products', {
            user: user, 
            style: 'products.css', 
            isAdmin: user.role==="admin", 
            productos});
    } catch (err) {
        res.status(500).send(err.message);
    }

});

export default viewRouter;