module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("posts", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        },
        content: {
            type: Sequelize.TEXT,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        },
        type: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        data: {
            type: Sequelize.BLOB("long"),
        },
    });

    return Post;
};