const req = require("express/lib/request");
const db = require("../models");
const AcceptedMessage = db.accepted_messages;
const Op = db.Sequelize.Op;

exports.createMessageFromSocket = (req, res) => {
    AcceptedMessage.create({
            text: req.body.text,
            userId: req.body.userId
        })
        .then((category) => {
            console.log(">> Created a message: " + JSON.stringify(category, null, 4));
            return category;
        })
        .catch((err) => {
            console.log(">> Error while creating category: ", err);
        });
};

exports.getNotificationHistory = (req, res) => {
    const { userId } = req.query;
    var condition = userId ? {
        userId: {
            [Op.like]: `%${userId}%`
        }
    } : null;
    console.log(userId, "userID")

    AcceptedMessage.findAndCountAll({
            where: condition,
            limit: 3,
            order: [
                ['id', 'DESC']
            ]
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving posts."
            });
        });
};

exports.deleteNotificationHistoryById = (req, res) => {
    const id = req.params.id;

    AcceptedMessage.destroy({
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "AcceptedMessage was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete AcceptedMessage with id=${id}. Maybe AcceptedMessage was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete AcceptedMessage with id=" + id
            });
        });
};