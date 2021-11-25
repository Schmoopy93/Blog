module.exports = (sequelize, Sequelize) => {
    const Appointment = sequelize.define("appointment", {
      problem: {
        type: Sequelize.STRING
      },
      
    });
    return Appointment;
  };
  