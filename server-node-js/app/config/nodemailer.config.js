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

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  transport.sendMail({
    from: '"Pogled Unutra Blog" <foo@example.com>', // sender address,
    to: email,
    subject: "Please confirm your account",
    html: `<h1>Activation link ✔</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${process.env.BASE_PATH}/confirm/${confirmationCode}> Click here</a>
        </div>`,
  }).catch(err => console.log(err));
};