import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { faker } from '@faker-js/faker';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);
export default __dirname;

const PRIVATE_KEY = "CoderHouseJoseLuis";
export const generateToken = (user, exp = '1h') => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: exp });
    return token;
}

export const checkAuthentication = () => {

    return async (req, res, next) => {

        if (!req.user) {
            return res.sendUserError("Unauthorized, not authenticated");
        }
        next();
    }
}

export const verifyEmailToken = (token) => {
    try {
        const info = jwt.verify(token, PRIVATE_KEY);
        return info.user.email;
    } catch (error) {
        return null;
    }
};

export const defineRoleFlags = (user) => {
    const flags = {};

    if (user.role === 'admin') {
        flags.adminflag = true;
        flags.flag = true;
    }

    if (user.role === 'premium') {
        flags.premiumflag = true;
        flags.flag = true;
    }

    if (user.role === 'user') {
        flags.userflag = true;
        flags.flag = true;
    }

    return flags;
}

export const checkDocs = (user) => {
    let docNames = []
    const flags = {};
    user.documents.forEach((doc) => {
        docNames.push(doc.name);
    })
    if (docNames.includes("identificacion")) {
        flags.doc1 = true;
    }
    if (docNames.includes("domicilio")) {
        flags.doc2 = true;
    }
    if (docNames.includes("estadoDeCuenta")) {
        flags.doc3 = true;
    }
    return flags;
}

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        code: faker.string.alphanumeric(),
        stock: faker.number.int(),
        id: faker.database.mongodbObjectId(),
        image: faker.image.url()
    }
}

/*************MULTER****************/

// Middleware to delete existing image file
export const deleteExistingImage = (req, res, next) => {
    const userEmail = req.user.user.email;

    const emailPrefix = userEmail.split('@')[0];

    const imageDirectory = path.join(__dirname, '/multer/users/img');

    const files = fs.readdirSync(imageDirectory);

    files.forEach((file) => {
        if (file.startsWith(emailPrefix)) {
            const filePath = path.join(imageDirectory, file);
            fs.unlinkSync(filePath);
        }
    });

    next();
};


const profilePhotoStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/multer/users/img"))
    },

    filename: function (req, file, cb) {
        cb(null, `${req.user.user.email}-profile-${file.originalname}`)
    }
});
export const uploadProfilePhoto = multer({ storage: profilePhotoStorage });

const userdocumentsStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/multer/users/documents"))
    },

    filename: function (req, file, cb) {
        cb(null, `${req.user.user.email}-doc-${file.fieldname}` + path.extname(file.originalname).toLowerCase())
    }
});
export const uploadUserDocuments = multer({ storage: userdocumentsStorage });

const productImagesStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/multer/products/img"))
    },

    filename: function (req, file, cb) {
        cb(null, `${req.body.code}-prodimage-${file.originalname}`)
    }
});
export const uploadProductImage = multer({ storage: productImagesStorage });