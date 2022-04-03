const req = require("express/lib/request");
const db = require("../models");
const Comment = db.comment;
const Op = db.Sequelize.Op;

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

exports.createComment = (req, res) => {
    return Comment.create({
            content: req.body.content,
            postId: req.body.postId,
            userId: req.body.userId
        })
        .then((comment) => {
            console.log(">> Created comment: " + JSON.stringify(comment, null, 4));
            return comment;
        })
        .catch((err) => {
            console.log(">> Error while creating comment: ", err);
        });
};

exports.findAll = (req, res) => {
    const postId = req.query.postId;
    var condition = postId ? {
        postId: {
            [Op.like]: `%${postId}%`
        }
    } : null;

    Comment.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving posts."
            });
        });
};

exports.findAllPagination = (req, res) => {
    const { page, size, content } = req.query;
    var condition = content ? {
        content: {
            [Op.like]: `%${content}%`
        }
    } : null;

    const { limit, offset } = getPagination(page, size);

    Comment.findAndCountAll({ where: condition, limit, offset })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        });
};
exports.findOne = (req, res) => {
    const id = req.params.id;

    Comment.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Comment with id=" + id
            });
        });
};





























































// const express = require('express')
// const Comment = require('../models/Comment')
// const Post = require('../models/post-model')

// const router = new express.Router()

// async function validateCommentCreateForm (payload) {
//   const errors = {}
//   let isFormValid = true
//   let message = ''

//   if (!payload || typeof payload.text !== 'string' || payload.text.length < 6) {
//     isFormValid = false
//     errors.text = 'Comment Text must be at least 6 symbols'
//   }

//   if (!isFormValid) {
//     message = 'Check the form for errors.'
//   }
//   return {
//     success: isFormValid,
//     message,
//     errors
//   }
// }

// router.post('/create', async (req, res) => {
//   const commentObj = req.body
//   const validationResult = await validateCommentCreateForm(commentObj)
//   if (!validationResult.success) {
//     return res.status(400).json({
//       success: false,
//       message: validationResult.message,
//       errors: validationResult.errors
//     })
//   }
//   commentObj.creator = req.user._id

//   Comment
//     .create(commentObj)
//     .then((createdComment) => {
//       Post
//         .findById(createdComment.postId)
//         .then(post => {
//           let postComments = post.comments
//           postComments.push(createdComment._id)
//           post.comments = postComments
//           post
//             .save()
//             .then(() => {
//               res.status(200).json({
//                 success: true,
//                 message: 'Comment created successfully',
//                 data: createdComment
//               })
//             })
//             .catch((err) => {
//               console.log(err)
//               const message = 'Something went wrong :('
//               return res.status(401).json({
//                 success: false,
//                 message: message
//               })
//             })
//         })
//     })
//     .catch((err) => {
//       console.log(err)
//       const message = 'Something went wrong :('
//       return res.status(401).json({
//         success: false,
//         message: message
//       })
//     })
// })

// router.post('/edit/:id', async (req, res) => {
//   const commentId = req.params.id
//   let existingComment = await Comment.findById(commentId)
//     .catch((err) => {
//       console.log(err)
//       const message = 'Something went wrong :( Check the form for errors.'
//       return res.status(401).json({
//         success: false,
//         message: message
//       })
//     })
//   if (req.user._id.toString() === existingComment.creator.toString() || req.user.roles.indexOf('Admin') > -1) {
//     const commentObj = req.body
//     const validationResult = await validateCommentCreateForm(commentObj)
//     if (!validationResult.success) {
//       return res.status(401).json({
//         success: false,
//         message: validationResult.message,
//         errors: validationResult.errors
//       })
//     }

//     existingComment.text = commentObj.text
//     existingComment.creationDate = Date.now()
//     existingComment
//       .save()
//       .then(editedComment => {
//         res.status(200).json({
//           success: true,
//           message: 'Comment Edited Successfully.',
//           data: editedComment
//         })
//       })
//       .catch((err) => {
//         console.log(err)
//         let message = 'Something went wrong :( Check the form for errors.'
//         return res.status(401).json({
//           success: false,
//           message: message
//         })
//       })
//   } else {
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid credentials!'
//     })
//   }
// })

// router.delete('/delete/:id', async (req, res) => {
//   const commentId = req.params.id
//   let comment = await Comment.findById(commentId)
//     .catch((err) => {
//       console.log(err)
//       const message = 'Entry does not exist!'
//       return res.status(401).json({
//         success: false,
//         message: message
//       })
//     })
//   if (req.user._id.toString() === comment.creator.toString() || req.user.roles.includes('Admin') > -1) {
//     let post = await Post.findById(comment.postId)
//     console.log(post.comments)
//     let postComments = post.comments.filter(c => c.toString() !== commentId)
//     post.comments = postComments
//     await post.save()
//     comment
//       .remove()
//       .then(() => {
//         return res.status(200).json({
//           success: true,
//           message: 'Comment deleted successfully!'
//         })
//       })
//       .catch((err) => {
//         console.log(err)
//         return res.status(401).json({
//           success: false,
//           message: 'Something went wrong :('
//         })
//       })
//   } else {
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid credentials'
//     })
//   }
// })

// module.exports = router