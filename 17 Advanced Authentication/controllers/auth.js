const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user')

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    })
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password')
                return res.redirect('/login')
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err)
                            res.redirect('/');
                        })
                    }
                    req.flash('error', 'Invalid email or password')
                    res.redirect('/login')
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'User already exists')
                return res.redirect('/signup')
            }
            return bcrypt.hash(password, 12)
                .then(hashedPass => {
                    const user = new User({
                        email: email,
                        password: hashedPass,
                        cart: { items: [] }
                    })
                    return user.save()
                })
                .then(result => {
                    res.redirect('/login')
                    return transporter.sendMail({
                        to: email,
                        from: 'shop@node-complete.com',
                        subject: 'Signup Succeeded',
                        html: '<h1>You successfully signed up!</h1>'
                    })
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/')
    });
}


exports.getReset = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    })
}