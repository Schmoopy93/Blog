const req = require("express/lib/request");
const db = require("../models");
const Appointment = db.appointment;
const Op = db.Sequelize.Op;

exports.createAppointment = (req, res) => {
    return Appointment.create({
            title: req.body.title,
            userId: req.body.userId,
            start: req.body.start
        })
        .then((appointment) => {
            console.log(">> Created appointment: " + JSON.stringify(appointment, null, 4));
            return appointment;
        })
        .catch((err) => {
            console.log(">> Error while creating appointment: ", err);
        });
};

exports.findAll = (req, res) => {
    const userId = req.query.postId;
    var condition = userId ? {
        userId: {
            [Op.like]: `%${userId}%`
        }
    } : null;

    Appointment.findAll({ where: condition, include: db.user })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving posts."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Appointment.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Appointment with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Appointment.destroy({
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Appointment was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Appointment with id=${id}. Maybe Appointment was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Appointment with id=" + id
            });
        });
};

exports.updateAppointment = async(req, res) => {
    const appointmentId = req.params.id;
    const newData = req.body;
    try {
        const updateResult = await Appointment.update(newData, {
            where: { id: appointmentId }
        });

        if (updateResult[0] === 0) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        return res.status(200).json({ success: true, message: 'Appointment updated successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};