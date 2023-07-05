module.exports = (sequelize, Sequelize) => {
    const AcceptedMessage = sequelize.define("acceptedMessages", {
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
        userId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
        }
    });
    return AcceptedMessage;
};