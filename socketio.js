var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;

var Message = require('./model/message');

app.get('/', function(req, res){
    res.sendfile('index.ejs');
});

app.post('/', function(req,res){
    var message = new Message(
        {
            author: {
                id: req.user._id,
                name: req.user.name
            },
            message: req.body.message
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

io.on('connection', function(socket){
    console.log('Socketio: user has connected');
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});

module.exports = io;