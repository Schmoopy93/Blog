module.exports = (sequelize, Sequelize) => {
    const PhotoGallery = sequelize.define("photogallery", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
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