import User from "../dao/classes/user.dao.js";
import Product from "../dao/classes/product.dao.js";
import CRouter from "./router.js";
import Ticket from "../dao/classes/ticket.dao.js";
import Message from "../dao/classes/message.dao.js";

const userService = new User();
const prodService = new Product();
const ticketService = new Ticket();
const messageService = new Message();

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

        this.get("/mycart", ["USER", "PREMIUM"], async (req, res) => {

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

        this.get("/createproduct", ["ADMIN", "PREMIUM"], async (req, res) => {

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

        this.get("/editprod/:pid", ["ADMIN", "PREMIUM"], async (req, res) => {

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
                    req.logger.error("Ticket not found");
                    res.sendServerError("Ticket not found");
                });
        });

        this.get("/chat", ["USER"], async (req, res) => {

            await messageService.read()
                .then((messages) => {
                    let messagesArray = [];
                    const messObj = messages;
                    for (const m of messObj) {
                        var l = m.user.charAt(0);
                        const mo = m.toObject();
                        mo.first = l;
                        messagesArray.push(mo);
                    }

                    res.render("chat", {
                        messages: messagesArray,
                        style: 'chat.css',
                        title: 'Chat',
                        userId: req.user.user.email,
                    })
                });
        })

        this.get("/testlogger", ["PUBLIC"], async (req, res) => {
            req.logger.fatal("This is a fatal message");
            req.logger.error("This is a error message");
            req.logger.warning("This is a warning message");
            req.logger.info("This is a info message");
            req.logger.debug("This is a debug message");
            res.send("Test logger");
        })

        this.get("/forgotpassword", ["PUBLIC"], (req, res) => {
            if (!req.user) {
                res.render("forgotPassword")
            } else {
                res.redirect("/api/sessions/profile");
            }
        });

        this.get("/resetpassword", ["PUBLIC"], (req, res) => {
            const token = req.query.token;
            if (!res.user) {
                res.render("resetpassword",
                    {
                        token
                    });
            } else {
                res.redirect("/api/sessions/profile");
            }

        });
    }
}