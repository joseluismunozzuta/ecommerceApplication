import express from "express";
import { ProductManager } from "../FileManager.js";
import path from "path";
import socketServer from "../app.js";

const productRouter = express.Router();
const productFileManager = new ProductManager(path.resolve(process.cwd(), "src/public", "productos.json"));

productRouter.get("/", async (req, res) => {

    const { limit } = req.query;

    try {
        const productos = await productFileManager.getAll();
        let limitedProducts;
        if (limit) {
            limitedProducts = productos.slice(0, limit);
            res.send(limitedProducts);
        } else {
            res.send(productos);
        }
    } catch (err) {
        res.status(500).send(err.message);
    }

});

productRouter.get("/:pid?", async (req, res) => {

    const { pid } = req.params;

    await productFileManager.getAll().then((data) => {
        let productSearched;
        if (pid) {
            productSearched = data.find(e => e.id == pid);
            if (productSearched) {
                res.send(productSearched);
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

productRouter.post('/', async (req, res) => {
    let product = req.body;

    if (!product.title || !product.description || !product.price || !product.category || !product.code || !product.stock) {
        return res.status(400).send({ status: "error", error: "Incomplete values" })
    }

    const p = productFileManager.crearProducto(product.title, product.description, product.price, product.category, product.thumbnail, product.code, product.stock, true);

    await productFileManager.add(p).then((data) => {
        console.log("Product created with ID ", data.id);
        socketServer.emit('productadded', data);
        res.send(data);
    }).catch((e) => {
        console.log(e.message);
        res.status(500).send(e.message);
    })

})

productRouter.put('/:pid', async (req, res) => {

    let product = req.body;
    let productToUpdate = req.params.pid;

    if (!product.title || !product.description || !product.price || !product.category || !product.code || !product.stock) {
        return res.status(400).send({ status: "error", error: "Incomplete values" })
    }

    const p = productFileManager.crearProducto(product.title, product.description, product.price, product.category, product.thumbnail, product.code, product.stock, true);

    await productFileManager.update(productToUpdate, p).then((data) => {
        if (data === -1) {
            res.status(404).send("Product not found");
            return;
        }else{
            console.log("Successful update for product with ID ", data.id);
            res.send(data);
        }
    }).catch((e) => {
        console.log(e.message);
        res.status(500).send(e.message);
    })

})

productRouter.delete("/:pid", async (req, res) => {

    const productToDelete = parseInt(req.params.pid);

    await productFileManager.delete(productToDelete).then((data) => {
        if(data === false){
            res.status(404).send("Product not found");
            return;
        }else{
            console.log("Deleted product with ID ", productToDelete);
            socketServer.emit('productdeleted', productToDelete);
            res.send({ status: "success", message: "Product deleted" })
        }
    }).catch((e) => {
        console.log(e.message);
        res.status(500).send(e.message);
    })
})

export default productRouter;