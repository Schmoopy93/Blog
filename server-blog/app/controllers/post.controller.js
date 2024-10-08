const db = require("../models");
const Post = db.post;
const User = db.user;
const fs = require("fs");
const Op = db.Sequelize.Op;
const pdfMake = require('pdfmake');
const path = require('path');

const getPagination = (page, size) => {
    const limit = size ? +size : 6;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: posts } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, posts, totalPages, currentPage };
};

exports.createPost = (req, res) => {
    try {
        console.log(req.file);

        if (req.file == undefined) {
            return res.send(`You must select a file.`);
        }

        Post.create({
            title: req.body.title,
            content: req.body.content,
            type: req.file.mimetype,
            name: req.file.originalname,
            userId: req.body.userId,
            categoryId: req.body.categoryId,
            data: fs.readFileSync(
                __basedir + "/uploads/" + req.file.filename
            ),

        }).then((post) => {
            fs.writeFileSync(
                __basedir + "/uploads/" + post.name,
                post.data
            );


            return res.send(`File has been uploaded.`);
        });
    } catch (error) {
        console.log(error);
        return res.send(`Error when trying upload posts: ${error}`);
    }
};


exports.findAll = (req, res) => {
    const { page, size, categoryId } = req.query;

    var condition = categoryId ? {
        categoryId: {
            [Op.like]: `%${categoryId}%`
        }
    } : null;

    const { limit, offset } = getPagination(page, size);

    Post.findAndCountAll({
            where: condition,
            limit,
            order: [
                ['id', 'DESC']
            ],
            offset,
            include: db.category
        })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving posts."
            });
        });
};
// Find a single Post with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Post.findByPk(id, { include: [db.user, db.category] })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Post with id=" + id
            });
        });
};
// Update a Post by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Post.update(req.body, {

            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Post was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Post with id=${id}. Maybe Post was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Post with id=" + id
            });
        });
};

// Delete a Post with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Post.destroy({
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Post was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Post with id=${id}. Maybe Post was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Post with id=" + id
            });
        });
};

// Delete all Posts from the database.
exports.deleteAll = (req, res) => {
    Post.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({ message: `${nums} Posts were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Posts."
            });
        });
};

exports.findAllForHomePageMax3 = (req, res) => {
    const { page, size, title } = req.query;
    var condition = title ? {
        title: {
            [Op.like]: `%${title}%`
        }
    } : null;

    const { limit, offset } = getPagination(page, size);

    Post.findAndCountAll({
            where: condition,
            limit: 3,
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
                message: err.message || "Some error occurred while retrieving posts."
            });
        });
};

exports.generatePDFPostById = async(postId) => {
    try {
        const post = await Post.findByPk(postId);

        if (!post) {
            throw new Error('Post not found');
        }

        const user = await User.findByPk(post.userId);

        if (!user) {
            throw new Error('User not found');
        }

        const author = { text: `Author: ${user.firstname + " " + user.lastname}`, style: 'author' };

        const fonts = {
            Roboto: {
                normal: path.join(process.cwd(), 'fonts', 'Roboto-Regular.ttf'),
                bold: path.join(process.cwd(), 'fonts', 'Roboto-Bold.ttf'),
                italics: path.join(process.cwd(), 'fonts', 'Roboto-Italic.ttf'),
                bolditalics: path.join(process.cwd(), 'fonts', 'Roboto-BoldItalic.ttf'),
            },
        };

        const docDefinition = {
            content: [
                { image: post.data, width: 500 },
                '\n',
                author,
                '\n\n\n',
                { text: post.title, style: 'header' },
                '\n\n\n',
                { text: post.content, style: 'content' },
            ],
            styles: {
                header: { fontSize: 26, bold: true, alignment: 'center' },
                content: { fontSize: 16 },
                author: { fontSize: 14, italics: true, alignment: 'left' },
            },
            defaultStyle: { font: 'Roboto' },
            pageMargins: [40, 40, 40, 40],
        };

        const printer = new pdfMake(fonts);
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const filePath = `./post-${postId}.pdf`;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        pdfDoc.pipe(fs.createWriteStream(filePath));
        pdfDoc.end();

        return filePath;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to generate PDF');
    }
};