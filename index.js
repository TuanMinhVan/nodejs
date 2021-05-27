'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
var users = [];
const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
  socket.on('notify',(data)=>{
    socket.broadcast.emit('notify',data);
  });
  socket.on('join',  (userId) => {
    socket.nickname = userId;
    users.push(userId);
    socket.emit('join',users);
 });
  socket.on('call',(data) => {
    socket.broadcast.emit('call',data);
  });
  socket.on('endCall',(data) => {
    socket.broadcast.emit('endCall',data);
  });
  socket.on('unCall',(data) => {
    socket.broadcast.emit('unCall',data);
  });
  socket.on('acceptCall',(data) => {
    socket.broadcast.emit('acceptCall',data);
  });
  socket.on('disconnect',()=>{
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (user === socket.nickname) {
            users.splice(i, 1);
        }
    }
  });
});
setInterval(() => io.emit('time', new Date().toTimeString()), 5000);