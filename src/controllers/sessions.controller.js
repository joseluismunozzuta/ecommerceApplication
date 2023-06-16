import User from "../dao/classes/user.dao.js";
import Cart from "../dao/classes/cart.dao.js";;
import UserDTO from "../dao/DTOs/user.dto.js";
import { createHash, isValidPassword, generateToken, verifyEmailToken } from "../utils.js";
import CustomError from "../services/errors/CustomError.js";
import { generateUserErrorInfo } from "../services/errors/info.js";
import EErrors from "../services/errors/enums.js";
import { sendRecoveryEmail } from "../config/messages/gmail.js";
import fs from 'fs';
import path from "path";
import __dirname from "../utils.js";

const userService = new User();
const cartService = new Cart();

export const updateProfile_controller = async (req, res) => {
    try {
        const imageFile = req.file;

        //Find the user profile to update
        const profile = await userService.searchByEmail(req.user.user.email);

        if (imageFile) {

            let dirPath = path.join(__dirname, "/multer/users/img");
            let fileName = `${req.user.user.email}-profile-${req.file.originalname}`
            let filePath = path.join(dirPath, fileName);

            const imagedata = await fs.promises.readFile(filePath);

            profile.profileimage = {
                data: imagedata,
                contentType: imageFile.mimetype
            }

            const newProfile = new UserDTO(profile);
            //Update the user profile
            await userService.update(profile._id, newProfile);
        }

        res.redirect("/views/profile");

    } catch (err) {
        req.logger.error(err);
        res.sendServerError(err);
    }
}

export const goLogin_controller = async (req, res) => {

    if (!req.user) {
        res.render("login", {
            excludePartial: true,
            style: 'sessions.css',
            title: 'Login'
        });
    } else {
        res.redirect("/api/views/profile");
    }
}

export const goSignUp_controller = async (req, res) => {
    if (!req.user) {
        res.render("signup", {
            excludePartial: true,
            title: 'Register',
            style: 'sessions.css'
        });
    } else {
        res.redirect("/api/views/profile");
    }
}

export const registerUser_controller = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    if ((!first_name || !last_name || !email || !age || !password) || !Number.isInteger(parseInt(age))) {
        CustomError.createError({
            name: "User Creation Error",
            cause: generateUserErrorInfo({
                first_name,
                last_name, age, email
            }),
            message: "Error al registrar usuario. Uno de los campos contiene información no válida.",
            code: EErrors.INVALID_TYPES_ERROR
        });
    }

    try {
        let user = await userService.searchByEmail(email);

        if (user) {
            return res.sendUserError("User already exists");
        }

        //Create a cart to assign Cart ID to new user
        try {
            let role;
            let result = await cartService.create([]);
            let cartId = result._id.toString();

            let adminFlag = email.includes("admin");

            if (adminFlag) {
                role = "admin";
            }

            const newUser = new UserDTO({
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: cartId,
                role
            });
            let ress = await userService.create(newUser);

        } catch (err) {
            return res.sendServerError(err.message);
        }

        return res.sendSuccess("Usuario registrado con exito");
    } catch (error) {
        return res.sendServerError(error.message);
    }
}

export const signIn_controller = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userService.searchByEmail(email);

        if (!user) {
            return res.sendUserError("User not found");
        }
        if (!isValidPassword(user, password)) {
            return res.sendUserError("Incorrect password");
        }
        const cookieUser = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        }
        const access_token = generateToken(cookieUser);

        user.last_connection = new Date().toLocaleString()

        await userService.update(user._id, user);

        res.cookie('cookieToken', access_token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        }).sendSuccess("Login successful");

    } catch (error) {
        req.logger.error(error);
        return res.sendServerError();
    }
}

export const logout = async (req, res) => {

    try {

        const user = await userService.searchByEmail(req.user.user.email);
        user.last_connection = new Date().toLocaleString()
        await userService.update(user._id, user);

        res.clearCookie('cookieToken');
        res.sendSuccess("Logout successful");
    } catch (error) {
        return res.sendServerError();
    }
}

export const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userService.searchByEmail(email);

        if (!user) {
            return res.sendUserError("User not found");
        }
        const tokenUser = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        }
        const token = generateToken(tokenUser, '1h');
        await sendRecoveryEmail(email, token);
        res.sendSuccess("Email sent");
        
    } catch (error) {
        req.logger.error(error);
        return res.sendServerError();
    }
}

export const resetpassword = async (req, res) => {

    try {
        const token = req.query.token;
        const {newPassword } = req.body;

        //Validamos el token.
        const validEmail = verifyEmailToken(token);

        if (!validEmail) {
            return res.send(`El enlace caduco o no es valido, <a href="/forgotpassword">intentar de nuevo</a>`)
        }

        const user = await userService.searchByEmail(validEmail);
        if (!user) {
            return res.send(`<p>el usuario no existe, <a href="/signup">Crea una cuenta</a></p>`)
        }
        if (isValidPassword(user, newPassword)) {

            return res.render("resetpassword", {
                title: "Reset password",
                error: "The password can't be the same",
                token,
                email:validEmail,
                excludePartial: true
            })
        }

        const newUser = {
            ...user,
            password: createHash(newPassword)
        }
        await userService.update(user._id, newUser);
        req.logger.debug("Password updated");
        res.redirect("/api/sessions/login");
    } catch (error) {
        req.logger.error(error);
        return res.sendServerError();
    }
}