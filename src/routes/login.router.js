import express from "express";

const loginRouter = express.Router();

loginRouter.get("/signup", async (req, res) => {
    res.render('signup');
})

export default loginRouter;