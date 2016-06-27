var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;

io.on('connection', function(socket){
    console.log('Socketio: user has connected');
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});

module.exports = io;