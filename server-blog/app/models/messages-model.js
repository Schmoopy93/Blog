module.exports = (sequelize, Sequelize) => {
    const Messages = sequelize.define("messages", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        text: {
            type: Sequelize.STRING,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        },
    });
    return Messages;
};