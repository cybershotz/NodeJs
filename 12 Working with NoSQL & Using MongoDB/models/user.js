const mongoDb = require('mongodb')
const getDb = require('../util/database').getDb;
const ObjectID = mongoDb.ObjectID;
class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {
        console.log('prodID', this._id)
        const cartProductIndex = this.cart.items.findIndex(cp => {
            console.log('cp', cp)
            return cp.productId.toString() === product._id.toString()
        })
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({ productId: new ObjectID(product._id), quantity: 1 })
        }
        const updatedCart = { items: updatedCartItems }
        const db = getDb();
        db.collection('users')
            .updateOne(
                { _id: new ObjectID(this._id) },
                { $set: { cart: updatedCart } }
            )
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new mongoDb.ObjectID(userId) })
    }
}

module.exports = User;