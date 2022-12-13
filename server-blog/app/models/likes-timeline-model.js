module.exports = function(sequelize, Sequelize) {
    const LikesTimeline = sequelize.define('likesTimeline', {
        indicator: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        }
    });

    return LikesTimeline;
}