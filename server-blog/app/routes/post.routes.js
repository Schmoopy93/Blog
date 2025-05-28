const controller = require("../controllers/post.controller");
const { generatePDFPostById } = require('../controllers/post.controller.js');
const { convertToUTF8 } = require('../controllers/post.controller.js');
let upload = require('../config/multer.config.js');
const fs = require("fs");
module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post('/api/auth/posts/upload', upload.single("file"), controller.createPost);
    app.post("/api/auth/posts", controller.createPost);
    app.get('/api/auth/posts', controller.findAll);
    app.get('/api/auth/postsHomePage', controller.findAllForHomePageMax3);
    app.get("/api/auth/posts/:id", controller.findOne);
    app.put("/api/auth/posts/:id", controller.update);
    app.delete("/api/auth/posts/:id", controller.delete);
    app.delete("/api/auth/posts/", controller.deleteAll);
    app.get('/posts/pdf/:id', async(req, res) => {
        try {
            const filePath = await controller.generatePDFPostById(req.params.id);
            res.download(filePath, `post-${req.params.id}.pdf`, (err) => {
                if (err) {
                    console.error("Error sending PDF file:", err);
                    res.status(500).send("Error generating PDF");
                } else {
                    if (fs.existsSync(filePath)) {
                        fs.unlink(filePath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error("Error deleting PDF file:", unlinkErr);
                            } else {
                                console.log("File deleted successfully");
                            }
                        });
                    } else {
                        console.warn("File does not exist, cannot delete:", filePath);
                    }
                }
            });
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            res.status(500).send("Failed to generate PDF");
        }
    });
};