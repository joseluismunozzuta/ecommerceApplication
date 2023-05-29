import { userModel } from "../dao/models/user.model.js";
import CRouter from "./router.js";
import { passportCall, IfAuthenticated } from "../utils.js";

export default class ViewRouter extends CRouter{
    init(){
        this.get("/products", ["PUBLIC"], passportCall('jwt'), async (req, res) => {
            try {
        
                let user = new Map();
                let flag = false;
        
                if(req.user){
                    user = await userModel.findOne({ email: req.user.user.email }).
                    populate('cart').
                    lean();
                    if(user){
                        flag = true;
                    }
                }

                res.render("products", {
                    user: user,
                    style: 'products.css',
                    title: 'Products list',
                    flag,
                });
                
            } catch (err) {
                res.sendServerError("Internal error");
            }
        
        });
        
        this.get("/carts", ["PUBLIC"], passportCall('jwt'), IfAuthenticated(), async (req, res) => {

            if(req.user){
                let user = await userModel.findOne({ email: req.user.user.email }).
                populate('cart');
                let cartId = user.cart._id.toString();
                res.render('cart', {
                    style: 'cart.css',
                    title: 'Cart View',
                    cartId : cartId
                });
            }else{
                res.sendUserError("Not Authenticated");
            }
        })

    }
}