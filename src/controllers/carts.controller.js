import { CartDBManager } from "../dao/DBManager.js";
const cartDBManager = new CartDBManager();

export const getCarts_controller = async (req, res) => {

    await cartDBManager.read().then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send(err.message);
    })

}

export const getCartById = async (req, res) =>{
    const cartId = req.params.cid;
    await cartDBManager.searchById(cartId).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send(err.message);
    })
}

export const createCart_controller = async (req, res) => {

    let products = [];

    await cartDBManager.create(products).then((data) => {
        console.log("Cart created with ID: ", data.id)
        res.send(data);
    }).catch((e) => {
        console.log(e.message);
        res.status(500).send(e.message);
    })

}

export const updateCart_controller = async (req, res) => {

    let productIdToAdd = req.params.pid;
    let cartId = req.params.cid;
    let { quantity } = req.body;
    await cartDBManager.addProductToCart(cartId, productIdToAdd, quantity).then((data) => {
        console.log("Cart updated");
        res.send({ status: "success", payload: data });
    }).catch((err) => {
        res.status(500).send(err.message);
    })

}

export const deleteProductFromCart_controller = async (req, res) => {

    let cartId = req.params.cid;
    let productId = req.params.pid;

    await cartDBManager.deleteProductFromCart(cartId, productId).then((data) => {
        console.log("Cart updated");
        res.send({ status: "success", payload: data });
    }).catch((err) => {
        res.status(500).send(err.message);
    })

}

export const emptyCart_controller = async (req, res) => {

    let cartId = req.params.cid;

    await cartDBManager.deleteAllCart(cartId).then((data) => {
        console.log("Cart deleted");
        res.send({ status: "success", payload: data });
    }).catch((err) => {
        res.status(500).send(err.message);
    })

}