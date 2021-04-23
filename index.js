var http = require('http');
var socketIO = require('socket.io');
var port =  process.env.PORT || 3000;;
var users = [];
var server = http.createServer().listen(port, function () {
    console.log('Kết nối với server với port: ' + port);
});
const io =  socketIO(server);
// io = socketIO.listen(server);
io.sockets.on('connection', function (socket) {
    socket.on('checkonline', function (user) {
        socket.nickname = user.idUser;
        socket.id = user.idUser;
        users.push(user);
        console.log(user.tenUser + ' đã online.');
        updateNickNames();
    });
    socket.on('comment', function (data) {
        socket.emit('comment', data);
        socket.broadcast.emit('comment', data);
    });
    socket.on('disconnection', function (data) {
        socket.broadcast.emit('info', '............................');
    });

    socket.on('new_event', function (data) {
        socket.broadcast.emit('new_event', data);
        socket.emit('new_event', data);
    });
    function updateNickNames() {
        io.sockets.emit('checkonline', users);
    }
    ;
    socket.on('disconnect', function (data) {
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            if (user.idUser === socket.nickname) {
                users.splice(i, 1);
            }
        }
        updateNickNames();
    });

});
