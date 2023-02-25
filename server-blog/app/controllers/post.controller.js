const db = require("../models");
const Post = db.post;
const fs = require("fs");
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 6;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: posts } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, posts, totalPages, currentPage };
};

exports.createPost = (req, res) => {
    try {
        console.log(req.file);

        if (req.file == undefined) {
            return res.send(`You must select a file.`);
        }

        Post.create({
            title: req.body.title,
            content: req.body.content,
            type: req.file.mimetype,
            name: req.file.originalname,
            userId: req.body.userId,
            data: fs.readFileSync(
                __basedir + "/uploads/" + req.file.filename
            ),
        }).then((post) => {
            fs.writeFileSync(
                __basedir + "/uploads/" + post.name,
                post.data
            );


            return res.send(`File has been uploaded.`);
        });
    } catch (error) {
        console.log(error);
        return res.send(`Error when trying upload posts: ${error}`);
    }
};

exports.findAll = (req, res) => {
    const { page, size, title } = req.query;
    var condition = title ? {
        title: {
            [Op.like]: `%${title}%`
        }
    } : null;

    const { limit, offset } = getPagination(page, size);

    Post.findAndCountAll({
            where: condition,
            limit,
            order: [
                ['id', 'DESC']
            ],
            offset
        })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving posts."
            });
        });
};
// Find a single Post with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Post.findByPk(id, { include: db.user })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Post with id=" + id
            });
        });
};
// Update a Post by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Post.update(req.body, {
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Post was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Post with id=${id}. Maybe Post was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Post with id=" + id
            });
        });
};

// Delete a Post with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Post.destroy({
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Post was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Post with id=${id}. Maybe Post was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Post with id=" + id
            });
        });
};

// Delete all Posts from the database.
exports.deleteAll = (req, res) => {
    Post.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({ message: `${nums} Posts were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Posts."
            });
        });
};

exports.findAllForHomePageMax3 = (req, res) => {
    const { page, size, title } = req.query;
    var condition = title ? {
        title: {
            [Op.like]: `%${title}%`
        }
    } : null;

    const { limit, offset } = getPagination(page, size);

    Post.findAndCountAll({
            where: condition,
            limit: 3,
            order: [
                ['id', 'DESC']
            ],
            offset
        })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving posts."
            });
        });
};