const req = require("express/lib/request");
const db = require("../models");
const Role = db.role;
const UserRole = db.user_roles;
const Op = db.Sequelize.Op;


exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? {
        name: {
            [Op.like]: `%${name}%`
        }
    } : null;
    Role.findAll({ where: condition, include: db.user })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving roles."
            });
        });
};

exports.update = (req, res) => {
    const userId = req.params.id;

    UserRole.update(req.body, {
            where: { userId: userId }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Role was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update User role with id=${userId}. Maybe User role was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + userId
            });
        });
};