import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT,
    mongoURL: process.env.MONGO_URL,
    adminUser: process.env.ADMIN_USER,
    adminPassword:process.env.ADMIN_PASSWORD,
    dbname:process.env.DB_NAME
}