import express from "express";
import __dirname from "./utils.js";
import session from "express-session";
import handlebars from "express-handlebars";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import sessionRouter from "./routes/session.router.js";
import viewRouter from "./routes/views.router.js";
import { userModel } from "./dao/models/user.model.js";

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
app.use("/api/sessions", sessionRouter);
app.use("/views", viewRouter);

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
        console.log("Connected succesfully to Mongo database");
    }
})