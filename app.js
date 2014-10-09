var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'),
    fs = require('fs');

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {
    socket.on('nouveau_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.set('pseudo', pseudo);
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    socket.on('message', function (message) {
        socket.get('pseudo', function (error, pseudo) {
            message = ent.encode(message);
            socket.broadcast.emit('message', {pseudo: pseudo, message: message});
        });
    });
});

server.listen(8080);
