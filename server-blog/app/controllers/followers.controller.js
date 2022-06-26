const req = require("express/lib/request");
const db = require("../models");
const Followers = db.followers;
const Op = db.Sequelize.Op;

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