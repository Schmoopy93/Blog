const controller = require("../controllers/likes-timeline.controller");
const { verifyLikes } = require("../middleware");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post("/api/auth/timeline/likesTimeline", [
        verifyLikes.checkDuplicateLikesTimeline,
    ], controller.likeTimeline);
    app.get('/api/auth/showLikesByTimeline', controller.findAllLikesTimelinePagination);
}