const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
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
        .catch(handleError)
}

exports.signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(userDoc => {
            if (!userDoc) {
                const err = new Error('User with this email cannot be found.')
                err.statusCode = 401;
                throw err
            }
            return bcrypt.compare(password, userDoc.password)
        })
        .then(isEqual => {
            if (!isEqual) {
                const err = new Error('Wrong Password.')
                err.statusCode = 401;
                throw err
            }
        })
        .catch(handleError)
}

const handleError = (err) => {
    console.log('err', err)
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err)
}