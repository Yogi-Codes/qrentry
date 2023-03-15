const express = require('express');
const app = express();
const cors = require('cors');
const db = require("./models/index.model");

var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

db.sequelize.sync({force: true}).then(() => {
    console.log("Connected");
}).catch((err) => {
    console.log("Error");
});

require('./routes/ticket.routes')(app);
 
app.listen(8080, () => {
    console.log("Server is Running!");
});