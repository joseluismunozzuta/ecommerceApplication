import User from "../dao/classes/user.dao.js";
import Cart from "../dao/classes/cart.dao.js";;
import UserDTO from "../dao/DTOs/user.dto.js";
import { createHash, isValidPassword, generateToken } from "../utils.js";

const userService = new User();
const cartService = new Cart();

export const getAllUsers_controller = async(req, res) => {
    try{
        const users = await userService.getAll();
        return res.sendSuccess(users);
    }catch(err){
        return res.sendServerError("Internal error");
    }
}

export const goLogin_controller = async (req, res ) => {

    if (!req.user) {
        res.render("login", {
            style: 'sessions.css',
            title: 'Login'
        });
    } else {
        res.redirect("/profile");
    }
}

export const goSignUp_controller = async (req, res) => {
    if (!req.user) {
        res.render("signup", {
            title: 'Register',
            style: 'sessions.css'
        });
    } else {
        res.redirect("/profile");
    }
}

export const registerUser_controller = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

            try {
                let user = await userService.searchByEmail(email);

                if (user) {
                    return res.sendUserError("User already exists");
                }

                //Create a cart to assign Cart ID to new user
                try {
                    
                    let result = await cartService.create([]);
                    let cartId = result._id.toString();
                    console.log(cartId);

                    const newUser = new UserDTO({
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        cart: cartId
                    });

                    let ress = await userService.create(newUser);

                } catch (err) {
                    return res.sendServerError("Internal error");
                }

                return res.sendSuccess("Usuario registrado con exito");
            } catch (error) {
                return res.sendServerError("Internal error");
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
                    email: user.email
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