const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const main = async (token) => {
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        auth: {
            user: 'mrrajic102@gmail.com',
            pass: 'Kakojedobro1234'
        }
    });
    
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Pogled Unutra Blog" <foo@example.com>', // sender address
        to: 'rajicm@hotmail.com',
        subject: "Activation link ✔", // Subject line
        //text: "Mi nesto radimo", // plain text body
        html: '<p>Click <a href="http://localhost:4200/auth/verify-email/' + token + '">here</a> to activate your account</p>'
        

    });

}
module.exports =main;