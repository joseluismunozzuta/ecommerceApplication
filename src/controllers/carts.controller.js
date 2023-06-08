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
        req.logger.debug("Cart created with ID: ", data.id)
        res.send(data);
    }).catch((e) => {
        req.logger.error(e.message);
        res.status(500).send(e.message);
    })

}

export const updateCart_controller = async (req, res) => {

    let productIdToAdd = req.params.pid;
    let cartId = req.params.cid;
    let { quantity } = req.body;
    await cartService.addProductToCart(req, cartId, productIdToAdd, quantity).then((data) => {
        req.logger.debug("Cart updated");
        res.send({ status: "success", payload: data });
    }).catch((err) => {
        res.sendServerError(err);
    })

}

export const deleteProductFromCart_controller = async (req, res) => {

    let cartId = req.params.cid;
    let productId = req.params.pid;

    await cartService.deleteProductFromCart(cartId, productId).then((data) => {
        req.logger.debug("Cart updated");
        res.send({ status: "success", payload: data });
    }).catch((err) => {
        res.status(500).send(err.message);
    })

}

export const emptyCart_controller = async (req, res) => {

    let cartId = req.params.cid;

    await cartService.deleteAllCart(req, cartId).then((data) => {
        req.logger.debug("Cart deleted");
        res.send({ status: "success", payload: data });
    }).catch((err) => {
        res.status(500).send(err.message);
    })

}

export const purchase_controller = async (req, res) => {

    let amount = req.body.amount;
    let purchaser = req.user.user.email;
    let cartId = req.params.cid;
    let prods_outofStock = [];
    let prods_purchase = [];
    let purchase = false;
    const payload = {};
    req.logger.debug(`Cart id doing purchase is ${cartId}`);

    (async () => {
        try {
            await cartService.searchById(cartId)
                .then(async (cart) => {

                    for (const p of cart.products) {

                        const product = await prodService.getProductById(p.product._id);

                        if (!(p.quantity < product.stock)) {
                            //No se comprara este producto
                            req.logger.debug("La cantidad seleccionada excede el stock");
                            prods_outofStock.push({
                                name: p.product.title,
                                price: p.product.price,
                                url: p.product.thumbnail,
                                quantity: p.quantity
                            });
                            amount = amount - p.quantity * p.product.price;
                            req.logger.debug("New amount: " + amount);
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
                            prods_purchase.push({
                                id: p.product._id,
                                name: p.product.title,
                                quantity: p.quantity,
                                price: p.product.price,
                                prodtotalamount: Math.round(100 * (p.product.price * p.quantity)) / 100
                            });
                        }
                    }
                });

            if (!purchase) {
                return res.sendServerError("No se puede comprar ningun producto");
            } else {
                amount = Math.round(100 * amount) / 100;
                const ticket = new TicketDTO({ amount, purchaser, prods_purchase, prods_outofStock });
                await ticketService.create(ticket)
                    .then((data) => {
                        req.logger.debug("Ticket created");
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
                        req.logger.error(err.message);
                        res.sendServerError(err.message);
                    })

                for (const p of prods_purchase) {
                    await cartService.deleteProductFromCart(req, cartId, p.id.toString())
                        .catch((err) => {
                            req.logger.error(err.message);
                            res.sendServerError(err.message);
                        })
                        req.logger.debug(p.name + " deleted from cart");
                }

                res.send({ status: "success", payload: payload });
            }

        } catch (error) {
            req.logger.error(error);
            res.sendServerError(error.message);
        }
    })();

}