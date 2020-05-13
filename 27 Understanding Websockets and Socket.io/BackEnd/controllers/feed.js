const { validationResult } = require('express-validator/check');
const fs = require('fs');
const path = require('path');
const Post = require('../models/post')
const User = require('../models/user')
const io = require('../socket');

/* exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    console.log(currentPage)
    const perPage = 2;
    try {
        totalItems = await Post.find().countDocuments()

        posts = await Post.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage)

        res.status(200).json({
            message: 'Posts fetched',
            posts,
            totalItems
        })
    } catch (err) { handleError(err, next) }
} */

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
        .catch(err => handleError(err, next))
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
    let creator;
    const post = new Post({
        title,
        content,
        imageUrl,
        creator: req.userId
    })
    console.log('post', post);
    post.save()
        .then(result => {
            return User.findById(req.userId)
        })
        .then(user => {
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then(result => {
            io.getIO().emit('posts', { action: 'create', post: post })
            res.status(201).json({ // Status 201 means that a resource was also created on our side and success
                message: 'Post created successfully',
                post: post,
                creator: { _id: creator._id, name: creator.name }
            })
        })
        .catch(err => handleError(err, next))
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
        .catch(err => handleError(err, next))
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
            if (post.creator.toString() !== req.userId) {
                const err = new Error('Not Authorized');
                err.statusCode = 403;
                throw err;
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
        .catch(err => handleError(err, next))
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    let imageUrl;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                postNotFound();
            }
            if (post.creator.toString() !== req.userId) {
                const err = new Error('Not Authorized');
                err.statusCode = 403;
                throw err;
            }
            imageUrl = post.imageUrl;
            clearImage(imageUrl);
            return post.remove();
        })
        .then(result => {
            return User.findById(req.userId)
        })
        .then(result => {
            user.posts.pull(postId)
            return user.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Post Deleted' })
        })
        .catch(err => handleError(err, next))
}

const handleError = (err, next) => {
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