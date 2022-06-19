const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD, {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: false,

        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.post = require("../models/post-model.js")(sequelize, Sequelize);
db.comment = require("../models/comment-model.js")(sequelize, Sequelize);
db.appointment = require("../models/appointment-model.js")(sequelize, Sequelize);
db.timeline = require("../models/timeline-model.js")(sequelize, Sequelize);


db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

db.post.belongsTo(db.user, {
    through: "posts",
    foreignKey: "userId",
});

db.post.hasMany(db.comment, { as: "comments" });
db.comment.belongsTo(db.post, {
    foreignKey: "postId",
    as: "post",
});

db.user.hasMany(db.comment);
db.comment.belongsTo(db.user);

db.user.hasMany(db.appointment);
db.appointment.belongsTo(db.user);

// db.user.hasMany(db.timeline);
// db.timeline.belongsTo(db.user);

db.timeline.belongsTo(db.user, {
    through: "timelines",
    foreignKey: "userId",
});


db.ROLES = ["user", "admin", "moderator"];

module.exports = db;