const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


// Register user
router.post('/register', async (res, req) => {
  try {
    const salt = await bcrypt.getSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser =  await new User({
      username: res.body.username,
      email: res.body.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    req.status(200).json(user);
  } catch(err) {
    return err;
  }
});

module.exports = router;
