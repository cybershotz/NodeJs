const mongoDb = require('mongodb')
const getDb = require('../util/database').getDb

class Product {
    constructor(title, price, description, imageUrl, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = new mongoDb.ObjectID(id);
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this })
        } else {
            dbOp = db.collection('products').insertOne(this)
        }
        return dbOp
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            })
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
            .find() // This returns a cursor
            .toArray() // This returns all products
            .then(products => {
                console.log(products);
                return products;
            })
            .catch(err => console.log(err))
    }

    static findById(prodId) {
        const db = getDb();
        return db.collection('products')
            .find({ _id: new mongoDb.ObjectID(prodId) }) // This returns a cursor
            .next() // This gets the first item
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => console.log(err))
    }
    
    static deleteById(prodId) {
        const db = getDb();
        return db.collection('products')
            .deleteOne({ _id: new mongoDb.ObjectID(prodId) })
            .then(() => {
                console.log('deleted')
            })
            .catch(err => console.log(err))
    }
}

module.exports = Product;