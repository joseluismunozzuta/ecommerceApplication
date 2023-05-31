import User from "../dao/classes/user.dao.js";
import CRouter from "./router.js";
import { setUserIfSigned, checkAuthentication } from "../utils.js";

const userService = new User();

export default class ViewRouter extends CRouter{
    init(){
        this.get("/products", ["PUBLIC"], setUserIfSigned('jwt'), async (req, res) => {
            try {
        
                let user = new Map();
                let cartId;
                let flag = false;
        
                if(req.user){   
                    user = await userService.searchByEmail(req.user.user.email);
                    if(user){
                        //This means authentication is okay
                        flag = true;
                        cartId = user.cart._id.toString();
                    }
                }

                res.render("products", {
                    user: user,
                    style: 'products.css',
                    title: 'Products list',
                    cartId: cartId,
                    flag,
                });
                
            } catch (err) {
                res.sendServerError("Internal error");
            }
        
        });
        
        this.get("/mycart", ["PUBLIC"], setUserIfSigned('jwt'), checkAuthentication(), async (req, res) => {

            if(req.user){
                let user = await userService.searchByEmail(req.user.user.email);
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