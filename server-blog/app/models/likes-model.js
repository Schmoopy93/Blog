module.exports = function(sequelize, Sequelize) {
    const Likes = sequelize.define('likes', {
        indicator: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        }
    });

    return Likes;
}