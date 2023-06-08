import {cpus} from 'os';
import __dirname, { generateProduct } from "./utils.js";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import cors from 'cors';
import express from "express";
import handlebars from "express-handlebars";
import initializePassport from "./config/passport.config.js";
import errorHandler from "./middlewares/errors/err.js";
import mongoose from "mongoose";
import { Server } from "socket.io";
import CartRouter from "./routes/carts.router.js";
import SessionRouter from "./routes/sessions.router.js";
import ProductRouter from "./routes/products.router.js";
import ViewRouter from "./routes/views.router.js";
import Message from "./dao/classes/message.dao.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
initializePassport();

const productRouter = new ProductRouter();
app.use("/api/products", productRouter.getRouter());

const cartRouter = new CartRouter();
app.use("/api/carts", cartRouter.getRouter());

const sessionRouter = new SessionRouter();
app.use(errorHandler);
app.use("/api/sessions", sessionRouter.getRouter());

const viewRouter = new ViewRouter();
app.use("/views", viewRouter.getRouter());

app.get("/mockingproducts", async(req, res) => {
    let prods = [];
    for (let i = 0; i < 100; i++) {
        prods.push(generateProduct())
    }
    res.send({status:"success", payload:prods});
})


app.engine('handlebars', handlebars.engine());
app.set("views", __dirname + '/views');
app.set('view engine', 'handlebars');


const port = process.env.PORT;
const httpServer = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});



mongoose.connect('mongodb+srv://'
    + process.env.ADMIN_USER
    + ':'
    + process.env.ADMIN_PASSWORD
    + process.env.MONGO_URL
    + process.env.DB_NAME
    + '?retryWrites=true&w=majority', (error) => {
        if (error) {
            console.log("Cannot connect to DB: " + error);
            process.exit();
        } else {
            console.log("Connected succesfully to Mongo database");
        }
    })

/*****************CHAT*********************/
const socketServer = new Server(httpServer);
const messageService = new Message();
//Chat with websockets
socketServer.on('connection', socket => {

    socket.on('chatMessage', async (data) => {

        try {
            await messageService.create(data);
            const chatMessages = await messageService.read();
            socketServer.emit('messages', chatMessages);
        }
        catch (err) {
            console.log(err);
        }
    })
})

export default socketServer;