import CRouter from './router.js';
import {checkAuthentication } from '../utils.js';
import { goLogin_controller, goSignUp_controller, 
    registerUser_controller, signIn_controller,
logout,getAllUsers_controller, myProfile_controller, resetpassword, forgetPassword } from '../controllers/users.controller.js';

export default class SessionRouter extends CRouter {
    init() {

        this.get("/current", ["PUBLIC"], checkAuthentication(), (req, res) => {
            res.sendSuccess(req.user);
        })

        this.get("/profile", ["USER", "ADMIN", "PREMIUM"], myProfile_controller);

        this.get("/getusers", ["PUBLIC"], getAllUsers_controller);

        this.get("/login", ["PUBLIC"], goLogin_controller);

        this.get("/signup", ["PUBLIC"], goSignUp_controller);

        this.post("/signup", ["PUBLIC"], registerUser_controller);

        this.post("/login", ["PUBLIC"], signIn_controller);

        this.post('/logout', ["PUBLIC"], logout);

        this.post('/resetpassword', ["PUBLIC"], resetpassword);

        this.post('/forgotpassword', ["PUBLIC"], forgetPassword);

    }
}
