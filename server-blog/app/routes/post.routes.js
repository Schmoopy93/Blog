const controller = require("../controllers/post.controller");

let upload = require('../config/multer.config.js');
 
// const fileWorker = require('../controllers/post.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  // app.post('/api/auth/posts/upload', upload.single("file"), fileWorker.createPost, controller.createPost);
  app.post('/api/auth/posts/upload', upload.single("file"), controller.createPost);
  app.post("/api/auth/posts", controller.createPost);
  app.get('/api/auth/posts', controller.findAll);
  app.get("/api/auth/posts/:id", controller.findOne);
  app.put("/api/auth/posts/:id", controller.update);
  app.delete("/api/auth/posts/:id", controller.delete);
  app.delete("/api/auth/posts/", controller.deleteAll);

}