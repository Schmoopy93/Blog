const controller = require("../controllers/likes.controller");
const { verifyLikes } = require("../middleware");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post("/api/auth/posts/likes", [
        verifyLikes.checkDuplicateLikes,
    ], controller.likePost);
    app.get('/api/auth/showLikesByPost', controller.findAllLikesPagination);
}