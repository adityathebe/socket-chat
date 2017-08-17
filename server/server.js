const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, '../public');
let app = express();
var server = http.createServer(app);
var io = socketIO(server);

var {generateMsg} = require('./utils/message')
var {generateLocationMsg} = require('./utils/message')

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    socket.emit('newMsg', generateMsg('Admin', 'Welcome to the chat app'));
    socket.broadcast.emit('newMsg', generateMsg('Admin', 'New user has joined!'));

    // Listen for New Messages
    socket.on('createMessage', (msg, callback) => {
        io.emit('newMsg', generateMsg(msg.from, msg.text));
        callback();
    });

    // Listen for Location Message Event
    socket.on('createLocationMsg', (coords) => {
        io.emit('newLocationMsg', generateLocationMsg('Admin', coords.lat, coords.lon))
    });

    socket.on('disconnect', (socket) => {
        io.emit('newMsg', generateMsg('Admin', 'User has left!'));
    });
});

server.listen(port, () => {
    console.log(`Listening at port ${port}`);
});