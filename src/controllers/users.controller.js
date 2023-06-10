import User from "../dao/classes/user.dao.js";

const userService = new User();

export const modifyUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await userService.searchById(userId);
        const userRole = user.role;
        if(userRole === "user"){
            user.role = "premium";
        } else if(userRole === "premium") {
            user.role = "user";
        } else {
            return res.sendUserError("No es posible cambiar el rol de un administrador");
        }
        await userService.update(userId,user);
        return res.sendSuccess(`Nuevo rol del usuario: ${user.role}`);
    } catch (error) {
        res.sendServerError(error);
    }
}