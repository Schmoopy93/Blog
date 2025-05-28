const req = require("express/lib/request");
const db = require("../models");
const Followers = db.followers;
const Messages = db.messages;
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

let socket;

exports.setIO = (socketIO) => {
    socket = socketIO;
};

exports.sendMessage = async(req, res, io) => {
    try {
        const message = await Messages.create({
            senderId: req.body.senderId,
            receiverId: req.body.receiverId,
            text: req.body.text,
        });
        if (socket) {
            socket.emit('messageCreated', message);
            socket.emit('messages', message);
        }

        return res.status(200).json({
            success: true,
            message: 'A message created successfully',
            data: message,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Error when trying to create message: ${error}`,
        });
    }
};



exports.getMessages = async(req, res) => {
    try {
        const { senderId, receiverId } = req.query;
        const messages = await Messages.findAll({
            where: {
                [Op.or]: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            },
            include: [{
                    model: db.user,
                    as: 'sender',
                    attributes: ['id', 'firstname', 'lastname', 'photoName']
                },
                {
                    model: db.user,
                    as: 'receiver',
                    attributes: ['id', 'firstname', 'lastname', 'photoName']
                }
            ],
            order: [
                ['createdAt', 'ASC']
            ]
        });
        res.json({ messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error when trying to get a message" });
    }


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
};