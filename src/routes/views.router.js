import User from "../dao/classes/user.dao.js";
import Product from "../dao/classes/product.dao.js";
import CRouter from "./router.js";
import Ticket from "../dao/classes/ticket.dao.js";
import Message from "../dao/classes/message.dao.js";
import { checkDocs, defineRoleFlags } from "../utils.js";

const userService = new User();
const prodService = new Product();
const ticketService = new Ticket();
const messageService = new Message();

export default class ViewRouter extends CRouter {
    init() {

        this.get("/products/:pagina?", ["PUBLIC"], async (req, res) => {
            let pagina;
            let base64img;

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

                if (req.user) {
                    user = await userService.searchByEmail(req.user.user.email);
                    if (user) {
                        cartId = user.cart._id.toString();
                        if (user.profileimage) {
                            base64img = user.profileimage.data.toString('base64');
                        }
                    }
                } else {
                    req.logger.debug("No user.");
                }

                const { adminflag, premiumflag, userflag, flag } = defineRoleFlags(user);

                res.render("products", {
                    pagina: pagina,
                    user: user,
                    style: 'products.css',
                    title: 'Products list',
                    cartId: cartId,
                    flag,
                    adminflag,
                    premiumflag,
                    userflag,
                    base64img
                });

            } catch (err) {
                req.logger.error(err);
                res.sendServerError();
            }

        });

        this.get("/mycart", ["USER", "PREMIUM"], async (req, res) => {

            // if (req.user) {
            let user = await userService.searchByEmail(req.user.user.email);
            let base64img;
            if (user.profileimage) {
                base64img = user.profileimage.data.toString('base64');
            }
            const { adminflag, premiumflag, userflag, flag } = defineRoleFlags(user);
            let cartId = user.cart._id.toString();
            if (user.profileimage) {
                base64img = user.profileimage.data.toString('base64');
            }
            res.render('cart', {
                style: 'cart.css',
                title: 'Cart View',
                cartId: cartId,
                flag,
                adminflag,
                premiumflag,
                userflag,
                user,
                base64img
            });
            // } else {
            //     res.sendUserError("Not Authenticated");
            // }
        });

        this.get("/createproduct", ["ADMIN", "PREMIUM"], async (req, res) => {

            try {
                const user = await userService.searchByEmail(req.user.user.email);
                let base64img;
                if (user.profileimage) {
                    base64img = user.profileimage.data.toString('base64');
                }
                const { adminflag, premiumflag, userflag, flag } = defineRoleFlags(user);

                res.render("createprod", {
                    edit: false,
                    style: 'productform.css',
                    title: 'Create Product',
                    flag,
                    adminflag,
                    premiumflag,
                    userflag,
                    user,
                    base64img
                });
            } catch (err) {
                req.logger.error(err);
                res.sendServerError();
            }

        });

        this.get("/editprod/:pid", ["ADMIN", "PREMIUM"], async (req, res) => {

            let prodid = req.params.pid;
            const user = await userService.searchByEmail(req.user.user.email);
            let base64img;
            if (user.profileimage) {
                base64img = user.profileimage.data.toString('base64');
            }
            await prodService.getProductById(prodid).
                then(async (product) => {
                    const prodOb = product.toObject();
                    const { adminflag, premiumflag, userflag, flag } = defineRoleFlags(user);
                    res.render("createprod", {
                        product: prodOb,
                        edit: true,
                        style: 'productform.css',
                        title: 'Edit Product',
                        flag,
                        adminflag,
                        premiumflag,
                        userflag,
                        user,
                        base64img
                    });
                }).catch((err) => {
                    req.logger.error(err);
                    res.sendServerError("Product not found");
                });
        });

        this.get("/purchasedone/:tid", ["USER", "ADMIN", "PREMIUM"], async (req, res) => {

            let ticketid = req.params.tid;
            let partialPurchaseflag = false;
            const user = await userService.searchByEmail(req.user.user.email);
            let base64img;
            if (user.profileimage) {
                base64img = user.profileimage.data.toString('base64');
            }
            await ticketService.getById(ticketid).
                then((ticket) => {

                    if (req.user.user.role !== "admin" &&
                        req.user.user.email !== ticket.purchaser) {
                        return res.sendForbidden();
                    }

                    const ticketOb = ticket.toObject();

                    if (ticketOb.outofstockprods.length !== 0) {
                        partialPurchaseflag = true;
                    }

                    const { adminflag, premiumflag, userflag, flag } = defineRoleFlags(user);

                    res.render("purchase", {
                        partialPurchaseflag,
                        ticket: ticketOb,
                        style: 'purchase.css',
                        title: 'Purchase Done',
                        flag,
                        adminflag,
                        premiumflag,
                        userflag,
                        user,
                        base64img
                    });
                }).catch((err) => {
                    req.logger.error(err);
                    res.sendServerError("Ticket not found");
                });
        });

        this.get("/chat", ["USER", "PREMIUM"], async (req, res) => {
            let base64img;
            const user = await userService.searchByEmail(req.user.user.email);
            if (user.profileimage) {
                base64img = user.profileimage.data.toString('base64');
            }

            await messageService.read()
                .then((messages) => {

                    let messagesArray = [];

                    for (const m of messages) {
                        var l = m.user.charAt(0);
                        const mo = m.toObject();
                        mo.first = l;
                        if (m.user == user.email) {
                            mo.mine = true;
                        }
                        messagesArray.push(mo);
                    }
                    const { adminflag, premiumflag, userflag, flag } = defineRoleFlags(user);

                    res.render("chat", {
                        mymessages: messagesArray,
                        style: 'chat.css',
                        title: 'Chat',
                        userId: req.user.user.email,
                        flag,
                        adminflag,
                        premiumflag,
                        userflag,
                        user,
                        base64img
                    })
                });
        })

        this.get("/profile", ["USER", "ADMIN", "PREMIUM"], async (req, res) => {
            try {

                let doc1 = false;
                let doc2 = false;
                let doc3 = false;
                let completed = false;
                let base64img;
                const profile = await userService.searchByEmail(req.user.user.email);
                completed = (profile.status == "Complete");
                if (profile.profileimage) {
                    base64img = profile.profileimage.data.toString('base64');
                }
                const { adminflag, premiumflag, userflag, flag } = defineRoleFlags(profile);

                if (profile.role != "admin") {
                    ({ doc1, doc2, doc3 } = checkDocs(profile));
                    req.logger.debug(doc1);
                    req.logger.debug(doc2);
                    req.logger.debug(doc3);

                }

                res.render('profile', {
                    title: 'Profile',
                    style: 'profile.css',
                    user: profile,
                    base64img,
                    flag,
                    adminflag,
                    premiumflag,
                    userflag,
                    doc1,
                    doc2,
                    doc3,
                    completed
                })
            } catch (err) {
                req.logger.error(err);
                return res.sendServerError();
            }
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
                res.render("forgotpassword", {
                    excludePartial: true
                });
            } else {
                res.redirect("/views/profile");
            }
        });

        this.get("/resetpassword", ["PUBLIC"], (req, res) => {
            const token = req.query.token;
            if (!req.user) {
                res.render("resetpassword",
                    {
                        token,
                        excludePartial: true
                    });
            } else {
                res.redirect("/api/views/profile");
            }

        });

        this.all("/*", (req, res) => {
            req.logger.debug("Route undefined");
            res.sendNotFound();
        })

    }
}