const PORT = 5000;
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http);
app.get('/', (req, res) => {
    res.send("Node Server is running. Yay!!")
})
io.on('connection', socket => {
    chatID = socket.handshake.query.chatID
    socket.join(chatID)
    socket.on('disconnect', () => {
        socket.leave(chatID)
    })
    socket.on('send_message', message => {
        receiverChatID = message.receiverChatID
        senderChatID = message.senderChatID
        content = message.content
        socket.in(receiverChatID).emit('receive_message', {
            'content': content,
            'senderChatID': senderChatID,
            'receiverChatID':receiverChatID,
        })
    })
});
http.listen(PORT)