import nodemailer from 'nodemailer';
import config from '../config.js';

//crear un transportador.
const transporter = nodemailer.createTransport({
    service:"gmail",
    port:587,
    auth:{
        user:config.admin_gmail,
        pass:config.admin_gmail_password
    },
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
});

export const sendRecoveryEmail = async(email,token)=>{
    const link = `https://ecommerceapplication-production.up.railway.app/views/resetpassword?token=${token}`;//enlace con token

    await transporter.sendMail({
        from:"ECommerce Jose Luis",
        to:email,
        subject:"Recuperación de contraseña",
        html:`
            <h3>Hola:</h3>
            <p>Recibimos tu solicitud para recuperar la constraseña, da clic en el siguiente botón:</p>
            <a href="${link}">
                <button>Restablecer contraseña</button>
            </a>
        `
    });
}