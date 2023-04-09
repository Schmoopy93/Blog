module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        username: {
            type: Sequelize.STRING,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        },
        email: {
            type: Sequelize.STRING,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        },
        password: {
            type: Sequelize.STRING,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        },
        firstname: {
            type: Sequelize.STRING,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        },
        lastname: {
            type: Sequelize.STRING,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
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
            type: Sequelize.STRING,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        },
        phone: {
            type: Sequelize.STRING
        },
        town: {
            type: Sequelize.STRING,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
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