const req = require("express/lib/request");
const db = require("../models");
const Comment = db.comment;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 6;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: comments } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, comments, totalPages, currentPage };
};

exports.createComment = (req, res) => {
    return Comment.create({
            content: req.body.content,
            postId: req.body.postId,
            userId: req.body.userId
        })
        .then((comment) => {
            console.log(">> Created comment: " + JSON.stringify(comment, null, 4));
            return comment;
        })
        .catch((err) => {
            console.log(">> Error while creating comment: ", err);
        });
};

exports.findAll = (req, res) => {
    const postId = req.query.postId;
    var condition = postId ? {
        postId: {
            [Op.like]: `%${postId}%`
        }
    } : null;

    Comment.findAll({ where: condition, include: db.user })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving comments."
            });
        });
};

exports.findAllPagination = (req, res) => {
    const { page, size, content } = req.query;
    var condition = content ? {
        content: {
            [Op.like]: `%${content}%`
        }
    } : null;

    const { limit, offset } = getPagination(page, size);

    Comment.findAndCountAll({ where: condition, limit, offset })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        });
};
exports.findOne = (req, res) => {
    const id = req.params.id;

    Comment.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Comment with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Comment.destroy({
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Comment was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Comment with id=${id}. Maybe Comment was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Comment with id=" + id
            });
        });
};