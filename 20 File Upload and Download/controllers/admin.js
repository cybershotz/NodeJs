const Product = require('../models/product')
const { validationResult } = require('express-validator/check')

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    })
}

exports.postAddProduct = (req, res, next) => {
    // console.log(req.body);
    title = req.body.title;
    imageUrl = req.file;
    description = req.body.description;
    price = req.body.price;
    console.log('imageUrl', imageUrl)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422)
            .render('admin/edit-product', {
                path: '/admin/add-product',
                pageTitle: 'Add Product',
                editing: false,
                hasError: true,
                errorMessage: errors.array()[0].msg,
                product: {
                    title,
                    imageUrl,
                    description,
                    price
                },
                validationErrors: errors.array()
            })
    }

    const product = new Product({ title, price, description, imageUrl, userId: req.user }); // req.user will extract _id
    product.save()
        .then(() => {
            res.redirect('/admin/products')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/')
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                errorMessage: null,
                validationErrors: []
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422)
            .render('admin/edit-product', {
                path: '/admin/add-product',
                pageTitle: 'Add Product',
                editing: true,
                hasError: true,
                errorMessage: errors.array()[0].msg,
                product: {
                    title,
                    imageUrl,
                    description,
                    price,
                    _id: prodId
                },
                validationErrors: errors.array(),
            })
    }

    Product.findById(prodId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/')
            }
            product.title = title;
            product.imageUrl = imageUrl;
            product.description = description;
            product.price = price;
            return product.save()
                .then(result => {
                    res.redirect('/admin/products')
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteOne({ _id: prodId, userId: req.user._id })
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        // .select('name title -_id') // only selects name, title and remove _id
        // .populate('userId') // populates user data 
        .then(products => {
            console.log(products);
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}