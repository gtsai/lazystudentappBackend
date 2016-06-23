var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lazyapp');

var User = mongoose.model('users',
    {
      name: String,
      email: String,
      password: String
    }
);

router.get('/', function(req, res) {
  User.find({}, function (err, users) {
    console.log(err);
    if (err) {
      console.log(err);
    } else {
      console.log('done');
      res.json({
        data: users
      })
    }
  });
});

router.post('/', function(req, res) {
  var user = new User(
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      }
  );
  user.save(function (err, user) {
    console.log(err);
    if (err) {
      console.log(err);
    } else {
      console.log('done');
      res.json({
        data: user
      })
    }
  });
});

module.exports = router;
