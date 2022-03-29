const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


// Register User
router.post('/register', async (res, req) => {
  try {
    const salt = await bcrypt.getSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser =  await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch(err) {
    res.status(500).json(err);
  }
});

// Login User
router.post('/login', async (res, req) => {
  
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("User not fount.");

    const password = await bcrypt.compare(req.body.password, user.password);
    !password && res.status(400).json("Password not valid.");

    res.status(200).json(user);

  } catch(err) {
    res.status(500).json(err);
  }
});
module.exports = router;
