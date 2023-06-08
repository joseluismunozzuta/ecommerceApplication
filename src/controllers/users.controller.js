import User from "../dao/classes/user.dao.js";
import Cart from "../dao/classes/cart.dao.js";;
import UserDTO from "../dao/DTOs/user.dto.js";
import { createHash, isValidPassword, generateToken } from "../utils.js";
import CustomError from "../services/errors/CustomError.js";
import { generateUserErrorInfo } from "../services/errors/info.js";
import EErrors from "../services/errors/enums.js";

const userService = new User();
const cartService = new Cart();

export const myProfile_controller = async (req, res) => {
    try {
        const profile = await userService.searchByEmail(req.user.user.email);
        res.render('profile', {
            title: 'Profile',
            style: 'profile.css',
            profile: profile
        })
    } catch (err) {
        return res.sendServerError("Internal Error");
    }
}

export const getAllUsers_controller = async (req, res) => {
    try {
        const users = await userService.getAll();
        return res.sendSuccess(users);
    } catch (err) {
        return res.sendServerError("Internal error");
    }
}

export const goLogin_controller = async (req, res) => {

    if (!req.user) {
        res.render("login", {
            style: 'sessions.css',
            title: 'Login'
        });
    } else {
        res.redirect("/api/sessions/profile");
    }
}

export const goSignUp_controller = async (req, res) => {
    if (!req.user) {
        res.render("signup", {
            title: 'Register',
            style: 'sessions.css'
        });
    } else {
        res.redirect("/api/sessions/profile");
    }
}

export const registerUser_controller = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    if ((!first_name || !last_name || !email || !age || !password) || !Number.isInteger(age)) {
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

        res.cookie('cookieToken', access_token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        }).sendSuccess("Login successful");

    } catch (error) {
        return res.sendServerError("Internal error");
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('cookieToken');
        res.sendSuccess("Logout successful");
    } catch (error) {
        return res.sendServerError("Internal error");
    }
}