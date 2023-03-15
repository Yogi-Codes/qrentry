const db = require('../models/index.model');
const encryption = require('../services/token_encryption');
const qr = require('qr-image');
const fs= require('fs');

const Ticket = db.ticket;

exports.createQr = async (req, res) => {
    await Ticket.create({}).then((ticket) => {
        console.log(ticket.toJSON());
        if (!ticket) {
            return res.status(500).send({
                result: "Something went wrong!"
            });
        }
        let path = './static/qrcode/'+ticket.id+'.png';
        const qrImage = qr.imageSync(ticket.id, {
            type: 'png'
        });
        fs.writeFileSync(path, qrImage);
        return res.status(200).send({
            path: path
        });
    });
}

exports.createMultipleQr = async (req, res) => {
    try {
        const count = req.params.count;
        let tickets = [];
        for (let i = 0; i < count; i++) {
            await Ticket.create({}).then((ticket) => {
                let path = './static/qrcode/'+ticket.id+'.png';
                const qrImage = qr.imageSync(ticket.id, {
                    type: 'png'
                });
                fs.writeFileSync(path, qrImage);
                tickets.push({
                    path: path
                });
            });
        }
        res.status(200).send({
            result: "Successfully generated",
            tickets: tickets
        });
    } catch {
        return res.status(500).send({
            result: "Something went wrong!"
        });
    }
   
}

exports.approveEntry = async  (req, res) => {
    const id = req.body.token;
    console.log('lllllllllllkkk-------------lllllllllll---------');
    await Ticket.findOne({
        where: {
            id: id
        }
    }).then(async (ticket) => {
        if (!ticket) {
            return res.status(400).send({
                result: "Invalid Token"
            });
        }
        if (ticket.visited) {
            return res.status(400).send({
                result: "Entry already accessed!"
            });
        }
        ticket.visited = true;
        await ticket.save().then((ticket) => {
            return res.status(200).send({
                result: "Ticket Approved!"
            });
        });
    });
}

exports.getAllTickets = async (req, res) => {
    await Ticket.findAll({}).then((tickets) => {
        return res.status(200).send({
            tickets: tickets
        });
    })
}

exports.getTicketById = async (req, res) => {
    if (req.params.id == undefined) {
        return res.status(400).send({
            result: "Bad request"
        });
    }
    await Ticket.findOne({
        where: {
            id: req.params.id
        }
    }).then((ticket) => {
        if (!ticket) {
            return res.status(400).send({
                result: "Invalid Id"
            });
        }
        return res.status(ticket).send({
            ticket: ticket.toJSON()
        });
    })
}