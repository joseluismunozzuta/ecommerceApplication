import express from "express";
import { ProductManager } from "../dao/FileManager.js";
import { ProductDBManager } from "../dao/DBManager.js";
import path from "path";

const viewRouter = express.Router();
//const productFileManager = new ProductManager(path.resolve(process.cwd(), "src/public", "productos.json"));
const productDBManager = new ProductDBManager();

viewRouter.get("/products", async (req, res) => {

    const queryParams = req.query;

    try {
        const data = await productDBManager.getProducts(queryParams);
        let productsArray = JSON.parse(JSON.stringify(data.docs));
        let reversed = [];
        for (let p of productsArray) {
            reversed.push(p);
        }
        let productosReversed = reversed.reverse();

        let user = {
            role: "admin",
            name: "Jose",
            last_name: "Munoz"
        }
        res.render('home', {
            user: user,
            style: 'home.css',
            title: 'Products list',
            isAdmin: user.role === "admin",
            productosReversed,
            data
        });
    } catch (err) {
        res.status(500).send(err.message);
    }

});

viewRouter.get("/realtimeproducts", async (req, res) => {

    const queryParams = req.query;

    try {
        const productos = await productDBManager.getProducts(queryParams);
        let productsArray = JSON.parse(JSON.stringify(productos.docs));
        let reversed = [];
        for (let p of productsArray) {
            reversed.push(p);
        }
        let productosReversed = reversed.reverse();

        let user = {
            role: "admin",
            name: "Jose",
            last_name: "Munoz"
        }
        res.render('realtimeproducts', {
            user: user,
            style: 'products.css',
            title: 'Realtime Products list',
            isAdmin: user.role === "admin",
            productosReversed
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default viewRouter;