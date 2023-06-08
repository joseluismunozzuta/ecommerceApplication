import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PRIVATE_KEY = "CoderHouseJoseLuis";

export const checkAuthentication = () => {

    return async (req, res, next) => {
        
        if (!req.user) {
            return res.sendUserError("Unauthorized, not authenticated");
        }
        next();
    }
}

export const generateToken = (user, exp = '1h') => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: exp });
    return token;
}

export const verifyEmailToken=(token)=>{
    try {
        console.log("trac1 here");
        const info = jwt.verify(token, PRIVATE_KEY);
        console.log("trace here");
        console.log(info);
        return info.user.email;
    } catch (error) {
        return null;
    }
};

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);
export default __dirname;

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        code: faker.string.alphanumeric(),
        stock: faker.number.int(),
        id: faker.database.mongodbObjectId(),
        image:faker.image.url()
    }
}