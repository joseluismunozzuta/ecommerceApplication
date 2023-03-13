import express from "express";
import { CartManager, ProductManager } from "../dao/FileManager.js";
import { CartDBManager, ProductDBManager } from "../dao/DBManager.js";
import path from "path";

const cartRouter = express.Router();
// const cartFileManager = new CartManager(path.resolve(process.cwd(), "src/public", "carts.json"));
// const productFileManager = new ProductManager(
//     path.resolve(process.cwd(), "src/public", "productos.json"));
const cartDBManager = new CartDBManager();
const productDBManager = new ProductDBManager();

cartRouter.get("/", async (req, res) => {

    await cartDBManager.read().then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send(err.message);
    })

})

cartRouter.post("/", async (req, res) => {

    let products = [];

    await cartDBManager.create(products).then((data) => {
        console.log("Cart created with ID: ", data.id)
        res.send(data);
    }).catch((e) => {
        console.log(e.message);
        res.status(500).send(e.message);
    })
})

cartRouter.put("/:cid/products/:pid", async (req, res) => {

    let productIdToAdd = req.params.pid;
    let cartId = req.params.cid;
    let {quantity} = req.body;
    console.log(quantity);
    await cartDBManager.addProductToCart(cartId, productIdToAdd, quantity).then((data) => {
        console.log("Cart updated");
        res.send({status:"success", payload: data});
    }).catch((err) => {
        res.status(500).send(err.message);
    })

})

cartRouter.delete("/:cid/products/:pid"), async(req, res) =>{
    let cartId = req.params.cid;
    let productId = req.params.pid;
    
    await cartDBManager.deleteProductFromCart(cartId, productId).then((data) =>{
        console.log("Cart updated");
        res.send({status:"success", payload: data});
    }).catch((err) =>{
        res.status(500).send(err.message);
    })
}

export default cartRouter;