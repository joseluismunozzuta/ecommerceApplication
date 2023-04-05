import express from "express";
import mongoose from "mongoose";
import {userModel} from "../dao/models/user.model.js";

const signupRouter = express.Router();

signupRouter.get("/", (req, res) => {
    res.render("signup");
})

signupRouter.post("/", async (req, res) => {
    const user = {...req.body};

    try{
        const newUser = new userModel(user);
        let result = await newUser.save();
        res.send({status: "success", payload: result});
    }catch(err){
        res.status(500).send(err.message);
    }
});

export default signupRouter;