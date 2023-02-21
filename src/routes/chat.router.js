import express from 'express';

const chatRouter = express.Router();

chatRouter.get("/", (req, res) =>{
    res.render('chat',{
        style: 'chat.css'
    });
})

export default chatRouter;