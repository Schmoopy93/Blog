const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
let upload = require('../config/userphoto-multer.config');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/auth/signin", controller.signin);
    app.get("/api/auth/confirm/:confirmationCode", controller.verifyUser)
    app.post('/api/auth/signup/upload', upload.single("file"), [
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted
    ], controller.signup);
    app.get('/api/auth/users', controller.findAll);
    app.get('/api/auth/users/list-users', controller.findAllPaginatedForUserList);
    app.get('/api/auth/users/:id', controller.findOne);
    app.put('/api/auth/users/:id', controller.update);
    app.delete('/api/auth/users/:id', controller.delete);
    app.post('/api/auth/users/retrieve-password', controller.retrievePassowrd);
    app.post('/api/auth/users/new-password', controller.newPassword);

};