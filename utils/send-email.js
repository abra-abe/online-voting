require('dotenv').config();
const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.MAIL_HOST,
            auth: {
                type: process.env.MAIL_AUTH,
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASS,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN
            }
        })
        
        let mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: subject,
            text: text
        };

        transporter.sendMail(mailOptions, function(err, data) {
            if(err) throw err;
            console.log("email has been sent successfully");
        });
    } catch (error) {
        console.log("email not sent");
    }
}

module.exports = sendEmail