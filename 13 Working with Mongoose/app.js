const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user')

const errorController = require('./controllers/error')

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'views') // Load Views from 'views' folder

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => { // On All Incoming Request this gets executed
    User.findById("5e78f883e8ebc83348f43281")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404)

mongoose.connect('mongodb+srv://ammar:HSDI2cHcKTqdBx4s@cluster0-mylyc.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        // User.findOne(user => {
        //     if (!user) {
        //         const newUser = new User({
        //             name: 'Ammar',
        //             email: 'ammar@test.com',
        //             cart: {
        //                 items: []
        //             }
        //         })
        //         newUser.save();
        //     }
        // })
        app.listen(3000);
    })
    .catch(err => console.log(err))