import express from "express";
import {
    getCarts_controller, createCart_controller,
    updateCart_controller, deleteProductFromCart_controller,
    emptyCart_controller
} from "../controllers/carts.controller.js";

const cartRouter = express.Router();

cartRouter.get("/", async (req, res) => {

    await getCarts_controller(req, res);

})

cartRouter.post("/", async (req, res) => {

    await createCart_controller(req, res);

})

cartRouter.put("/:cid/products/:pid", async (req, res) => {

    await updateCart_controller(req, res);

})

cartRouter.delete("/:cid/products/:pid", async (req, res) => {

    await deleteProductFromCart_controller(req, res);

})

cartRouter.delete("/:cid", async (req, res) => {

    await emptyCart_controller(req, res);

})

export default cartRouter;