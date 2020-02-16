const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const db = require('./util/database')

const errorController = require('./controllers/error')

const app = express();


app.set('view engine', 'ejs')
app.set('views', 'views') // Load Views from 'views' folder

db.execute('SELECT * FROM products')
    .then(result => {
        console.log('result', result);
    })
    .catch(err => {
        console.log('err', err);
    })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404)

app.listen(3000);