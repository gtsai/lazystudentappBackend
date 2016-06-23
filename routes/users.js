var express = require('express');
var router = express.Router();

var User = require('../model/user');

router.get('/', function(req, res, next) {
    console.log('ok');
});

router.post('/login', function(req, res) {
  var user = new User(
      {
        email: req.body.email,
        password: req.body.password
      }
  );
  user.save(function (err, user) {
      var params = {
          status: false
      };
      if (err) {
          console.log(err);
      } else {
          if () {
                //use find, find returns an array
              params.status = true;
              res.render('login',params);
          } else {

          }
      }
  });
});

router.post('/register', function(req, res) {
  var user = new User(
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }
  );
  user.save(function (err, user) {
      var params = {
          status: false
      };
    if (err) {
      console.log(err);
    } else {
        params.status = true;
    }
      res.render('register',params);
  });
});

module.exports = router;