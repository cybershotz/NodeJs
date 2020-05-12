const { validationResult } = require('express-validator/check');
const Post = require('../models/post')

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                _id: '1',
                title: 'First Post',
                content: 'This is the first post!',
                imageUrl: 'images/VirtualBox_Ubuntu.png',
                creator: {
                    name: 'Ammar'
                },
                createdAt: new Date()
            }
        ]
    })
}

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422) // 422 => Validation Failed
            .json({
                message: 'Validation failed, entered data is incorrect',
                errors: errors.array()
            })
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
        .catch(err => console.log(err))
}