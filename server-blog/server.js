require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sendEmail } = require('./app/config/nodemailer.contractform.config.js');

// Constants for roles that are stored in .env file
const roleOneID = process.env.ROLE_ONE_ID;
const roleTwoID = process.env.ROLE_TWO_ID;
const roleThreeID = process.env.ROLE_THREE_ID;

const roleOne = process.env.ROLE_ONE;
const roleTwo = process.env.ROLE_TWO;
const roleThree = process.env.ROLE_THREE;

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

global.__basedir = __dirname;

var corsOptions = {
    origin: "http://localhost:4200"
};

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync()
    // db.sequelize.sync({ force: true }).then(() => {
    //     console.log('Drop and Resync Database with { force: true }');
    // });
    // initial();

// Routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/post.routes')(app);
require('./app/routes/comment-routes')(app);
require('./app/routes/appointment.routes')(app);
require('./app/routes/timeline.routes')(app);
require('./app/routes/followers.routes')(app);
require('./app/routes/roles.routes')(app);
require('./app/routes/likes.routes')(app);
require('./app/routes/likes-timeline.routes')(app);
require('./app/routes/photogallery.routes')(app);
require('./app/routes/category.routes')(app);

function initial() {
    Role.create({
        id: roleOneID,
        name: roleOne
    });

    Role.create({
        id: roleTwoID,
        name: roleTwo
    });

    Role.create({
        id: roleThreeID,
        name: roleThree
    });
}

app.post('/api/auth/send-email', async(req, res) => {
    const { name, email, message } = req.body;

    try {
        const info = await sendEmail(name, email, message);
        res.status(200).send({ message: "Email sent" });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while sending the email');
    }
});

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });

    const followersController = require('./app/controllers/followers.controller');
    followersController.setIO(io);

});

module.exports = {
    io: io
};

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});