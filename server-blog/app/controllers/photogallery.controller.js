const db = require("../models");
const PhotoGallery = db.photo_gallery;
const fs = require("fs");
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 6;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: photoGallery } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, photoGallery, totalPages, currentPage };
};

exports.addGallery = (req, res) => {
    try {
        console.log(req.file);

        if (req.file == undefined) {
            return res.send(`You must select a file.`);
        }

        PhotoGallery.create({
            title: req.body.title,
            type: req.file.mimetype,
            name: req.file.originalname,
            userId: req.body.userId,
            data: fs.readFileSync(
                __basedir + "/uploads/" + req.file.filename
            ),
        }).then((photo_gallery) => {
            fs.writeFileSync(
                __basedir + "/uploads/" + photo_gallery.name,
                photo_gallery.data
            );


            return res.send(`File has been uploaded.`);
        });
    } catch (error) {
        console.log(error);
        return res.send(`Error when trying upload photos: ${error}`);
    }
};

exports.findAllGallery = (req, res) => {
    const { page, size, userId } = req.query;
    var condition = userId ? {
        userId: {
            [Op.like]: `%${userId}%`
        }
    } : null;

    const { limit, offset } = getPagination(page, size);
    PhotoGallery.findAndCountAll({
            where: condition,
            limit,
            order: [
                ['id', 'DESC']
            ],
            offset
        })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving photo gallery."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    PhotoGallery.findByPk(id, { include: db.user })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving PhotoGallery with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    PhotoGallery.destroy({
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "PhotoGallery was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete PhotoGallery with id=${id}. Maybe PhotoGallery was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete PhotoGallery with id=" + id
            });
        });
};