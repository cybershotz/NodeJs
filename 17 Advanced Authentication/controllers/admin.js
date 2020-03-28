const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.postAddProduct = (req, res, next) => {
    // console.log(req.body);
    title = req.body.title;
    imageUrl = req.body.imageUrl;
    description = req.body.description;
    price = req.body.price;
    const product = new Product({ title, price, description, imageUrl, userId: req.user }); // req.user will extract _id
    product.save()
        .then(() => {
            res.redirect('/admin/products')
        }).catch(err => {
            console.log(err)
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
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    Product.findById(prodId)
        .then(product => {

            product.title = title;
            product.imageUrl = imageUrl;
            product.description = description;
            product.price = price;
            return product.save()
        })
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))
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
            console.log('err');
        })
}