import express from "express";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import mongoose, { mongo } from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/views", viewRouter);

app.engine('handlebars', handlebars.engine());
app.set("views", __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+ '/public'));

const port = process.env.PORT || 3000;
const httpServer = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

mongoose.connect('mongodb+srv://joseluismunozzuta:Diego0707@backendcoder1.djzve1b.mongodb.net/ecommerce1?retryWrites=true&w=majority', (error) =>{
    if(error){
        console.log("Cannot connect to DB: " + error);
        process.exit();
    }else{
        console.log("Connected to DB");
    }
})

const socketServer = new Server(httpServer);

app.set("io", socketServer);

socketServer.on('connection', socket => {

    socket.on('message', data => {
        console.log("The message sent is " + data);
    })
})

export default socketServer;