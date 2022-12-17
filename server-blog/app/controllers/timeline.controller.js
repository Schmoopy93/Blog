const req = require("express/lib/request");
const db = require("../models");
const Timeline = db.timeline;
const Op = db.Sequelize.Op;
const timelineControllerLikes = require("../controllers/likes-timeline.controller");

const getPagination = (page, size) => {
    const limit = size ? +size : 6;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: timelines } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, timelines, totalPages, currentPage };
};


// const getPagingData = (data, page, limit) => {
//     const { rows: timelines } = data;
//     const totalItems = data.rows.length;
//     const currentPage = page ? +page : 0;
//     const totalPages = Math.ceil(totalItems / limit);

//     return { totalItems, timelines, totalPages, currentPage };
// };

exports.createTimeline = (req, res) => {
    return Timeline.create({
            text: req.body.text,
            userId: req.body.userId
        })
        .then((timeline) => {
            console.log(">> Created timeline: " + JSON.stringify(timeline, null, 4));
            return timeline;
        })
        .catch((err) => {
            console.log(">> Error while creating timeline: ", err);
        });
};

exports.findAll = (req, res) => {
    const userId = req.query.userId;
    var condition = userId ? {
        userId: {
            [Op.like]: `%${userId}%`
        }
    } : null;

    Timeline.findAll({ where: condition, include: db.user })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving timelines."
            });
        });
};

exports.findAllPagination = (req, res) => {
    const { page, size, userId } = req.query;
    var condition = userId ? {
        userId: {
            [Op.like]: `%${userId}%`
        }

    } : null;

    const { limit, offset } = getPagination(page, size);

    Timeline.findAndCountAll({
            where: condition,
            limit,
            offset,
            include: [{
                model: db.likes_timeline,
                as: 'likesTimeline',
            }]
        })
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

    Timeline.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Timeline with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Timeline.update(req.body, {
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Timeline was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Timeline with id=${id}. Maybe Timeline was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Timeline with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Timeline.destroy({
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Timeline was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Timeline with id=${id}. Maybe Timeline was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Timeline with id=" + id
            });
        });
};