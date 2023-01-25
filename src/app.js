import express from "express";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewRouter from "./routes/views.router.js";
import { Server } from "socket.io";

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

const socketServer = new Server(httpServer);

app.set("io", socketServer);

socketServer.on('connection', socket => {

    socket.on('message', data => {
        console.log("The message sent is " + data);
    })
})

app.get('/', (req, res) => {
    let testUser = {
        name: "Eric",
        last_name: "Munoz",
        style: "index.css"
    }

    res.render('index', testUser);
})

export default socketServer;