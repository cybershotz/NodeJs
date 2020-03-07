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
        const updatedCart = { items: [{ productId: new ObjectID(product._id), quantity: 1 }] }
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