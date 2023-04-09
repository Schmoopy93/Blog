module.exports = (sequelize, Sequelize) => {
    const PhotoGallery = sequelize.define("photogallery", {
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
        type: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        data: {
            type: Sequelize.BLOB("long"),
        },
    });

    return PhotoGallery;
};