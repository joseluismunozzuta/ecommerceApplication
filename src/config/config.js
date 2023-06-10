import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT,
    mongoURL: process.env.MONGO_URL,
    adminUser: process.env.ADMIN_USER,
    adminPassword:process.env.ADMIN_PASSWORD,
    dbname:process.env.DB_NAME,
    admin_gmail: process.env.ADMIN_GMAIL,
    admin_gmail_password: process.env.ADMIN_GMAIL_PASS,
    private_key: process.env.PRIVATE_KEY
}