const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
let app = express();
var server = http.createServer(app);
var io = socketIO(server);

var {generateMsg} = require('./utils/message')

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New User connected');

    socket.emit('newMsg', generateMsg('admin', 'Welcome to the chat app'));
    socket.broadcast.emit('newMsg', generateMsg('admin', 'New user has joined!'));

    socket.on('createMessage', (msg, callback) => {
        console.log('NewMsg:', msg);
        io.emit('newMsg', generateMsg(msg.from, msg.text));
        callback('Message Delivered!')
    });

    socket.on('disconnect', (socket) => {
        console.log('User was disconnected!');
    });
});

server.listen(3000, () => {
    console.log('Listening at port 3000');
})

