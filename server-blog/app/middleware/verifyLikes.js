const db = require("../models");
const Likes = db.likes;
const LikesTimeline = db.likes_timeline
checkDuplicateLikes = (req, res, next) => {
    Likes.findOne({
        where: {
            userId: req.body.userId,
            postId: req.body.postId
        }
    }).then(like => {
        if (like) {
            res.status(400).send({
                message: "You have already liked this post !"
            });
            return;
        }
        next();
    });
};

checkDuplicateLikesTimeline = (req, res, next) => {
    LikesTimeline.findOne({
        where: {
            userId: req.body.userId,
            timelineId: req.body.timelineId
        }
    }).then(like => {
        if (like) {
            res.status(400).send({
                message: "You have already liked this timeline !"
            });
            return;
        }
        next();
    });
};


const verifyLikes = {
    checkDuplicateLikes: checkDuplicateLikes,
    checkDuplicateLikesTimeline: checkDuplicateLikesTimeline
};

module.exports = verifyLikes;