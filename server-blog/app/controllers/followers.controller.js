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

let socket; // Initialize a variable to store the io object

exports.setIO = (socketIO) => {
    socket = socketIO;
};

exports.follow = async(req, res, io) => {
    try {
        const follower = await Followers.create({
            userId: req.body.userId,
            followerId: req.body.followerId,
            message: req.body.message,
        });
        if (socket) {
            socket.emit('followerCreated', follower);
            socket.emit('notifications', follower);
        }

        return res.status(200).json({
            success: true,
            message: 'Follower created successfully',
            data: follower,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Error when trying to create follower: ${error}`,
        });
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
                message: err.message || "Some error occurred while retrieving followers."
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

// exports.notifications = (req, res) => {
//     const { followerId, page, size } = req.query;
//     var condition = followerId ? {
//         followerId: {
//             [Op.like]: `%${followerId}%`
//         }
//     } : null;

//     const { limit, offset } = getPagination(page, size);

//     Followers.findAndCountAll({ where: condition, limit, offset, include: [db.user] })
//         .then(data => {
//             const response = getPagingData(data, page, limit);
//             res.send(response);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: err.message || "Some error occurred while retrieving followers."
//             });
//         });
// };

exports.notifications = (req, res, io) => {
    const { followerId, page, size } = req.query;
    var condition = followerId ? {
        followerId: {
            [Op.like]: `%${followerId}%`,
        },
    } : null;

    const { limit, offset } = getPagination(page, size);

    Followers.findAndCountAll({
            where: condition,
            limit,
            offset,
            //include: [db.user],
        })
        .then((data) => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving followers.",
            });
        });
};



exports.acceptFriendship = (req, res, next) => {
    Followers.findOne({
            where: {
                id: req.params.id
            }
        })
        .then((follower) => {

            if (!follower) {
                return res.status(404).send({ message: "Follower Not found." });
            }
            follower.status = "Following";
            follower.message = "";
            follower.save((err) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
            });
        })
        .catch((e) => console.log("error", e));
};