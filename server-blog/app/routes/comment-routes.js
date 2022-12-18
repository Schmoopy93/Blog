const controller = require("../controllers/comment.controller");


module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post("/api/auth/comments", controller.createComment);
    app.get('/api/auth/showComments', controller.findAll);
    app.get('/api/auth/showAllPaginatedComments', controller.findAllPagination);
    app.get("/api/auth/showComments/:id", controller.findOne);
    app.delete("/api/auth/showComments/:id", controller.delete);
    app.put("/api/auth/editComment/:id", controller.update);
}