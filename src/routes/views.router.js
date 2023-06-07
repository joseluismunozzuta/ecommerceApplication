import User from "../dao/classes/user.dao.js";
import Product from "../dao/classes/product.dao.js";
import CRouter from "./router.js";
import Ticket from "../dao/classes/ticket.dao.js";

const userService = new User();
const prodService = new Product();
const ticketService = new Ticket();

export default class ViewRouter extends CRouter {
    init() {
        this.get("/products/:pagina?", ["PUBLIC"], async (req, res) => {
            let pagina;

            //Logic to maintain the page when deleting a prod
            //Limit the max page we can access
            if (req.params.pagina) {
                pagina = parseInt(req.params.pagina);
                let currentMaxPage = await prodService.getTotalPagesProds().then(
                    (data) => {
                        return data;
                    });
                if (pagina > currentMaxPage) {
                    pagina = currentMaxPage;
                    return res.redirect(`/views/products/${pagina}`);
                }
            } else {
                pagina = 1;
            }

            try {

                let user = new Map();
                let cartId;
                let flag = false;
                let adminflag = false;

                if (req.user) {
                    user = await userService.searchByEmail(req.user.user.email);
                    if (user) {
                        //This means authentication is okay
                        flag = true;
                        cartId = user.cart._id.toString();
                        if (user.role == 'admin') {
                            adminflag = true;
                        }
                    }
                }

                res.render("products", {
                    pagina: pagina,
                    user: user,
                    style: 'products.css',
                    title: 'Products list',
                    cartId: cartId,
                    flag,
                    adminflag
                });

            } catch (err) {
                res.sendServerError("Internal error");
            }

        });

        this.get("/mycart", ["USER"], async (req, res) => {

            if (req.user) {
                let user = await userService.searchByEmail(req.user.user.email);
                let cartId = user.cart._id.toString();
                res.render('cart', {
                    style: 'cart.css',
                    title: 'Cart View',
                    cartId: cartId
                });
            } else {
                res.sendUserError("Not Authenticated");
            }
        });

        this.get("/createproduct", ["ADMIN"], async (req, res) => {

            if (!req.user) {
                res.sendUserError("Not Authenticated");
            } else {
                try {
                    res.render("createprod", {
                        edit: false,
                        style: 'productform.css',
                        title: 'Create Product',
                    });
                } catch (err) {
                    res.sendServerError("Internal error");
                }
            }


        });

        this.get("/editprod/:pid", ["ADMIN"], async (req, res) => {

            let prodid = req.params.pid;

            await prodService.getProductById(prodid).
                then((product) => {
                    const prodOb = product.toObject();
                    res.render("createprod", {
                        product: prodOb,
                        edit: true,
                        style: 'productform.css',
                        title: 'Edit Product',
                    });
                }).catch((err) => {
                    res.sendServerError("Product not found");
                });
        });

        this.get("/purchasedone/:tid", ["USER", "ADMIN"], async (req, res) => {

            let ticketid = req.params.tid;
            let partialPurchaseflag = false;

            await ticketService.getById(ticketid).
                then((ticket) => {

                    if (req.user.user.role !== "admin" &&
                        req.user.user.email !== ticket.purchaser) {
                        return res.sendForbidden("Forbidden");
                    }

                    const ticketOb = ticket.toObject();

                    if (ticketOb.outofstockprods.length !== 0) {
                        partialPurchaseflag = true;
                    }

                    res.render("purchase", {
                        partialPurchaseflag,
                        ticket: ticketOb,
                        style: 'purchase.css',
                        title: 'Purchase Done',
                    });
                }).catch((err) => {
                    res.sendServerError("Ticket not found");
                });
        });

    }
}