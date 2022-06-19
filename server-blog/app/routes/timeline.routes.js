const controller = require("../controllers/timeline.controller");


module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post("/api/auth/timelines", controller.createTimeline);
    app.get('/api/auth/showTimelines', controller.findAll);
    app.get('/api/auth/showAllPaginatedTimelines', controller.findAllPagination);
    app.get("/api/auth/showTimelines/:id", controller.findOne);
    app.delete("/api/auth/showTimelines/:id", controller.delete);
}