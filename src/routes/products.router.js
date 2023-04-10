import express from "express";
import {
    getProducts_controller, getProductById_controller,
    createProduct_controller, updateProduct_controller,
    deleteProduct_controller
} from "../controllers/products.controller.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {

    await getProducts_controller(req, res);

});

productRouter.get("/:pid?", async (req, res) => {

    await getProductById_controller(req, res);

})

productRouter.post('/', async (req, res) => {

    await createProduct_controller(req, res);

})

productRouter.put('/:pid', async (req, res) => {

    await updateProduct_controller(req, res);

})

productRouter.delete("/:pid", async (req, res) => {

    await deleteProduct_controller(req, res);

})

export default productRouter;