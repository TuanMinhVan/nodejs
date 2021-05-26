'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

io.on('notify', (data)=> {
  io.emit('notify', {'name':'thông báo'});
  io.broadcast.emit('notify', {'name':'thông báo'});
});

setInterval(() => io.emit('time', new Date().toTimeString()), 5000);