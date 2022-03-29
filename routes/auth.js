const router = require('express').Router();
const User = require("../models/User");


// Register user
router.post('/register', async (res, req) => {
  const newUser =  await new User({
    username: res.body.username,
    email: res.body.email,
    password: res.body.password,
  });

  try {
    const user = await newUser.save();
    req.status(200).json(user);
  } catch(err) {
    return err;
  }
});

module.exports = router;
