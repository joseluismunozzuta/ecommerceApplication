import express from "express";
import { userModel } from "../dao/models/user.model.js";

const viewRouter = express.Router();

viewRouter.get("/products", async (req, res) => {

    try {
        // const data = await productDBManager.getProducts(queryParams);
        // let productsArray = JSON.parse(JSON.stringify(data.docs));
        // let reversed = [];
        // for (let p of productsArray) {
        //     reversed.push(p);
        // }
        // let productosReversed = reversed.reverse();

        const user = await userModel.findOne({ email: req.session.user }).lean();

        let flag = true;

        if (!user) {
            flag = false;
        }

        res.render('products', {
            user: user,
            style: 'products.css',
            title: 'Products list',
            flag
        });
    } catch (err) {
        res.status(500).send(err.message);
    }

});

viewRouter.get("/carts", async (req, res) => {

    res.render('cart', {
        style: 'cart.css',
        title: 'Cart View'
    });

})

export default viewRouter;