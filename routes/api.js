var express = require('express');
var router = express.Router();
var io = require('../socketio');


var Card = require('../model/card');
var Message = require('../model/message');

router.get('/', function(req, res) {
    Card.find({}, function (err, cards) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                data: cards
            })
        }
    });
});

router.get('/messages', function(req, res) {
    Message.find({}, function (err, messages) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                data: messages
            })
        }
    });
});

router.post('/messages', function(req,res){
    var message = new Message(
        {
            author: {
                id: req.user._id,
                name: req.user.name
            },
            message: req.body.body
        }
    );
    message.save(function (err, message) {
        if (err) {
            console.log(err);
        } else {
            console.log('done');
            io.emit('new_chat_message',message);
        }
    });
    res.end();
});


// router.get('/search', function(req, res) {
//     console.log('got here');
//     Card.textSearch(req.query.query, function (err, output) {
//         console.log(req.query.query);
//         console.log(output);
//         if (err) {
//             console.log(err);
//         } else {
//             console.log('hi');
//             console.log(output);
//             console.log('hi');
//         }
//     });
// });

router.get('/search', function(req, res) {
    Card.find({$text: {$search: req.query.title }}, function (err, output) {
        if (err) {
            console.log(err);
        } else {
            console.log('search results below:');
            var searchResults = output;
            // res.render('results');
            res.json({
                data: searchResults
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