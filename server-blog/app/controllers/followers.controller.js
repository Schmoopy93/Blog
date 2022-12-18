const req = require("express/lib/request");
const db = require("../models");
const Followers = db.followers;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 6;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: followers } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, followers, totalPages, currentPage };
};

exports.follow = (req, res) => {
    try {
        Followers.create({
            userId: req.body.userId,
            followerId: req.body.followerId,
        });
    } catch (error) {
        console.log(error);
        return res.send(`Error when trying upload followers: ${error}`);
    }
};

exports.following = (req, res) => {
    const followerId = req.query.followerId;
    const userId = req.query.userId;
    var condition1 = followerId ? {
        followerId: {
            [Op.like]: `%${followerId}%`
        }
    } : null;
    var condition2 = userId ? {
        userId: {
            [Op.like]: `%${userId}%`
        }
    } : null;

    Followers.findAll({ where: [condition1, condition2], include: db.user })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving comments."
            });
        });
};

exports.unfollow = (req, res) => {
    const id = req.params.id;

    Followers.destroy({
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Following was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Following with id=${id}. Maybe Following was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Following with id=" + id
            });
        });
};

exports.friendList = (req, res) => {
    const { userId, page, size } = req.query;
    var condition = userId ? {
        userId: {
            [Op.like]: `%${userId}%`
        }
    } : null;

    const { limit, offset } = getPagination(page, size);

    Followers.findAndCountAll({ where: condition, limit, offset, include: [db.user] })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving followers."
            });
        });
};