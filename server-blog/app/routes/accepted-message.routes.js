const controller = require("../controllers/accepted-message.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post('/api/auth/createMessageFromSocket', controller.createMessageFromSocket);
    app.get('/api/auth/notificationsHistory', controller.getNotificationHistory)
    app.delete("/api/auth/notificationsHistory/:id", controller.deleteNotificationHistoryById);
}