const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const User = require('./models/user')

const errorController = require('./controllers/error')

const MONGODB_URI = 'mongodb+srv://ammar:HSDI2cHcKTqdBx4s@cluster0-mylyc.mongodb.net/shop'

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})

app.set('view engine', 'ejs')
app.set('views', 'views') // Load Views from 'views' folder

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.use((req, res, next) => { // On All Incoming Request this gets executed
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404)

mongoose.connect(MONGODB_URI)
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