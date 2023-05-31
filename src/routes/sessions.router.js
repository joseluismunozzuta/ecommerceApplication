import CRouter from './router.js';
import { passportCall, IfAuthenticated } from '../utils.js';
import { goLogin_controller, goSignUp_controller, 
    registerUser_controller, signIn_controller,
logout,getAllUsers_controller } from '../controllers/users.controller.js';

export default class SessionRouter extends CRouter {
    init() {

        this.get("/current", ["PUBLIC"], passportCall('jwt'), IfAuthenticated(), (req, res) => {
            res.sendSuccess(req.user);
        })

        this.get("/getusers", ["PUBLIC"], getAllUsers_controller);

        this.get("/login", ["PUBLIC"], passportCall('jwt'), goLogin_controller);

        this.get("/signup", ["PUBLIC"], passportCall('jwt'), goSignUp_controller);

        this.post("/signup", ["PUBLIC"], registerUser_controller);

        this.post("/login", ["PUBLIC"], signIn_controller);

        this.post('/logout', ["PUBLIC"], logout);

    }
}
