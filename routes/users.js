const router = require('express').Router();
const User = require('../models/User');
const brcypt = require('bcrypt');

// Update

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.user.isAdmin) {
    if(req.body.password) {
      try {
        const salt = await brcypt.genSalt(10);
        req.body.password = await brcypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }

    try {
      const user = User.findByIdAndUpdate(req.params.id, { $set: req.body, });
      res.status(200).json("Account updated");
    } catch (err) {
      return res.status(403).json("Not allowed");
    }
  } else {
    return res.status(403).json("Not allowed");
  }
});

module.exports = router;
