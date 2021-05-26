'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
const { createGame } = require('./util/words');
const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
  socket.on('notify', (gameId) => {
    createGame().then(words => {
        io.emit('notify', words);
        console.log("Someone is starting a game");
    })
})
});

io.on('notify', function (data) {
  io.emit('notify', data);
  io.broadcast.emit('notify', data);
});

setInterval(() => io.emit('time', new Date().toTimeString()), 5000);