const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
const mongoConnect = require('./util/database').mongoConnect;

const errorController = require('./controllers/error')

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'views') // Load Views from 'views' folder

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => { // On All Incoming Request this gets executed
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user; // Add a Sequelize Use object to request for upcoming middlewares 
    //         next();
    //     })
    //     .catch(err => console.log(err))
    next();
})

app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404)

mongoConnect(() => {
    app.listen(3000);
})