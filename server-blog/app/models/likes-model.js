module.exports = function(sequelize, Sequelize) {
    const Likes = sequelize.define('likes', {
        userId: {
            type: Sequelize.UUID,
            allowNull: true,
            referenceces: {
                model: 'users',
                key: 'userId'
            }
        },
        postId: {
            type: Sequelize.UUID,
            allowNull: true,
            referenceces: {
                model: 'posts',
                key: 'postId'
            }
        },
    }, {
        freezeTableName: true
    });

    return Likes;
}