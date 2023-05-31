import {fileURLToPath} from 'url';
import {dirname} from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PRIVATE_KEY = "CoderHouseJoseLuis";

export const setUserIfSigned = (strategy) => {
    return async(req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) {
                return next(err);
            }
            if(!user){
                console.log("Not user");
                return next();
            }
            req.user = user;
            next();
        })(req, res, next);
    }
}

export const checkAuthentication = () => {
    
    return async(req, res, next) => {
        if(!req.user){
            return res.status(401).send({error:"Unauthorized, not authenticated"});
        }
        next();
    }
}

export const generateToken = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: '24h'});
    return token;
}

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);
export default __dirname;

// export const adminAuth = (role) => {
//     return async(req, res, next) => {
//         if(!req.user){
//             return res.status(401).send({error:"Unauthorized"});
//         }
//         if(req.user.role != role){
//             return res.status(403).send({error:"No admin, no permissions"});
//         }
//         next();
//     }
// }

// export const authToken = (req, res, next) => {
//     //The token comes in the headers of authorization
//     const authHeader = req.headers.authorization;
//     if(!authHeader){
//         return res.status(401).send({
//             //If there is no header, it means there's no token and user isn't authenticated.
//             error: "Not authenticated"
//         })
//     }

//     //This split take out the word "Bearer"
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
//         if(error){
//             return res.status(403).send({error:"Not authorized"});
//         }
//         req.user = credentials.user;
//         next();
//     })
// }