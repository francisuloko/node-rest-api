const router = require('express').Router();
const Post = require('../models/Post');

// Create
router.post('/', async (req, res) => {
  const newPost = new Post(req.body);

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json('Updated successfully.');
    } else {
      res.status(403).json('Not allowed.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
