const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

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

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json('Delete successfully.');
    } else {
      res.status(403).json('Not allowed.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Like
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.params.userId } });
      res.status(200).json('Post liked.');
    } else {
      await post.updateOne({ $pull: { likes: req.params.userId } });
      res.status(200).json('Unliked post.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Show

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Timeline

router.get('/timeline/all', async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser.id });
    const friendsPost = await Promise.all(
      currentUser.followings.map((friendId) => Post.find({ userId: friendId })),
    );

    res.json(userPosts.concat(...friendsPost));
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
