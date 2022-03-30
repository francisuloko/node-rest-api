/* eslint-disable no-underscore-dangle */
const router = require('express').Router();
const brcypt = require('bcrypt');
const User = require('../models/User');

// Update

router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await brcypt.genSalt(10);
        req.body.password = await brcypt.hash(req.body.password, salt);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    try {
      await User.findByIdAndUpdate(req.params.id, { $set: req.body });
      res.status(200).json('Account updated');
    } catch (err) {
      res.status(403).json('Not allowed');
    }
  } else {
    res.status(403).json('Not allowed');
  }
});

// Delete

router.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('Account deleted');
    } catch (err) {
      res.status(403).json('Not allowed');
    }
  } else {
    res.status(403).json('Not allowed');
  }
});

// Get

router.get('/:id', async (req, res) => {
  try {
    const user = User.findById(req.params.id);
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Follow

router.put('/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json('Now following user.');
      } else {
        res.status(403).json('Already following user.');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Can't follow self.");
  }
});

// Unfollow

router.put('/:id/unfollow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json('You unfollowed user.');
      } else {
        res.status(403).json('You are not following');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Can't unfollow self.");
  }
});

module.exports = router;
