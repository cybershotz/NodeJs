const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const sequelize = require('./util/database')
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const errorController = require('./controllers/error')

const app = express();


app.set('view engine', 'ejs')
app.set('views', 'views') // Load Views from 'views' folder

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => { // On All Incoming Request this gets executed
    User.findByPk(1)
        .then(user => {
            req.user = user; // Add a Sequelize Use object to request for upcoming middlewares 
            next();
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404)

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

sequelize
    // .sync({ force: true })
    .sync()
    .then(result => {
        // console.log(result)
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({name: 'Ammar', email: 'ammar4568@gmail.com'})
        }
        // return Promise.resolve(user)
        return user; // Resolves to Promise inside a then block
    })
    .then(user => {
        return user.createCart()
        // console.log(user)
    })
    .then(cart => { 
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    })
// It creates models with database tables by creating the appropriate tables
// and if you have them create relations.
