import { userModel } from "../dao/models/user.model.js";
import { cartModel } from "../dao/models/carts.model.js";
import { createHash, isValidPassword, generateToken } from "../utils.js";

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
                let user = await userModel.findOne({ email: email });

                if (user) {
                    console.log("User already exits");
                    return res.sendUserError("User already exists");
                }

                //Create a cart to assign Cart ID to new user
                try {
                    const newCart = new cartModel([]);
                    let result = await newCart.save();
                    let cartId = result._id.toString();
                    console.log(cartId);

                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        cart: cartId
                    }

                    let ress = await userModel.create(newUser);

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
                const user = await userModel.findOne({ email: email });

                if (!user) {
                    return res.sendUserError("User not found");
                }
                if (!isValidPassword(user, password)) {
                    return res.sendUserError("Incorrect password");
                }

                const access_token = generateToken(user);

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