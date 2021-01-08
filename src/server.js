const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const htmlDir = process.cwd() + '/html';
let numUsers = 0;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

app.use('/assets', express.static(path.resolve('dist')));

app.get('/admin', (req, res) => {
    res.sendFile(htmlDir + '/admin.html');
});

app.get('/user', (req, res) => {
    res.sendFile(htmlDir + '/user.html');
});

app.get('/example', (req, res) => {
    res.sendFile(htmlDir + '/example.html');
});

io.on('connection', (socket) => {
    ++numUsers;
    console.log('connection %d', numUsers);

    socket.on('sync', (data) => {
        socket.broadcast.emit('sync', {
        username: socket.username,
        message: data
        });
    });

    socket.on('disconnect', () => {
        --numUsers;
        console.log('disconnect %d', numUsers);

        socket.broadcast.emit('user left', {
            username: socket.username,
            numUsers: numUsers
        });
    });
});
