import express from "express";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import chatRouter from "./routes/chat.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import mongoose, { mongo } from "mongoose";
import { messageModel } from "./dao/models/messages.model.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/views", viewRouter);
app.use("/chat", chatRouter);

app.engine('handlebars', handlebars.engine());
app.set("views", __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;
const httpServer = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

mongoose.connect('mongodb+srv://joseluismunozzuta:Diego0707@backendcoder1.djzve1b.mongodb.net/ecommerce1?retryWrites=true&w=majority', (error) => {
    if (error) {
        console.log("Cannot connect to DB: " + error);
        process.exit();
    } else {
        console.log("Connected to DB");
    }
})

const socketServer = new Server(httpServer);

//Chat with websockets
let chatMessages = [];
socketServer.on('connection', socket => {

    socket.on('chatMessage', async (data) =>{

        try {
            const messageToDb = new messageModel(data);
            await messageToDb.save();
            chatMessages.push(data);
            socketServer.emit('messages', chatMessages);
        }
        catch (err) {
            console.log(err);
        }
    })
})

export default socketServer;