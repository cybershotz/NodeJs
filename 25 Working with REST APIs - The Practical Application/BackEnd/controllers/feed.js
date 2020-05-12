const { validationResult } = require('express-validator/check');
const Post = require('../models/post')

exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => {
            res.status(200).json({
                message: 'Posts fetched',
                posts
            })
        })
        .catch(handleError)
}

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error('Validation failed, entered data is incorrect');
        err.statusCode = 422; // 422 => Validation Failed
        throw err;
    }
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title,
        content,
        imageUrl: 'images/VirtualBox_Ubuntu.png',
        creator: {
            name: 'Ammar'
        }
    })
    post.save()
        .then(result => {
            res.status(201).json({ // Status 201 means that a resource was also created on our side and success
                message: 'Post created successfully',
                post: result
            })
        })
        .catch(handleError)
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'Post fetched.', post })
        })
        .catch(handleError)
}

const handleError = (err) => {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err)
}