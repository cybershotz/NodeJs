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
        const cartProductIndex = this.cart.items.findIndex(cp => {
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
        return db.collection('users')
            .updateOne(
                { _id: new ObjectID(this._id) },
                { $set: { cart: updatedCart } }
            )
    }

    getCart() {
        // return this.cart;
        const db = getDb();
        const productIds = this.cart.items.map(p => p.productId);
        console.log('productIds', productIds);

        return db.collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                console.log('prod', products);
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity
                    }
                })
            })
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => item.productId.toString() != productId.toString());
        const db = getDb();
        return db.collection('users')
            .updateOne(
                { _id: new ObjectID(this._id) },
                { $set: { cart: { items: updatedCartItems } } }
            )
    }

    addOrder() {
        const db = getDb();
        return this.getCart().then(products => {
            const order = {
                items: products,
                user: {
                    _id: this._id,
                    name: this.name
                }
            }
            return db.collection('orders')
                .insertOne(order)
        })
            .then(result => {
                this.cart.items = [];
                return db.collection('users')
                    .updateOne(
                        { _id: new ObjectID(this._id) },
                        { $set: { cart: { items: [] } } }
                    )
            })
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new mongoDb.ObjectID(userId) })
    }
}

module.exports = User;