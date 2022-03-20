const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const nodemailer = require("../config/nodemailer.config");

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const fs = require("fs");

exports.signup = (req, res) => {
    // Save User to Database

    var token = jwt.sign({ id: req.body.username }, config.secret, {
        expiresIn: 86400 // 24 hours
    });

    console.log(req.file);

    if (req.file == undefined) {
        return res.send(`You must select a file.`);
    }

    User.create({
        username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: bcrypt.hashSync(req.body.password, 8),
        confirmationCode: token,
        type: req.file.mimetype,
        photoName: req.file.originalname,
        data: fs.readFileSync(
            __basedir + "/uploads/userphoto/" + req.file.filename
        ),
    }).then(user => {
        fs.writeFileSync(
            __basedir + "/uploads/userphoto/" + user.photoName,
            user.data
        );
        if (req.body.roles) {
            Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            }).then((roles) => {
                user.setRoles(roles).then(() => {
                    res.send({ message: "User registered successfully!" });
                })
            });
        } else {
            // user role = 1
            user.setRoles([1]).then(() => {
                res.send({ message: "User registered successfully!" });
            }).then(() => nodemailer.sendConfirmationEmail(
                user.username,
                user.email,
                user.confirmationCode
            )).catch((err) => console.log(err))
        }
    })
}

exports.signin = (req, res) => {
    User.findOne({
            where: {
                username: req.body.username
            }
        })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            var authorities = [];
            if (user.status != "Active") {
                return res.status(401).send({
                    message: "Pending Account. Please Verify Your Email!",
                });
            }
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    roles: authorities,
                    accessToken: token,
                    status: user.status,
                    photoName: user.photoName,
                    type: user.type,
                    data: user.data

                });
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });

};

exports.verifyUser = (req, res, next) => {
    User.findOne({
            where: {
                confirmationCode: req.params.confirmationCode
            }


        })
        .then((user) => {
            console.log(user);
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }
            user.status = "Active";
            user.save((err) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
            });
        })
        .catch((e) => console.log("error", e));
};