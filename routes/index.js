var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = (req.user !== undefined) ?  req.user : null;
  res.render('index', { title: 'Lazy Student App', user: req.user });

});

router.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});

module.exports = router;
