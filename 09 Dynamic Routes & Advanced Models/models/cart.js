const fs = require('fs')
const path = require('path')
const rootDir = require('../util/path');

const p = path.join(rootDir, 'data', 'cart.json')


module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Fetch the Previous Cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 }
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id == id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProdcut;
            // Add new product/increase quantity
            if (existingProduct) {
                updatedProdcut = { ...existingProduct };
                updatedProdcut.qty = updatedProdcut.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProdcut;
            } else {
                updatedProdcut = { id: id, qty: 1 }
                cart.products = [...cart.products, updatedProdcut];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            })
        })
    }
}