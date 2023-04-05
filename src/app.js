import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import chatRouter from "./routes/chat.router.js";
import loginRouter from "./routes/login.router.js";
import signupRouter from "./routes/signup.router.js";
import sessionRouter from "./routes/session.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import mongoose, { mongo } from "mongoose";
import { messageModel } from "./dao/models/messages.model.js";
import { userModel } from "./dao/models/user.model.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/****************SESSION********************** */
app.use(
    session({
        secret: 'secretCoder',
        resave: true,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: "mongodb+srv://joseluismunozzuta:Diego0707@backendcoder1.djzve1b.mongodb.net/ecommerce1?retryWrites=true&w=majority",
            mongoOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            ttl: 300,
        }),
    })
);

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/views", viewRouter);
app.use("/chat", chatRouter);
app.use("/api/sessions", sessionRouter);

app.engine('handlebars', handlebars.engine());
app.set("views", __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;
const httpServer = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.use(cookieParser());



// app.get('/session', (req, res) => {
//     //Si al conectarse la sesion ya existe, entonces aumentamos el contador
//     if (req.session.counter) {
//         req.session.counter++;
//         res.send(`Se ha visitado el sitio ${req.session.counter} veces.`);
//     } else {
//         req.session.counter = 1;
//         res.send(`Bienvenido.`);
//     }
// })

app.get('/login2', (req, res) => {
    const { username, password } = req.query;
    if (username !== 'jose' || password !== 'jose0505') {
        return res.send('Login failed');
    }
    req.session.user = username;
    req.session.admin = true;
    res.send("Login successful!");
})

// app.get('/logout', (req, res) => {
//     req.session.destroy(err => {
//         if (!err) {
//             res.send("Logout succesful!");
//         } else {
//             return res.json({ status: 'Logout Failed', body: err });
//         }
//     })
// })

/********************************************** */

const auth = async (req, res, next) => {
    console.log(req.session.user);
    if(!req.session.user){
        console.log("User not authenticated. Not able to enter this path.")
        return res.status(401).send("Not authenticated");
    }else{
        console.log("auth: ", req.session.user);
        return next();
    }
}

app.get("/profile", auth, async (req, res) => {
    try{
        const profile = await userModel.findOne({email: req.session.user}).lean();
        res.render('profile', {
            title: 'Profile',
            style: 'profile.css',
            profile: profile
        })
    }catch(err){
        res.send(500).send("Internal error");
        console.log(err);

    }
})

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

    socket.on('chatMessage', async (data) => {

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