import CRouter from './router.js';
import { userModel } from "../dao/models/user.model.js";
import { generateToken, passportCall, IfAuthenticated } from '../utils.js';
import { createHash, isValidPassword } from '../utils.js';
import { cartModel } from '../dao/models/carts.model.js';
import { goLogin_controller, goSignUp_controller, 
    registerUser_controller, signIn_controller,
logout } from '../controllers/users.controller.js';

export default class SessionRouter extends CRouter {
    init() {

        this.get("/current", ["PUBLIC"], passportCall('jwt'), IfAuthenticated(), (req, res) => {
            res.sendSuccess(req.user);
        })

        this.get("/getusers", ["PUBLIC"], async (req, res) => {
            try {
                const users = await userModel.paginate();
                res.send(users);
            } catch (err) {
                console.log(err);
                res.status(500).send(err.message);
            }
        })

        this.get("/login", ["PUBLIC"], passportCall('jwt'), goLogin_controller);

        this.get("/signup", ["PUBLIC"], passportCall('jwt'), goSignUp_controller);

        this.post("/signup", ["PUBLIC"], registerUser_controller);

        this.post("/login", ["PUBLIC"], signIn_controller);

        this.post('/logout', ["PUBLIC"], logout);

    }
}
