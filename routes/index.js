var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('hello');
  console.log(req.user);
  console.log('hello');

  res.render('index', { title: 'Lazy Student App', user: req.user.name });

});

module.exports = router;
