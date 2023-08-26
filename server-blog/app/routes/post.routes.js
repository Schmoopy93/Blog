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
            res.set('Cache-Control', 'no-store');
            res.set('Pragma', 'no-cache');
            const postId = req.params.id;
            const filePath = await generatePDFPostById(postId);
            const fileStream = fs.createReadStream(filePath);
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Failed to delete file:', err);
                    } else {
                        console.log('File deleted successfully');
                    }
                });
            }
            res.setHeader('Content-Type', 'application/pdf;');
            fileStream.pipe(res);
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to generate PDF');
        }
    });
}