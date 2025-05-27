const req = require("express/lib/request");
const db = require("../models");
const Category = db.category;
const Op = db.Sequelize.Op;

exports.createCategory = (req, res) => {
    Category.create({
            text: req.body.text,
        })
        .then((category) => {
            console.log(">> Created category: " + JSON.stringify(category, null, 4));
            res.status(201).json(category);
        })
        .catch((err) => {
            console.log(">> Error while creating category: ", err);
            res.status(500).json({ message: "Error while creating category", error: err.message });
        });
};

exports.findAll = (req, res) => {
    Category.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving posts."
            });
        });
};