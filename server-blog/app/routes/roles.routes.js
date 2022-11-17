const controller = require("../controllers/roles.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get('/api/auth/roles', controller.findAll);
    app.put('/api/auth/roles/:id', controller.update);
}