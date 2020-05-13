const { validationResult } = require('express-validator/check');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error('Validation failed, entered data is incorrect');
        err.statusCode = 422; // 422 => Validation Failed
        error.data= errors.array();
        throw err;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
}