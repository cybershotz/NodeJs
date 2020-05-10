const express = require('express')
const authController = require('../controllers/auth')
const { check, body } = require('express-validator/check')

const router = express.Router();

router.get('/login', authController.getLogin)

router.get('/signup', authController.getSignup)

router.post('/login', authController.postLogin)

router.post('/signup',
    check('email') // Check looks for the field in headers, cookies, body, param etc
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => { // Custom Validation
            if (value == 'test@test.com') {
                throw new Error('This email is forbidden')
            }
            return true; // Else return true
        }),
    body('password', 'Please enter a password with only numbers and text and atlease 5 characters.')
        .isLength(6).isAlphanumeric(),
    authController.postSignup)

router.post('/logout', authController.postLogout)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router;