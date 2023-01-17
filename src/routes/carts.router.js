import express from "express";
import { CartManager, ProductManager } from "../FileManager.js";
import path from "path";

const cartRouter = express.Router();
const cartFileManager = new CartManager(path.resolve(process.cwd(), "public", "carts.json"));
const productFileManager = new ProductManager(
    path.resolve(process.cwd(), "public", "productos.json"));

cartRouter.get("/", async (req, res) => {

    await cartFileManager.getAll().then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send(err.message);
    })

})

cartRouter.get("/:cid?", async (req, res) => {

    let cartId = parseInt(req.params.cid);

    await cartFileManager.getAll().then((data) => {
        if (cartId) {
            const cart = data.find((c) => c.id === cartId);
            if (cart) {
                res.send(cart.products);
            } else {
                res.status(404).send("Product not found");
                return;
            }
        } else {
            res.send(data);
        }
    }).catch((err) => {
        res.status(500).send(err.message);
    })

})

cartRouter.post("/", async (req, res) => {
    let products = [];
    const c = cartFileManager.createCart(products);

    await cartFileManager.addCart(c).then((data) => {
        console.log("Cart created with ID ", data.id)
        res.send(data);
    }).catch((e) => {
        console.log(e.message);
        res.status(500).send(e.message);
    })
})

cartRouter.post("/:cid/product/:pid", async (req, res) => {

    let productIdToAdd = parseInt(req.params.pid);
    let cartId = parseInt(req.params.cid);

    const carts = await cartFileManager.getAll();
    const products = await productFileManager.getAll();

    await cartFileManager.addProductToCart(carts, cartId, products, productIdToAdd).then((data)=>{
        if(data === -1){
            res.status(404).send("Cart not found");
        }else if(data === -2){
            res.status(404).send("Product not found");
        }
        console.log("Cart updated");
        res.send(data);
    }).catch((err) => {
        res.status(500).send(err.message);
    })

})

export default cartRouter;