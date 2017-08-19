const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

let app = express();
var server = http.createServer(app);
var io = socketIO(server);
const port = process.env.PORT || 3000;

var {generateMsg} = require('./utils/message')
var {generateLocationMsg} = require('./utils/message')

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
    socket.emit('newMsg', generateMsg('Admin', 'Welcome ...'));
    socket.broadcast.emit('newMsg', generateMsg('Admin', 'New user has joined!'));

    // Listen for New Messages
    socket.on('createMessage', (msg, callback) => {
        io.emit('newMsg', generateMsg(msg.from, msg.text));
        callback();
    });

    // Listen for Location Message Event
    socket.on('createLocationMsg', (coords) => {
        io.emit('newLocationMsg', generateLocationMsg('User', coords.lat, coords.lon))
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('newMsg', generateMsg('Admin', 'User has left!'));
    });
});

server.listen(port, () => {
    console.log(`Listening at port ${port}`);
});