const { validationResult } = require('express-validator/check');
const fs = require('fs');
const path = require('path');
const Post = require('../models/post')

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    console.log(currentPage)
    const perPage = 2;
    let totalItems;
    Post.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
        })
        .then(posts => {
            res.status(200).json({
                message: 'Posts fetched',
                posts,
                totalItems
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
    if (!req.file) {
        const err = new Error('No image provided');
        err.statusCode = 422;
        throw err;
    }
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path;
    const post = new Post({
        title,
        content,
        imageUrl,
        creator: {
            name: 'Ammar'
        }
    })
    console.log('post', post);
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
                postNotFound()
            }
            res.status(200).json({ message: 'Post fetched.', post })
        })
        .catch(handleError)
}

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    console.log('postId', postId)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error('Validation failed, entered data is incorrect');
        err.statusCode = 422; // 422 => Validation Failed
        throw err;
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    console.log(req.body)
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const err = new Error('No image provided');
        err.statusCode = 422;
        throw err;
    }

    Post.findById(postId)
        .then(post => {
            if (!post) {
                postNotFound()
            }
            if (imageUrl != post.imageUrl) {
                clearImage(imageUrl);
            }
            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;
            return post.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Post updated', post: result })
        })
        .catch(handleError)
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    let imageUrl;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                postNotFound();
            }
            imageUrl = post.imageUrl;
            return post.remove();
        })
        .then(result => {
            clearImage(imageUrl);
            res.status(200).json({ message: 'Post Deleted' })
        })
        .catch(handleError)
}

const handleError = (err) => {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err)
}

const clearImage = imagePath => {
    filePath = path.join(__dirname, '..', imagePath);
    fs.unlink(filePath, err => console.log(err));
}

const postNotFound = () => {
    const error = new Error('Could not find post.');
    error.statusCode = 404;
    throw error;
}