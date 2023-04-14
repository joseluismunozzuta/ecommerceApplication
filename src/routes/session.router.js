import express from 'express';
import session from 'express-session';
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from '../utils.js';
import passport from 'passport';

const sessionRouter = express.Router();

const auth = async (req, res, next) => {

    if (!req.session.user) {
        console.log("User not authenticated. Not able to enter this path.")
        return res.status(401).send("Not authenticated");
    } else {
        console.log("auth: ", req.session.user);
        return next();
    }
}

sessionRouter.get("/login", (req, res) => {
    if (!req.session || !req.session.user) {
        res.render("login", {
            style: 'sessions.css',
            title: 'Login'
        });
    } else {
        res.redirect("/profile");
    }

})

sessionRouter.get("/signup", (req, res) => {
    if (!req.session || !req.session.user) {
        res.render("signup", {
            title: 'Register',
            style: 'sessions.css'
        });
    } else {
        res.redirect("/profile");
    }
});

sessionRouter.post("/signup", passport.authenticate('register', {failureRedirect:'/api/sessions/failregister',
failureFlash: true}), async (req, res) => {
    // const user = { ...req.body };
    // user.password = createHash(user.password);

    // if (user.email == "adminCoder@coder.com") {
    //     user.role = "admin";
    // }

    // try {
    //     const newUser = new userModel(user);
    //     let result = await newUser.save();
    //     res.send({ status: "success", payload: result });
    // } catch (err) {
    //     res.status(500).send(err.message);
    // }

    res.send({status:"success", message:"User registered"});

});

sessionRouter.get('/failregister', function (req, res) {
    res.send({message: req.flash('error')});
})

sessionRouter.post("/login", passport.authenticate('login', {failureRedirect:'/api/sessions/faillogin',
failureFlash: true}), async (req, res) => {
    const { email, password } = req.body;

    // try {

    //     if (!email || !password) {
    //         return res.status(400).send({ status: "error", message: "Faltan datos" });
    //     }

    //     const loggedUser = await userModel.findOne({ email: email });

    //     if (!loggedUser) {
    //         return res.status(404).send({ status: "error", message: "Invalid email or password" });
    //     }

    //     if (!isValidPassword(loggedUser, password)) {
    //         return res.status(403).send({ status: "error", message: "Incorrect password" });
    //     }

    //     delete loggedUser.password;
    //     req.session.user = loggedUser.email;
    //     res.send({ status: "success", payload: loggedUser });

    // } catch (err) {
    //     console.log(err.message);
    //     res.status(500).send(err.message);
    // }

    if(!req.user){
        return res.status(400).send({status:"error", error:"Invalid credentials"});
    }

    req.session.user = {
        first_name : req.user.first_name,
        last_name : req.user.last_name,
        email : req.user.email,
        age: req.user.age
    }
    res.send({status:"success", payload:req.user});

})

sessionRouter.get('/faillogin', (req, res) => {
    res.send({message: req.flash('error')});
})

sessionRouter.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            res.send({ status: "success", message: "Logout succesful!" });
        } else {
            return res.json({ status: 'Logout Failed', body: err });
        }
    })
});

export default sessionRouter;