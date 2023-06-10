import CRouter from "./router.js";
import { modifyUser } from "../controllers/users.controller.js";

export default class UserRouter extends CRouter {
    init(){
        this.put("/premium/:uid", ["USER", "PREMIUM"], modifyUser);
    }
}