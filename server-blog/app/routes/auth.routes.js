const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
let upload = require('../config/userphoto-multer.config');
const { generatePDF } = require('../controllers/auth.controller.js');
const fs = require('fs');
const { Readable } = require('stream');
const express = require('express');
const router = express.Router();
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
    app.put('/api/auth/changeProfilePicture/upload', upload.single("file"), controller.changeProfilePicture);
    router.get('/generate-pdf', async(req, res) => {
        try {
            const filePath = await controller.generatePDF();

            // Pošalji PDF fajl kao odgovor
            res.download(filePath, 'user-list.pdf', (err) => {
                if (err) {
                    console.error("Error sending PDF file:", err);
                    res.status(500).send("Error generating PDF");
                }
            });
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            res.status(500).send("Failed to generate PDF");
        }
    });
    app.get('/api/auth/followedUsers', controller.getFilteredUsers);

};