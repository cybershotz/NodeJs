const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Product', productSchema) // Mongoose.model connects a schema with a name

// const mongoDb = require('mongodb')
// const getDb = require('../util/database').getDb

// class Product {
//     constructor(title, price, description, imageUrl, id, userId) {
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id ? new mongoDb.ObjectID(id) : null;
//         this.userId = userId;
//     }

//     save() {
//         const db = getDb();
//         let dbOp;
//         if (this._id) {
//             dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this })
//         } else {
//             dbOp = db.collection('products').insertOne(this)
//         }
//         return dbOp
//             .then(result => {
//                 console.log(result);
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products')
//             .find() // This returns a cursor
//             .toArray() // This returns all products
//             .then(products => {
//                 console.log(products);
//                 return products;
//             })
//             .catch(err => console.log(err))
//     }

//     static findById(prodId) {
//         const db = getDb();
//         return db.collection('products')
//             .find({ _id: new mongoDb.ObjectID(prodId) }) // This returns a cursor
//             .next() // This gets the first item
//             .then(product => {
//                 console.log(product);
//                 return product;
//             })
//             .catch(err => console.log(err))
//     }
    
//     static deleteById(prodId) {
//         const db = getDb();
//         return db.collection('products')
//             .deleteOne({ _id: new mongoDb.ObjectID(prodId) })
//             .then(() => {
//                 console.log('deleted')
//             })
//             .catch(err => console.log(err))
//     }
// }

// module.exports = Product;