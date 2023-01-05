const controller = require("../controllers/photogallery.controller");

let upload = require('../config/multer.config.js');

// const fileWorker = require('../controllers/post.controller');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post('/api/auth/photogallery/upload', upload.single("file"), controller.addGallery);
    app.get('/api/auth/gallery', controller.findAllGallery);
    app.get("/api/auth/gallery/:id", controller.findOne);
    app.delete("/api/auth/gallery/:id", controller.delete);
}