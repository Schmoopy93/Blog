const db = require("../models");
const Likes = db.likes;

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

const verifyLikes = {
    checkDuplicateLikes: checkDuplicateLikes,
};

module.exports = verifyLikes;