var express = require('express');
var router = express.Router();

var Card = require('../model/card');

router.get('/', function(req, res) {
    Card.find({}, function (err, cards) {
        if (err) {
            console.log(err);
        } else {
            console.log('done');
            res.json({
                data: cards
            })
        }
    });
});

router.post('/', function(req, res) {
    var card = new Card(
        {
            title: req.body.title,
            body: req.body.body,
            tags: req.body.tags,
            images: [],
            author: {
                id: req.user._id,
                name: req.user.name
            }
        }
    );
    card.save(function (err, card) {
        if (err) {
            console.log(err);
        } else {
            console.log('done');
            res.json({
                data: card
            })
        }
    });
});

router.patch('/:id', function(req, res) {
    Card.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, card) {
        if (err) {
            console.log(err);
        } else {
            console.log('done');
            res.json({
                data: card
            })
        }
    });
});


router.delete('/:id', function(req, res) {
    Card.findByIdAndRemove(req.params.id, function (err, cards) {
        if (err) {
            console.log(err);
        } else {
            res.end()
        }
    });
});

module.exports = router;