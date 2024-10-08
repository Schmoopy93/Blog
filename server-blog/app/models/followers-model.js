module.exports = function(sequelize, Sequelize) {
    const Followers = sequelize.define('followers', {
        userId: {
            type: Sequelize.UUID,
            allowNull: true,
            referenceces: {
                model: 'users',
                key: 'userId'
            }
        },
        followerId: {
            type: Sequelize.UUID,
            allowNull: true,
            referenceces: {
                model: 'users',
                key: 'userId'
            }
        },
        status: {
            type: Sequelize.ENUM('Requested', 'Following'),
            defaultValue: 'Requested'
        },

        message: {
            type: Sequelize.TEXT,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        },

        indicator: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        }
    }, {
        freezeTableName: true
    });

    return Followers;
}