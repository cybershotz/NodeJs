const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const User = require('../models/user')



exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error('Validation failed, entered data is incorrect');
        err.statusCode = 422; // 422 => Validation Failed
        err.data = errors.array();
        throw err;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email,
                name,
                password: hashedPassword
            });
            return user.save()
        })
        .then(result => {
            res.status(201).json({
                message: 'User Created!',
                userId: result._id
            })
        })
        .catch(err => handleError(err, next))
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email })
        .then(userDoc => {
            if (!userDoc) {
                const err = new Error('User with this email cannot be found.')
                err.statusCode = 401;
                throw err
            }
            loadedUser = userDoc;
            return bcrypt.compare(password, userDoc.password)
        })
        .then(isEqual => {
            if (!isEqual) {
                const err = new Error('Wrong Password.')
                err.statusCode = 401;
                throw err
            }
            const token = JWT.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, 'supersupersecret',
                { expiresIn: '1hr' });
            res.status(200).json({
                token,
                userId: loadedUser._id.toString()
            })
        })
        /* .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        }) */
        .catch(err => handleError(err, next))
}


const handleError = (err, next) => {
    // console.log('err', err)
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err)
}