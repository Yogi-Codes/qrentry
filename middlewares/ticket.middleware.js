exports.isAdmin = async (req, res, next) => {
    if (req.body.username === undefined) {
        return res.status(400).send({
            result: "Username Required"
        });
    }
    if (req.body.username === undefined) {
        return res.status(400).send({
            result: "Username Required"
        });
    }
    if (req.body.username !== "bhadwa" || 
      req.body.password !== "bhsdiwala") {
        return res.status(400).send({
            result: "Wrong credentials"
        });
    }
    next();
}

exports.isBouncer = async (req, res, next) => {
    if (req.headers.x_access_token === undefined ||
        req.headers.x_access_token !== 'sxyprn') {
        return res.status(400).send({
            result: "Wrong credentials"
        });
    }
    next();
}