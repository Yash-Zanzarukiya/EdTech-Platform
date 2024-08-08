import nodemailer from 'nodemailer'
import { EMAIL_ID, EMAIL_PASSWORD } from '../config/serverConfig.js'

function sendMail(userEmail, subject, html) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_ID,
            pass: EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: EMAIL_ID,
        to: userEmail,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions);
}

export {
    sendMail
}