module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comments", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: Sequelize.STRING,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        },
    });
    return Comment;
};