const req = require("express/lib/request");
const db = require("../models");
const Appointment = db.appointment;
const Op = db.Sequelize.Op;

// const getPagination = (page, size) => {
//     const limit = size ? +size : 6;
//     const offset = page ? page * limit : 0;

//     return { limit, offset };
// };

// const getPagingData = (data, page, limit) => {
//     const { count: totalItems, rows: posts } = data;
//     const currentPage = page ? +page : 0;
//     const totalPages = Math.ceil(totalItems / limit);

//     return { totalItems, posts, totalPages, currentPage };
// };

exports.createAppointment = (req, res) => {
    return Appointment.create({
            title: req.body.title,
            userId: req.body.userId,
            start: req.body.start
        })
        .then((appointment) => {
            console.log(">> Created appointment: " + JSON.stringify(appointment, null, 4));
            return appointment;
        })
        .catch((err) => {
            console.log(">> Error while creating appointment: ", err);
        });
};

exports.findAll = (req, res) => {
    const userId = req.query.postId;
    var condition = userId ? {
        userId: {
            [Op.like]: `%${userId}%`
        }
    } : null;

    Appointment.findAll({ where: condition, include: db.user })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving posts."
            });
        });
};

// exports.findAllPagination = (req, res) => {
//     const { page, size, content } = req.query;
//     var condition = content ? {
//         content: {
//             [Op.like]: `%${content}%`
//         }
//     } : null;

//     const { limit, offset } = getPagination(page, size);

//     Appointment.findAndCountAll({ where: condition, limit, offset })
//         .then(data => {
//             const response = getPagingData(data, page, limit);
//             res.send(response);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: err.message || "Some error occurred while retrieving tutorials."
//             });
//         });
// };
exports.findOne = (req, res) => {
    const id = req.params.id;

    Appointment.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Appointment with id=" + id
            });
        });
};