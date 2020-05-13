const express = require('express');
const auth = require('../middleware/is-auth')
const { body } = require('express-validator/check');

const feedController = require('../controllers/feed')

const router = express.Router();

router.get('/posts', auth, feedController.getPosts);

router.post('/post', [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 }),
], auth, feedController.createPost);

router.get('/post/:postId', auth, feedController.getPost);

router.put('/post/:postId', [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 }),
], auth, feedController.updatePost);

router.delete('/post/:postId', feedController.deletePost);

module.exports = router;