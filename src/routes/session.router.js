import express from 'express';
import session from 'express-session';
import CRouter from './router.js';
import { userModel } from "../dao/models/user.model.js";
import { generateToken, authToken, passportCall } from '../utils.js';
import { createHash, isValidPassword } from '../utils.js';
import passport from 'passport';

export default class SessionRouter extends CRouter{
    init(){
        this.get('/', ["PUBLIC"], passportCall('jwt'),  (req,res)=>{
            if(req.user){
                res.send("Hay usuario" +req.user.user.email );
            }else{
                res.send("No hay usuario");
            }
        })

        this.get("/login",["PUBLIC"], (req, res) => {
            if (!req.session || !req.session.user) {
                res.render("login", {
                    style: 'sessions.css',
                    title: 'Login'
                });
            } else {
                res.redirect("/profile");
            }
        
        })
        
        this.get("/signup", (req, res) => {
            if (!req.session || !req.session.user) {
                res.render("signup", {
                    title: 'Register',
                    style: 'sessions.css'
                });
            } else {
                res.redirect("/profile");
            }
        });
        
        this.post("/signup", async (req,res)  => {
            const { first_name, last_name, email, age, password } = req.body;
            
            try {
                let user = await userModel.findOne({ email: email });
        
                if (user) {
                    console.log("User already exits");
                    return res.status(400).send({status:"error", error:"User already exists"});
                }
                
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                
                let result = await userModel.create(newUser);
                
                return res.send({status: "success", message:"Usuario registrado con exito"});
            } catch (error) {
                return res.status(400).send({status:"error", error:"Internal error"});
            }
        })
        
        this.post("/login",["PUBLIC"], async(req, res) => {
            const { email, password } = req.body;
            try {
                const user = await userModel.findOne({ email: email });
        
                if (!user) {
                    return res.status(400).send({status: "error", message: "User not found"});
                }
                if (!isValidPassword(user, password)) {
                    
                    return res.status(400).send({status: "error", message: "Incorrect password"});
                }
        
                const access_token = generateToken(user);
        
                res.cookie('cookieToken', access_token, {
                    maxAge: 60*60*1000,
                    httpOnly: false
                }).sendSuccess("Login successful");
        
            } catch (error) {
                return res.status(400).send({status:"error", error:"Internal error"});
            }
        })
        
        this.get("/current", passportCall('jwt'), (req,res)  => {
            res.send({status:"success", payload: req.user});
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