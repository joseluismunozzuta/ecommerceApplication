import express from "express";
import __dirname, { passportCall } from "./utils.js";
import handlebars from "express-handlebars";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import initializePassport from "./config/passport.config.js";
import { userModel } from "./dao/models/user.model.js";
import CartRouter from "./routes/carts.router.js";
import SessionRouter from "./routes/session.router.js";
import ProductRouter from "./routes/products.router.js";
import ViewRouter from "./routes/views.router.js";
import {IfAuthenticated } from "./utils.js";
const app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
initializePassport();


// /****************SESSION********************** */
// app.use(
//     session({
//         secret: 'secretCoder',
//         resave: true,
//         saveUninitialized: false,
//         store: MongoStore.create({
//             mongoUrl: "mongodb+srv://joseluismunozzuta:Diego0707@backendcoder1.djzve1b.mongodb.net/ecommerce1?retryWrites=true&w=majority",
//             mongoOptions: {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true
//             },
//             ttl: 300,
//         }),
//     })
// );

const productRouter = new ProductRouter();
app.use("/api/products", productRouter.getRouter());

const cartRouter = new CartRouter();
app.use("/api/carts", cartRouter.getRouter());

const sessionRouter = new SessionRouter();
app.use("/api/sessions", sessionRouter.getRouter());

const viewRouter = new ViewRouter();
app.use("/views", viewRouter.getRouter());

app.engine('handlebars', handlebars.engine());
app.set("views", __dirname + '/views');
app.set('view engine', 'handlebars');


const port = process.env.PORT || 3000;

const httpServer = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});



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

app.get("/profile", passportCall('jwt'), IfAuthenticated(), async (req, res) => {
    try{
        const profile = await userModel.findOne({email: req.user.user.email}).lean();
        res.render('profile', {
            title: 'Profile',
            style: 'profile.css',
            profile: profile
        })
    }catch(err){
        return res.status(500).send("Internal error");
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