var express = require('express');
var router = express.Router();

var User = require('../model/user');

router.get('/', function(req, res) {
    User.find({}, function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                data: users
            })
        }
    });
});

router.post('/login', function(req, res) {
    var params = {
          status: false
    };
    console.log(req.body);
    User.find({email: req.body.email}, function (err, users) {
        if (err) {
            console.log(err);
        } else {
            console.log('done');
            console.log(users);
            if (users == []){
                console.log('Email does not exist.Please login again.');
            }
            for (var object in users) {
                if (users[object].password == req.body.password) {
                    params.status = true;
                    res.render('login',params);
                } else {
                    console.log('Incorrect password: Please try again.');
                }
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

router.delete('/:id', function(req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            console.log('done');
            res.end()
        }
    });
});


module.exports = router;