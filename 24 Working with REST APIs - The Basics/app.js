const express = require('express');
const bodyParser = require('body-parser')

const feedRoute = require('./routes/feed')

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use('/feed', feedRoute);

app.listen(8080);