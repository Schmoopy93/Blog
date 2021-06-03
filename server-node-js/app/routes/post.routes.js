const controller = require("../controllers/post.controller");

const express = require('express');
const route = express.Router()

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/posts", controller.createPost);
  app.get('/api/auth/posts', controller.findAll);
}