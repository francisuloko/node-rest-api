const router = require('express').Router();

router.get('/', (res, req) => {
  res.send('Users page');
});

module.exports = router;
