import nodemailer from 'nodemailer';
import config from '../config.js';

//crear un transportador.
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: config.admin_gmail,
        pass: config.admin_gmail_password
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
});

export const sendRecoveryEmail = async (email, token) => {
    const link = `https://ecommerceapplication-production.up.railway.app/views/resetpassword?token=${token}`;//enlace con token

    await transporter.sendMail({
        from: "ECommerce Jose Luis",
        to: email,
        subject: "Recuperación de contraseña",
        html: `<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                              <a href="https://rakeshmandal.com" title="logo" target="_blank">
                                <img width="60" src="https://firebasestorage.googleapis.com/v0/b/static-images-ee67c.appspot.com/o/shop.png?alt=media&token=4ccb8349-7e95-4797-b76f-eff7bc060a1d" title="logo" alt="logo">
                              </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                requested to reset your password</h1>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                We cannot simply send you your old password. A unique link to reset your
                                                password has been generated for you. It lasts for 1 hour. Click the following button to reset your password.
                                            </p>
                                            <a href=${link}
                                                style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                Password</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
    
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>`
    });
}

export const sendDeleteProdEmail = async (user, product) => {
    await transporter.sendMail({
        from: "ECommerce Jose Luis",
        to: user.email,
        subject: "Tu producto fue eliminado",
        html: `<h3>Hola, ${user.first_name} ${user.last_name}: </h3>
        <p>Tu producto ${product.title} con ID[${product._id}] ha sido eliminado de la tienda
        ECommerce.</p>`
    })
}