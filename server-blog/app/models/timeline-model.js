module.exports = (sequelize, Sequelize) => {
    const Timeline = sequelize.define("timelines", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        text: {
            type: Sequelize.STRING,
        },
    });

    return Timeline;
};