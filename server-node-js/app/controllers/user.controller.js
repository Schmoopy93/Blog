const db = require("../models");
const User = db.user;

// exports.findOne = (req, res) => {
//   const id = req.params.id;

//   User.update(req.body, {
//     where: { id: id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "User was updated successfully."
//         });
//       } else {
//         res.send({
//           message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error updating User with id=" + id
//       });
//     });
// };

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      res.send(data);
      console.log(data, "dataaaaaaaa")
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Post with id=" + id
      });
    });
};


exports.verifyToken = (req, res) => {
  const token = req.params.token;
  const id = req.params.id;
  const user = this.findOne(id); 

  if (!id) {
    return 'Invalid id';
  }
  if (!user) {
    return 'no user found'
  }



  console.log(token, 'token u verifyToken');
  User.update({
    isVerified: true
  })
    .then(data => {
      console.log(data, 'dataaaa');
      res.send(data);
    })
    .catch(err => {
      log(err, 'error budjavi')
      res.status(500).send({
        message:err
      });
    });
};
