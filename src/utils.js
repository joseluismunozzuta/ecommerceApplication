import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PRIVATE_KEY = "CoderHouseJoseLuis";

// export const setUserIfSigned = (strategy) => {
//     return async (req, res, next) => {
//         console.log("trace set user");
//         passport.authenticate(strategy, function (err, user, info) {
//             if (err) {
//                 return next(err);
//             }
//             if (!user) {
//                 console.log("Not user");
//                 return next();
//             }
//             req.user = user;
//             next();
//         })(req, res, next);
//     }
// }

export const checkAuthentication = () => {

    return async (req, res, next) => {
        
        console.log("trace check auth");
        if (!req.user) {
            return res.sendUserError("Unauthorized, not authenticated");
        }
        next();
    }
}

export const adminAuth = (role) => {

    return async (req, res, next) => {
        console.log("trace check admin");
        if (!req.user) {
            return res.sendUserError("Not authenticated");
        }
        if (req.user.user.role != role) {
            return res.sendForbidden("No admin, no permission to view this");
        }
        next();
    }
}

export const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' });
    return token;
}

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);
export default __dirname;