const router = require('express').Router();

router.get("/", (res, req) => {
  req.send("Auth page.");
});

module.exports = router;
