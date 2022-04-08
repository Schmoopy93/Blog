const controller = require("../controllers/appointment.controller");


module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post("/api/auth/createAppointments", controller.createAppointment);
    app.get('/api/auth/findAllAppointments', controller.findAll);
    app.get("/api/auth/findAllAppointments/:id", controller.findOne);
    app.delete('/api/auth/findAllAppointments/:id', controller.delete);
}