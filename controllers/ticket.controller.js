const db = require('../models/index.model');
const encryption = require('../services/token_encryption');
const qr = require('qr-image');
const fs= require('fs');
const archiver = require('archiver');
const path = require('path');

const Ticket = db.ticket;

exports.createQr = async (req, res) => {
    let dateTime = new Date();
    fs.mkdir('static/qrcode', {
        recursive: true
    }, (err) => {
        if (err) {
            res.status(500).send({result: "Something went wrong!"});
            console.log(err);
        } else {
            fs.mkdir('static/'+dateTime.getTime()+'-' + dateTime.getDate()+'.png', {
                recursive: true
            }, async (err) => {
                if (err) {
                    return res.status(500).send({result: "Something went wrong!"});
                }
                await Ticket.create({}).then((ticket) => {
                console.log(ticket.toJSON());
                if (!ticket) {
                    return res.status(500).send({
                        result: "Something went wrong!"
                    });
                }
                let path = 'static/qrcode/'+ticket.id+'.png';
                const qrImage = qr.imageSync(ticket.id, {
                    type: 'png'
                });
                fs.writeFileSync(path, qrImage);
                return res.status(200).send({
                    path: path
                });
                });
            });
        }
    });
}

exports.createMultipleQr = async (req, res) => {
    try {
        const count = req.params.count;
        fs.mkdir('static/qrcode', {
            recursive: true
        }, (err) => {
            if (err) {
                return res.status(500).send({
                    result: "Something went wrong"
                });
            }
            let date = new Date();
            let zippath = 'static/' + date.getTime() + '-' + date.getUTCDate();
            fs.mkdir(zippath, {
                recursive: true
            }, async err => {
                if (err) {
                    return res.status(500).send({
                        result: "Something went wrong!"
                    });
                }
                let tickets = [];
                for (let i = 0; i < count; i++) {
                    await Ticket.create({}).then((ticket) => {
                        let path = 'static/qrcode/'+ticket.id+'.png';
                        const qrImage = qr.imageSync(ticket.id, {
                            type: 'png'
                        });
                        fs.writeFileSync(zippath+'/'+ticket.id+'.png', qrImage);
                        fs.writeFileSync(path, qrImage);
                        tickets.push({
                            path: path
                        });
                    });
                }
                const output = fs.createWriteStream(zippath+'/output.zip');

                const archive = archiver('zip', {
                    zlib: {
                        level: 9
                    }
                });
                archive.pipe(output);
                archive.directory(zippath, false);
                archive.finalize();
                output.on('close', () => {
                    res.sendFile(zippath+'/output.zip', {
                        root: path.join(__dirname, '..')
                    });
                });
                archive.on('error', (err) => {
                    res.status(500).send({
                        result: "Something went wrong!"
                    });
                });
                
            });
                
        });
        } catch {
            return res.status(500).send({
                result: "Something went wrong!"
            });
        }
}

exports.approveEntry = async  (req, res) => {
    const id = req.body.token;
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