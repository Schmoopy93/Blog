const controller = require("../controllers/followers.controller");
const { verifySignUp } = require("../middleware");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post('/api/auth/following', [verifySignUp.checkFollow], controller.follow);
    app.get('/api/auth/followRequest', controller.following);
    app.delete("/api/auth/unfollow/:id", controller.unfollow);
    app.get("/api/auth/getFollowers", controller.findMyFriends);
}