import User from "../dao/classes/user.dao.js";
import { checkDocs } from "../utils.js";

const userService = new User();

export const modifyUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await userService.searchById(userId);

        if (user.documents.length < 3 || user.status !== "Complete") {
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
        return res.sendSuccess(`Nuevo rol del usuario: ${user.role}`);
    } catch (error) {
        res.sendServerError(error);
    }
}

export const uploadUserDocs = async (req, res) =>{
    try {
        const userId = req.params.uid;
        const user = await userService.searchById(userId);
        const {doc1, doc2, doc3} = checkDocs(user);
        const identificacion = req.files['identificacion']?.[0] || doc1;
        const domicilio = req.files['domicilio']?.[0] || doc2;
        const estadoDeCuenta = req.files['estadoDeCuenta']?.[0] || doc3;
        
        let docs = [];

        if(identificacion){
            docs.push({
                name:'identificacion',
                reference:identificacion.path
            })
        }
        if(domicilio){
            docs.push({
                name:'domicilio',
                reference:domicilio.path
            })
        }
        if(estadoDeCuenta){
            docs.push({
                name:'estadoDeCuenta',
                reference:estadoDeCuenta.path
            })
        }

        user.documents = docs;

        if(docs.length === 3){
            user.status = "Complete"
        } else {
            user.status = "Incomplete"
        }
        await userService.update(user._id,user);

        res.redirect("/views/profile");
        
    } catch (error) {
        console.log(error);
        res.sendServerError(error);
    }
}