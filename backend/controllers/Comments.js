const express = require('express');

const Comment = require('../models/Comment');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        res.json({ message: err });
    }
});

router.post('/', async (req, res) => {
    const comment = new Comment({
        content: req.body.content,
        name: req.body.name,
        rating: req.body.rating
    });

    try {
        const savedComment = await comment.save();
        res.json(savedComment);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;
