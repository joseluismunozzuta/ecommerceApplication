import User from "../dao/classes/user.dao.js";
import {generateToken, checkDocs } from "../utils.js";

const userService = new User();

export const getAllUsers_controller = async (req, res) => {
    try {
        const users = await userService.getAll();
        return res.sendSuccess(users.docs);
    } catch (err) {
        return res.sendServerError();
    }
}

export const modifyUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await userService.searchById(userId);

        if ((user.documents.length < 3 || user.status !== "Complete") && user.role == "user") {
            return res.sendUserError("No has subido todos los documentos necesarios para subir a premium");
        }

        const userRole = user.role;
        if (userRole === "user") {
            user.role = "premium";
        } else if (userRole === "premium") {
            user.role = "user";
        } else {
            return res.sendUserError("No es posible cambiar el rol de un administrador");
        }
        await userService.update(userId, user);

        const cookieUser = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        }

        const access_token = generateToken(cookieUser);

        res.cookie('cookieToken', access_token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        }).sendSuccess(`Nuevo rol del usuario: ${user.role}`);
    } catch (error) {
        res.sendServerError(error);
    }
}

export const uploadUserDocs = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await userService.searchById(userId);
        const { doc1, doc2, doc3 } = checkDocs(user);
        const identificacion = req.files['identificacion']?.[0] || doc1;
        const domicilio = req.files['domicilio']?.[0] || doc2;
        const estadoDeCuenta = req.files['estadoDeCuenta']?.[0] || doc3;

        let docs = [];

        if (identificacion) {
            docs.push({
                name: 'identificacion',
                reference: identificacion.path
            })
        }
        if (domicilio) {
            docs.push({
                name: 'domicilio',
                reference: domicilio.path
            })
        }
        if (estadoDeCuenta) {
            docs.push({
                name: 'estadoDeCuenta',
                reference: estadoDeCuenta.path
            })
        }

        user.documents = docs;

        if (docs.length === 3) {
            user.status = "Complete"
        } else {
            user.status = "Incomplete"
        }
        await userService.update(user._id, user);

        res.redirect("/views/profile");

    } catch (error) {
        req.logger.error(error);
        res.sendServerError(error);
    }
}