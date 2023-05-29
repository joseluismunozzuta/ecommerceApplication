import CRouter from './router.js';
import { userModel } from "../dao/models/user.model.js";
import { generateToken, passportCall, IfAuthenticated } from '../utils.js';
import { createHash, isValidPassword } from '../utils.js';
import { cartModel } from '../dao/models/carts.model.js';

export default class SessionRouter extends CRouter {
    init() {
        // this.get('/', ["PUBLIC"], passportCall('jwt'), (req, res) => {
        //     if (req.user) {
        //         res.sendSuccess("Hay usuario" + req.user.user.email);
        //     } else {
        //         res.sendSuccess("No hay usuario");
        //     }
        // })

        this.get("/current", ["PUBLIC"], passportCall('jwt'), IfAuthenticated(), (req, res) => {
            res.sendSuccess(req.user);
        })

        this.get("/getusers", ["PUBLIC"], async(req, res) => {
            try {
                const users = await userModel.paginate();
                res.send(users);
            } catch (err) {
                console.log(err);
                res.status(500).send(err.message);
            }
        })

        this.get("/login", ["PUBLIC"], passportCall('jwt'), (req, res) => {
            if (!req.user) {
                res.render("login", {
                    style: 'sessions.css',
                    title: 'Login'
                });
            } else {
                res.redirect("/profile");
            }

        })

        this.get("/signup", ["PUBLIC"], passportCall('jwt'), (req, res) => {
            if (!req.user) {
                res.render("signup", {
                    title: 'Register',
                    style: 'sessions.css'
                });
            } else {
                res.redirect("/profile");
            }
        });

        this.post("/signup", ["PUBLIC"], async (req, res) => {
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
                        cart:cartId
                    }

                    let ress = await userModel.create(newUser);

                } catch (err) {
                    throw e;
                }

                return res.sendSuccess("Usuario registrado con exito");
            } catch (error) {
                return res.sendServerError("Internal error");
            }
        })

        this.post("/login", ["PUBLIC"], async (req, res) => {
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
        })

        this.post('/logout', (req, res) => {
            req.session.destroy(err => {
                if (!err) {
                    res.send({ status: "success", message: "Logout succesful!" });
                } else {
                    return res.json({ status: 'Logout Failed', body: err });
                }
            })
        });

    }
}

//const sessionRouter = express.Router();

// const auth = async (req, res, next) => {

//     if (!req.session.user) {
//         console.log("User not authenticated. Not able to enter this path.")
//         return res.status(401).send("Not authenticated");
//     } else {
//         console.log("auth: ", req.session.user);
//         return next();
//     }
// }

//export default sessionRouter;