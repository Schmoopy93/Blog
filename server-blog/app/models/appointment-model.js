module.exports = (sequelize, Sequelize) => {
    const Appointment = sequelize.define("appointments", {
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
        start: {
            type: Sequelize.STRING,
            required: true,
        },
        completed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        backgroundColor: {
            type: Sequelize.STRING,
            defaultValue: 'blue'
        }
    });

    return Appointment;
};