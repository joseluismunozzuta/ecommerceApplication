import CRouter from "./router.js";
import { modifyUser, uploadUserDocs } from "../controllers/users.controller.js";
import { uploadUserDocuments } from "../utils.js";

export default class UserRouter extends CRouter {
    init() {
        this.put("/premium/:uid", ["USER", "PREMIUM"], modifyUser);
        this.post("/:uid/documents", ["USER", "PREMIUM"],
            uploadUserDocuments.fields([
                { name: 'identificacion', maxCount: 1 },
                { name: 'domicilio', maxCount: 1 },
                { name: 'estadoDeCuenta', maxCount: 1 },
            ]), uploadUserDocs);
    }
}