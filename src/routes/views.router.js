import User from "../dao/classes/user.dao.js";
import Product from "../dao/classes/product.dao.js";
import CRouter from "./router.js";

const userService = new User();
const prodService = new Product();

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

    }
}