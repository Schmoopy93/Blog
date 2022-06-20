require("dotenv").config();
const nodemailer = require("nodemailer");
const config = require("../config/auth.config");

const user = process.env.MAILER_USERNAME;
const pass = process.env.MAILER_PASS;
const service = process.env.MAILER_SERVICE;

const transport = nodemailer.createTransport({
    service,
    auth: {
        user,
        pass,
    },
});

module.exports.resetPassowrd = (name, email, token) => {
    transport.sendMail({
        from: '"Pogled Unutra Blog" <foo@example.com>', // sender address,
        to: email,
        subject: "Retrieve password",
        html: `<h1>Retrieve password link ✔</h1>
        <h2>Hello ${name}</h2>
        <p>You requested for password reset</p>
        <a href=http://localhost:4200/reset-password/${token}> Click here</a>
        </div>`,
    }).catch(err => console.log(err));
};