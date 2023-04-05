import express from 'express';
import session from 'express-session';
import { userModel } from "../dao/models/user.model.js";

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

sessionRouter.post("/signup", async (req, res) => {
    const user = { ...req.body };

    if (user.email == "adminCoder@coder.com") {
        user.role = "admin";
    }

    try {
        const newUser = new userModel(user);
        let result = await newUser.save();
        res.send({ status: "success", payload: result });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

sessionRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {

        if (!email || !password) {
            res.status(400).send({ status: "error", message: "Faltan datos" });
        }

        const loggedUser = await userModel.findOne({ email: email, password: password });

        if (!loggedUser) {
            res.status(404).send({ status: "error", message: "Invalid email or password" });
        }

        console.log(loggedUser);
        req.session.user = loggedUser.email;
        res.send({ status: "success", payload: loggedUser });

    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }

})

sessionRouter.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            res.send({status:"success", message: "Logout succesful!"});
        } else {
            return res.json({ status: 'Logout Failed', body: err });
        }
    })
});

export default sessionRouter;