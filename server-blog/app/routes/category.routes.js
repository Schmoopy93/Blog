const controller = require("../controllers/category.controller");


module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.get('/api/auth/findAllCategories', controller.findAll);
    app.post('/api/auth/posts/createCategory', controller.createCategory);
}