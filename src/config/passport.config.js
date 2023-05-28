import passport from "passport";
import local from "passport-local";
import jwt from 'passport-jwt';
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import { ExtractJwt } from "passport-jwt";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['cookieToken'];
    }
    return token;
}

const initializePassport = () => {

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: 'CoderHouseJoseLuis',
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (err) {
            return done(err);
        }
    }))

    // passport.use('register',
    //     new LocalStrategy(
    //         {
    //             passReqToCallback: true,
    //             usernameField: 'email'
    //         },
    //         async (req, username, password, done) => {
    //             const { first_name, last_name, email, age } = req.body;
    //             try {
    //                 let user = await userModel.findOne({ email: username });
    //                 if (user) {
    //                     console.log("User already exits");
    //                     return done(null, false, { status: "Error", message: "User already exists" });
    //                 }
    //                 const newUser = {
    //                     first_name,
    //                     last_name,
    //                     email,
    //                     age,
    //                     password: createHash(password)
    //                 }
    //                 let result = await userModel.create(newUser);
    //                 return done(null, result, { status: "success" });
    //             } catch (error) {
    //                 return done("Error al obtener el usuario: " + error);
    //             }
    //         }))

    // passport.use('login',
    //     new LocalStrategy(
    //         {
    //             usernameField: 'email'
    //         },
    //         async (username, password, done) => {
    //             try {
    //                 const user = await userModel.findOne({ email: username });
    //                 if (!user) {
    //                     return done(null, false, { message: "User not found" });
    //                 }
    //                 if (!isValidPassword(user, password)) {

    //                     return done(null, false, { message: "Password incorrecto" });
    //                 }
    //                 return done(null, user);
    //             } catch (error) {
    //                 return done(error);
    //             }
    //         }))

    // passport.serializeUser((user, done) => {
    //     done(null, user._id);
    // })

    // passport.deserializeUser(async (id, done) => {
    //     let user = await userModel.findById(id);
    //     done(null, user);
    // })

}
export default initializePassport;