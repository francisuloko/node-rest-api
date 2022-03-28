const router = require('express').Router();

router.get('/', (res, req) => {
  req.send('Users page');
});

module.exports = router;
