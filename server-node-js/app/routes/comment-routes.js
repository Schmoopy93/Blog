const controller = require("../controllers/comment.controller");


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  // app.post('/api/auth/posts/upload', upload.single("file"), fileWorker.createPost, controller.createPost);
  app.post("/api/auth/comments", controller.createComment);
  app.get('/api/auth/showComments', controller.findAll);
  //app.get("/api/auth/comments/:id", controller.findOne);
}