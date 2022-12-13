const req = require("express/lib/request");
const db = require("../models");
const LikesTimeline = db.likes_timeline;
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

exports.likeTimeline = (req, res) => {
    return LikesTimeline.create({
            timelineId: req.body.timelineId,
            userId: req.body.userId
        })
        .then((like) => {
            console.log(">> Created like for timeline: " + JSON.stringify(like, null, 4));
            return like;
        })
        .catch((err) => {
            console.log(">> Error while creating like: ", err);
        });
};

exports.findAllLikesTimelinePagination = (req, res) => {
    const { pageLikes, pageSizeLikes, timelineId, userId } = req.query;
    var condition = timelineId ? {
        timelineId: {
            [Op.like]: `%${timelineId}%`
        }
    } : null;
    var condition2 = userId ? {
        userId: {
            [Op.like]: `%${userId}%`
        }
    } : null;

    const { limit, offset } = getPagination(pageLikes, pageSizeLikes);
    LikesTimeline.findAndCountAll({
            where: [condition, condition2],
            limit,
            offset,
            include: [{
                    model: db.user,
                    as: 'user',
                },
                {
                    model: db.timeline,
                    as: 'timeline',
                }
            ]
        }).then(data => {
            const response = getPagingData(data, pageLikes, limit);
            res.send(response);
            console.log(response, "RESPONSE")
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving likes for timeline."
            });
        });
};