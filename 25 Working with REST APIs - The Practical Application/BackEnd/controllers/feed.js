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
    const title = req.body.title;
    const content = req.body.content;

    res.status(201).json({ // Status 201 means that a resource was also created on our side and success
        message: 'Post created successfully',
        post: { id: new Date().toISOString(), title, content }
    })
}