import __dirname, { setUserIfSigned, checkAuthentication } from "./utils.js";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import cors from 'cors';
import express from "express";
import handlebars from "express-handlebars";
import initializePassport from "./config/passport.config.js";
import mongoose from "mongoose";
import CartRouter from "./routes/carts.router.js";
import SessionRouter from "./routes/sessions.router.js";
import ProductRouter from "./routes/products.router.js";
import ViewRouter from "./routes/views.router.js";
import { userModel } from "./dao/models/user.model.js";

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
initializePassport();

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


const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.get("/profile", setUserIfSigned('jwt'), checkAuthentication(), async (req, res) => {
    try {
        const profile = await userModel.findOne({ email: req.user.user.email }).lean();
        res.render('profile', {
            title: 'Profile',
            style: 'profile.css',
            profile: profile
        })
    } catch (err) {
        return res.status(500).send("Internal error");
    }
})

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