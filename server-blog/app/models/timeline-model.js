module.exports = (sequelize, Sequelize) => {
    const Timeline = sequelize.define("timelines", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        text: {
            type: Sequelize.STRING,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        },
    });

    return Timeline;
};