
var port = process.env.PORT || 3000;
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.send('Hello World!');
});

io.on('connection', function(socket){
  socket.on('message', function(msg){
    console.log('message: ' + msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:3086');
});