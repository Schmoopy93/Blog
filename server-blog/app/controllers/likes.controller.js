const req = require("express/lib/request");
const db = require("../models");
const Likes = db.likes;
const Op = db.Sequelize.Op;

const getPagination = (pageLikes, pageSizeLikes) => {
    const limit = pageSizeLikes ? +pageSizeLikes : 6;
    const offset = pageLikes ? pageLikes * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, pageLikes, limit) => {
    const { count: totalItems, rows: likes } = data;
    const currentPage = pageLikes ? +pageLikes : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, likes, totalPages, currentPage };
};

exports.likePost = (req, res) => {
    return Likes.create({
            postId: req.body.postId,
            userId: req.body.userId
        })
        .then((like) => {
            console.log(">> Created like: " + JSON.stringify(like, null, 4));
            return like;
        })
        .catch((err) => {
            console.log(">> Error while creating like: ", err);
        });
};

exports.findAllLikesPagination = (req, res) => {
    const { pageLikes, pageSizeLikes, postId, userId } = req.query;
    var condition = postId ? {
        postId: {
            [Op.like]: `%${postId}%`
        }
    } : null;
    var condition2 = userId ? {
        userId: {
            [Op.like]: `%${userId}%`
        }
    } : null;

    const { limit, offset } = getPagination(pageLikes, pageSizeLikes);
    Likes.findAndCountAll({
            where: [condition, condition2],
            limit,
            offset,
            include: [{
                model: db.user,
                as: 'user',
            }]
        }).then(data => {
            const response = getPagingData(data, pageLikes, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving likes."
            });
        });
};