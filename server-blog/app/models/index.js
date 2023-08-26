const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD, {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: false,
        charset: 'utf8mb4',

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
db.followers = require("../models/followers-model.js")(sequelize, Sequelize);
db.user_roles = require("../models/user-roles-model.js")(sequelize, Sequelize);
db.likes = require("../models/likes-model.js")(sequelize, Sequelize);
db.likes_timeline = require("../models/likes-timeline-model.js")(sequelize, Sequelize);
db.photo_gallery = require("../models/photogallery-model.js")(sequelize, Sequelize);
db.category = require("../models/category-model.js")(sequelize, Sequelize);
db.accepted_messages = require("../models/accepted-message-model.js")(sequelize, Sequelize);


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

db.post.belongsTo(db.category, {
    through: "posts",
    foreignKey: "categoryId",
});

db.post.hasMany(db.comment, { as: "comments" });
db.comment.belongsTo(db.post, {
    foreignKey: "postId",
    as: "post",
});

db.photo_gallery.belongsTo(db.user, {
    through: "photogallery",
    foreignKey: "userId",
});


db.user.hasMany(db.comment);
db.comment.belongsTo(db.user);

db.user.hasMany(db.appointment);
db.appointment.belongsTo(db.user);
db.user.hasMany(db.followers);

db.timeline.belongsTo(db.user, {
    through: "timelines",
    foreignKey: "userId",
});

db.followers.belongsTo(db.user, {
    through: "followers",
    foreignKey: "userId",
});

db.followers.belongsTo(db.user, {
    through: "followers",
    foreignKey: "followerId",
});

db.post.hasMany(db.likes, { as: "likes" });
db.likes.belongsTo(db.post, {
    foreignKey: "postId",
    as: "post",
});

db.user.hasMany(db.likes, { as: "likes" });
db.likes.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user",
});

db.timeline.hasMany(db.likes_timeline, { as: "likesTimeline" });
db.likes_timeline.belongsTo(db.timeline, {
    foreignKey: "timelineId",
    as: "timeline",
});

db.user.hasMany(db.likes_timeline, { as: "likesTimeline" });
db.likes_timeline.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user",
});


db.ROLES = ["user", "admin", "moderator"];

module.exports = db;