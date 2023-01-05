require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//Constants for roles that are stored in .env file
const roleOneID = process.env.ROLE_ONE_ID;
const roleTwoID = process.env.ROLE_TWO_ID;
const roleThreeID = process.env.ROLE_THREE_ID;

const roleOne = process.env.ROLE_ONE;
const roleTwo = process.env.ROLE_TWO;
const roleThree = process.env.ROLE_THREE;

const app = express();
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

db.sequelize.sync();
// db.sequelize.sync({ force: true }).then(() => {
//     console.log('Drop and Resync Database with { force: true }');

// });
// initial();

// routes
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});