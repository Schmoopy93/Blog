const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Followers = db.followers;
const nodemailer = require("../config/nodemailer.config");
const nodemailerRetrievePassword = require("../config/nodemailer.retrivepass.config");
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var crypto = require("crypto");
const fs = require("fs");
const path = require('path');
const pdfMake = require('pdfmake');
const moment = require('moment');


const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: users } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, users, totalPages, currentPage };
};

exports.signup = (req, res) => {
    // Save User to Database

    var token = jwt.sign({ id: req.body.username }, config.secret, {
        expiresIn: 86400 // 24 hours
    });
    var photoName = crypto.randomBytes(20).toString('hex');
    console.log(req.file);

    if (req.file == undefined) {
        return res.send(`You must select a file.`);
    }

    if (req.body.password !== req.body.repeatPassword) {
        return res.status(422).send({ error: "Passwords do not match" });
    }

    User.create({
        username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: bcrypt.hashSync(req.body.password, 8),
        repeatPassword: bcrypt.hashSync(req.body.repeatPassword, 8),
        confirmationCode: token,
        type: req.file.mimetype,
        photoName: photoName,
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
                    message: "Please Verify Your Email!",
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
                    data: user.data,
                    address: user.address,
                    phone: user.phone,
                    town: user.town

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

exports.findAllPaginatedForUserList = (req, res) => {
    const { firstname, page, size } = req.query;
    var condition = firstname ? {
        firstname: {
            [Op.like]: `%${firstname}%`
        }
    } : null;

    const { limit, offset } = getPagination(page, size);

    User.findAndCountAll({ where: condition, limit, offset, include: db.role })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};

exports.findAll = (req, res) => {
    const { firstname, page, size, id } = req.query;
    var condition = firstname ? {
        firstname: {
            [Op.like]: `%${firstname}%`
        }
    } : null;

    var condition2 = id ? {
        id: {
            [Op.notLike]: `%${id}%`
        }
    } : null;

    const { limit, offset } = getPagination(page, size);
    User.findAndCountAll({ where: [condition || condition2], limit, offset, include: [db.followers] })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    User.findByPk(id, { include: [db.role, db.followers] })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    User.update(req.body, {
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};
exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
};

exports.retrievePassowrd = (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (!user) {
                    return res.status(404).send({ message: "User Not found with that email" });
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then(() => nodemailerRetrievePassword.resetPassowrd(
                    user.username,
                    user.email,
                    token
                ))
                return res.status(404).send({ message: "Check your email " + user.email })
            })
    })
}

exports.newPassword = (req, res) => {
    const newPassword = req.body.password;
    const repeatPassword = req.body.repeatPassword;
    const sentToken = req.body.token;
    User.findOne({ where: { resetToken: sentToken } })
        .then((user) => {
            if (!user) {
                return res.status(422).send({ error: "Try again session expired" });
            }
            if (newPassword !== repeatPassword) {
                return res.status(422).send({ error: "Passwords do not match" });
            }
            bcrypt.hash(newPassword, 12).then((hashedpassword) => {
                user.password = hashedpassword;
                user.resetToken = "";
                user.expireToken = undefined;
                user.save().then((saveduser) => {
                    return res.status(404).send({ message: "Password updated success" });
                });
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.generatePDF = async() => {
    try {
        const users = await User.findAll();

        if (!users || users.length === 0) {
            throw new Error('Users not found');
        }

        const fonts = {
            Roboto: {
                normal: path.join(process.cwd(), 'fonts', 'Roboto-Regular.ttf'),
                bold: path.join(process.cwd(), 'fonts', 'Roboto-Bold.ttf'),
                italics: path.join(process.cwd(), 'fonts', 'Roboto-Italic.ttf'),
                bolditalics: path.join(process.cwd(), 'fonts', 'Roboto-BoldItalic.ttf'),
            },
        };

        const tableContent = [
            [
                { text: 'Avatar', style: 'tableHeader' },
                { text: 'Korisničko ime', style: 'tableHeader' },
                { text: 'Ime', style: 'tableHeader' },
                { text: 'Prezime', style: 'tableHeader' },
                { text: 'Email', style: 'tableHeader' },
                { text: 'Status', style: 'tableHeader' },
                { text: 'Datum registracije', style: 'tableHeader' },
            ],
            ...users.map((user) => [{
                    image: user.data,
                    fit: [40, 40],
                    alignment: 'center',
                    style: 'tableImage',
                },
                { text: user.username, style: 'tableCell' },
                { text: user.firstname, style: 'tableCell' },
                { text: user.lastname, style: 'tableCell' },
                { text: user.email, style: 'tableCell' },
                { text: user.status, style: 'tableCell' },
                { text: moment(user.createdAt).format('DD.MM.YYYY'), style: 'tableCell' },
            ]),
        ];

        const docDefinition = {
            content: [
                { text: 'Lista korisnika', style: 'header' },
                { table: { body: tableContent }, style: 'table' },
            ],
            styles: {
                header: { fontSize: 26, bold: true, alignment: 'center' },
                table: { margin: [0, 10, 0, 10] },
                tableHeader: { fontSize: 14, bold: true, fillColor: '#dddddd' },
                tableCell: { fontSize: 12, bold: true },
                tableImage: {
                    borderRadius: 5,
                    decoration: 'rounded',
                },
            },
            defaultStyle: { font: 'Roboto' },
            pageMargins: [40, 40, 40, 40],
        };

        const printer = new pdfMake(fonts);
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const filePath = `./user-list.pdf`;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        pdfDoc.pipe(fs.createWriteStream(filePath));
        pdfDoc.end();

        return filePath;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to generate PDF');
    }
};


exports.changeProfilePicture = (req, res) => {
    try {
        console.log(req.file);

        if (req.file == undefined) {
            return res.send(`You must select a file.`);
        }
        User.update({
            type: req.file.mimetype,
            name: req.file.originalname,
            userId: req.body.userId,
            data: fs.readFileSync(
                __basedir + "/uploads/userphoto/" + req.file.filename
            ),

        }).then((user) => {
            fs.writeFileSync(
                __basedir + "/uploads/userphoto/" + user.name,
                user.data
            );


            return res.send(`File has been uploaded.`);
        });
    } catch (error) {
        console.log(error);
        return res.send(`Error when trying upload posts: ${error}`);
    }
};

exports.changeProfilePicture = async(req, res) => {
    try {
        console.log(req.file);

        if (req.file === undefined) {
            return res.status(400).send('You must select a file.');
        }

        const userId = req.body.userId;
        const user = await User.findOne({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).send('User not found.');
        }

        const { mimetype, originalname, filename } = req.file;

        const data = fs.readFileSync(req.file.path);
        var photoNameEncrypted = crypto.randomBytes(20).toString('hex');
        user.data = data;
        user.type = mimetype;
        user.photoName = photoNameEncrypted;

        await user.save();

        const targetDirectory = path.join(__basedir, 'uploads/userphoto');
        const targetPath = path.join(targetDirectory, user.photoName);
        fs.writeFileSync(targetPath, user.data);

        fs.unlinkSync(req.file.path);

        return res.status(200).send('Profile picture has been updated.');
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Error when trying to update profile picture: ${error}`);
    }
};