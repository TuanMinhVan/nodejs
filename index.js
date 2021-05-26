const express = require('express');
const socketIO = require('socket.io');
const httpServer = require('http').createServer(express);
const PORT = process.env.PORT || 3000;

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));    

const io = socketIO(server, {
    cors: true,
    origins: ["*"]
});
const INDEX = '/index.html';
const { createGame } = require('./util/words');

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on('notify', (gameId) => {
        createGame().then(words => {
            io.emit('notify', words);
            console.log("Someone is starting a game");
        })
    })

    socket.on('gameUpdate', ({ gameId, words }) => {
        io.to(gameId).emit(gameId, words);
    })

    socket.on('joinGame', ({ gameId }) => {
        socket.join(gameId);
        console.log("a player joined the room " + gameId);
        socket.to(gameId).emit('joinGame', "A player joined the game!");
    })
});

// httpServer.listen(PORT, () => console.log('Server is running on port ' + PORT));
setInterval(() => io.emit('time', new Date().toTimeString()), 5000);