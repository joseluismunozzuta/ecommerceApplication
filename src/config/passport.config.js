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

}
export default initializePassport;