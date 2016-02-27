/**
 * Created by qoder on 16-2-25.
 */

var io = require('socket.io');
module.exports = function (server) {
    var socket = io.listen(server);
    socket.on('connection', function (socket) {
        socket.emit("sayHello", {hello: '欢迎来到Qoder聊天室'});
        socket.on('chatMsg', function (data) {
            socket.emit('chatMsgRes', data);
            socket.broadcast.emit('allusersSay', data);
        });
        socket.broadcast.emit('joinusers', {username: "haha"});
        socket.on('bigEmoji', function (data) {
            console.log(data);
            socket.broadcast.emit('sendBigEmoji', data);
        });
        socket.on('disconnect', function () {
            socket.broadcast.emit('usersleave', {username: "haha"});
            console.log('用户已经离开');
        });
        socket.on('shakewindow', function (data) {
            socket.broadcast.emit('shakewindow', data);
        });
    });
}