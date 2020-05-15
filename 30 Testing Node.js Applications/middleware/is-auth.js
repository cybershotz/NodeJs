const JWT = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authorizationHeader = req.get('Authorization')
    if (!authorizationHeader) {
        const err = new Error('Not Authenticated!');
        err.statusCode = 401;
        throw err
    }

    const token = authorizationHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = JWT.verify(token, 'supersupersecret');
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not Authenticated!');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();

}