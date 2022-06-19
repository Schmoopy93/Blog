module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        firstname: {
            type: Sequelize.STRING
        },
        lastname: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM('Active', 'Pending'),
            defaultValue: 'Pending'
        },
        confirmationCode: {
            type: Sequelize.STRING,
            unique: true
        },
        type: {
            type: Sequelize.STRING
        },
        photoName: {
            type: Sequelize.STRING
        },
        data: {
            type: Sequelize.BLOB("long"),
        },
        address: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        town: {
            type: Sequelize.STRING
        },
        resetToken: {
            type: Sequelize.STRING
        },
        expireToken: {
            type: Sequelize.DATE
        },
    });

    return User;
};