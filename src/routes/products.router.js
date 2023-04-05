import express from "express";
import { ProductDBManager } from "../dao/DBManager.js";
import socketServer from "../app.js";

const productRouter = express.Router();
const productDBManager = new ProductDBManager();

productRouter.get("/", async (req, res) => {

    const queryParams = req.query;

    try {
        const productos = await productDBManager.getProducts(req.query);
        res.send(productos);
    } catch (err) {
        res.status(500).send(err.message);
    }

});

productRouter.get("/:pid?", async (req, res) => {

    const { pid } = req.params;
    if (pid) {
        await productDBManager.getProductById(pid).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send(err.message);
        })

    }
    else {
        res.status(404).send("Not ID");
    }

})

productRouter.post('/', async (req, res) => {
    const product = { ...req.body };

    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.category || !product.code || !product.stock) {
        return res.status(400).send({ status: "error", error: "Incomplete values" })
    }

    await productDBManager.create(product).then((data) => {
        console.log(`Product succesfully created with ID: ` + data.id);
        socketServer.emit('productadded', data);
        res.send({ status: "success", payload: data });
    }).catch((e) => {
        console.log(e.message);
        res.status(500).send(e.message);
    })

})

productRouter.put('/:pid', async (req, res) => {

    const product = { ...req.body };
    let productToUpdate = req.params.pid;

    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.category || !product.code || !product.stock) {
        return res.status(400).send({ status: "error", error: "Incomplete values" })
    }

    await productDBManager.update(productToUpdate, product).then((data) => {
        console.log(`Product succesfully updated with ID: ` + data.id);
        socketServer.emit('productupdated', data);
        res.send({ status: "success", payload: data });
    }).catch((e) => {
        console.log(e.message);
        res.status(500).send(e.message);
    })

})

productRouter.delete("/:pid", async (req, res) => {

    let productToDelete = req.params.pid;

    await productDBManager.delete(productToDelete).then((data) => {
        console.log(`Product succesfully deleted with ID: ` + data.id);
        socketServer.emit('productdeleted', data.id);
        res.send({ status: "success", payload: data });
    }).catch((e) => {
        console.log(e.message);
        res.status(500).send(e.message);
    })
})

export default productRouter;