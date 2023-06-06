import Cart from "../dao/classes/cart.dao.js";
import TicketDTO from "../dao/DTOs/ticket.dto.js";
import Ticket from "../dao/classes/ticket.dao.js";
import Product from "../dao/classes/product.dao.js";

const prodService = new Product();
const cartService = new Cart();
const ticketService = new Ticket();

export const getCarts_controller = async (req, res) => {

    await cartService.read().then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send(err.message);
    })

}

export const getCartById = async (req, res) => {
    const cartId = req.params.cid;
    await cartService.searchById(cartId).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send(err.message);
    })
}

export const createCart_controller = async (req, res) => {

    let products = [];

    await cartService.create(products).then((data) => {
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
    await cartService.addProductToCart(cartId, productIdToAdd, quantity).then((data) => {
        console.log("Cart updated");
        res.send({ status: "success", payload: data });
    }).catch((err) => {
        res.status(500).send(err.message);
    })

}

export const deleteProductFromCart_controller = async (req, res) => {

    let cartId = req.params.cid;
    let productId = req.params.pid;

    await cartService.deleteProductFromCart(cartId, productId).then((data) => {
        console.log("Cart updated");
        res.send({ status: "success", payload: data });
    }).catch((err) => {
        res.status(500).send(err.message);
    })

}

export const emptyCart_controller = async (req, res) => {

    let cartId = req.params.cid;

    await cartService.deleteAllCart(cartId).then((data) => {
        console.log("Cart deleted");
        res.send({ status: "success", payload: data });
    }).catch((err) => {
        res.status(500).send(err.message);
    })

}

export const purchase_controller = async (req, res) => {

    let amount = req.body.amount;
    let purchaser = req.user.user.email;
    let cartId = req.params.cid;
    console.log(cartId);
    let prods_outofStock = [];
    let prods_purchase = [];
    let purchase = false;
    const payload = {};

    (async () => {
        try {
            await cartService.searchById(cartId)
                .then(async (cart) => {

                    for (const p of cart.products) {

                        const product = await prodService.getProductById(p.product._id);

                        if (!(p.quantity < product.stock)) {
                            //No se comprara este producto
                            console.log("La cantidad seleccionada excede el stock");
                            prods_outofStock.push(p.product._id);
                            amount = amount - p.quantity * p.product.price;
                            console.log("New amount: " + amount);
                        } else {
                            purchase = true;
                            //Se comprara este producto
                            //Se actualiza el stock del producto
                            //Se creara un ticket
                            product.stock = product.stock - p.quantity;
                            await prodService.update(p.product._id, product)
                                .catch((err) => {
                                    res.sendServerError(err.message);
                                });
                            prods_purchase.push(p.product._id);
                        }
                    }
                });

            // PHASE 2
            console.log("Phase 1 completed.");
            if (!purchase) {
                return res.sendServerError("No se puede comprar ningun producto");
            } else {

                const ticket = new TicketDTO({ amount, purchaser });
                await ticketService.create(ticket)
                    .then((data) => {
                        console.log("Ticket created");
                        if (!prods_outofStock.length == 0) {
                            //Hay productos que no fueron comprados
                            //Enviamos el ticket y los productos que faltan comprar
                            payload.ticket = data;
                            payload.prodsError = prods_outofStock;
                        } else {
                            //Compra totalmente exitosa
                            payload.ticket = data;
                        }

                    }).catch((err) => {
                        console.log(err.message);
                        res.sendServerError(err.message);
                    })

                console.log("Phase 2 completed.");

                // PHASE 3
                for (const p of prods_purchase) {
                    console.log(p);
                    await cartService.deleteProductFromCart(cartId, p.toString())
                        .catch((err) => {
                            console.log(err.message);
                            res.sendServerError(err.message);
                        })
                    console.log(p + " deleted from cart");
                }

                console.log("Phase 3 completed");

                res.send({ status: "success", payload: payload });
            }

        } catch (error) {
            // Handle any errors that occurred
            console.error(error);
            res.sendServerError(error.message);
        }
    })();





}