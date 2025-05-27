require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sendEmail } = require('./app/config/nodemailer.contractform.config.js');
const { sendMessage } = require('./app/controllers/messages.controller.js');

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

const corsOptions = {
    origin: ["http://localhost:4200", "http://app:4200"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
    credentials: true,
};


app.use(cors(corsOptions));


app.options("*", cors(corsOptions));

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const req = require("express/lib/request.js");
const Role = db.role;
let connectedUsers = new Set();
let userStatus = {};

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
require('./app/routes/accepted-message.routes')(app);
require('./app/routes/messages.routes')(app);

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


io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('userConnected', (userId) => {
        connectedUsers.add(userId);
        userStatus[userId] = 'online';
        console.log('User connected:', userId);
        io.emit('updateUserStatus', { userId, status: 'online' });
    });


    socket.on('userDisconnected', (userId) => {
        connectedUsers.delete(userId);
        userStatus[userId] = 'offline';
        console.log('User disconnected:', userId);
        io.emit('updateUserStatus', { userId, status: 'offline' });
    });

    socket.on('disconnect', () => {
        const userId = Object.keys(userStatus).find(key => userStatus[key] === 'online');
        if (userId) {
            connectedUsers.delete(userId);
            userStatus[userId] = 'offline';
            io.emit('updateUserStatus', { userId, status: 'offline' });
        }
        console.log('User disconnected', socket.id);
    });

    socket.on('joinRoom', (roomId) => {
        if (socket.roomId) {
            socket.leave(socket.roomId);
        }
        socket.join(roomId);
        socket.roomId = roomId;
    });

    const followersController = require('./app/controllers/followers.controller');
    followersController.setIO(io);

    socket.on('chat message', async(messageData) => {
        try {
            await db.messages.create({
                senderId: messageData.senderId,
                receiverId: messageData.receiverId,
                text: messageData.text
            });
            io.to(messageData.receiverId.toString()).emit('newMessage', messageData);
        } catch (error) {
            console.error('Greška prilikom snimanja poruke:', error);
            io.to(messageData.senderId.toString()).emit('error', { message: 'Došlo je do greške prilikom snimanja poruke.' });
        }
    });

});

function updateUserStatuses() {
    connectedUsers.forEach((userId) => {
        io.emit('updateUserStatus', { userId, status: userStatus[userId] });
    });
}
setInterval(updateUserStatuses, 2000);

module.exports = {
    io: io
};

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});