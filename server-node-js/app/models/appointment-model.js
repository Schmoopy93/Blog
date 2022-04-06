module.exports = (sequelize, Sequelize) => {
    const Appointment = sequelize.define("appointments", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: Sequelize.STRING
        },
    });
    return Appointment;
};