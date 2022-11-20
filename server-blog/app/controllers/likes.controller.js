const req = require("express/lib/request");
const db = require("../models");
const Likes = db.likes;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 6;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: likes } = data;
    const currentPage = page ? +page : 0;
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
    const { page, size, postId } = req.query;
    var condition = postId ? {
        postId: {
            [Op.like]: `%${postId}%`
        }
    } : null;

    const { limit, offset } = getPagination(page, size);

    Likes.findAndCountAll({ where: condition, limit, offset, include: db.user })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
            console.log(response, "RES");
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

// exports.getLikes = (req, res) => {
//     const postId = req.query.postId;
//     const userId = req.query.userId;
//     var condition1 = postId ? {
//         postId: {
//             [Op.like]: `%${postId}%`
//         }
//     } : null;
//     var condition2 = userId ? {
//         userId: {
//             [Op.like]: `%${userId}%`
//         }
//     } : null;

//     Likes.findAll({ where: [condition1, condition2], include: db.user })
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: err.message || "Some error occurred while retrieving comments."
//             });
//         });
// };