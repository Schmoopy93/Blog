const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');


const user = process.env.MAILER_USERNAME;
const pass = process.env.MAILER_PASS;
const service = process.env.MAILER_SERVICE;

const app = express();
app.use(bodyParser.json());

function sendEmail(name, email, message) {
    const transporter = nodemailer.createTransport({
        service,
        auth: {
            user,
            pass,
        },
    });
    const mailOptions = {
        from: '"Pogled Unutra Blog" <foo@example.com>', // replace with your name and email address
        to: 'rajicm@hotmail.com', // replace with the email address of the recipient
        subject: 'New Contact Form Submission',
        html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Email sent: ' + info.response);
            return true;
        }
    });
}

module.exports = {
    sendEmail
};