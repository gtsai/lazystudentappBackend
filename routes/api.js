var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lazyapp');

var Card = mongoose.model('cards',
    {
        title: String,
        body: String,
        tags: [String],
        images: [String],
        author: String,
        createdAt: {type:Date, default: Date.now}
    }
);

router.get('/', function(req, res) {
    Card.find({}, function (err, cards) {
        console.log(err);
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
            author: "Author"
        }
    );
    card.save(function (err, card) {
        console.log(err);
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
        console.log(req.body)
        console.log(card)
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
            console.log('done');
            res.end()
        }
    });
});

module.exports = router;