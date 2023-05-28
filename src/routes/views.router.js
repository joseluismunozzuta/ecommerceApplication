import express from "express";
import { userModel } from "../dao/models/user.model.js";
import CRouter from "./router.js";
import { passportCall } from "../utils.js";

export default class ViewRouter extends CRouter{
    init(){
        this.get("/products", ["PUBLIC"], passportCall('jwt'), async (req, res) => {
            console.log("TRACE");
            try {
        
                let user = new Map();
                let flag = false;
        
                if(req.user){
                    console.log(req.user.user.email);
                    user = await userModel.findOne({ email: req.user.user.email }).lean();
                    console.log(user);
                    if(user){
                        console.log("TRACE34");
                        flag = true;
                    }
                }        
                console.log("TRACE1");
                res.render("products", {
                    user: user,
                    style: 'products.css',
                    title: 'Products list',
                    flag
                });

                
                
            } catch (err) {
                res.status(500).send(err.message);
            }
        
        });
        
        this.get("/carts", ["PUBLIC"],async (req, res) => {
        
            res.render('cart', {
                style: 'cart.css',
                title: 'Cart View'
            });
        
        })
    }
}