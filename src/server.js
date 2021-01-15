const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const htmlDir = process.cwd() + '/html';
let numUsers = 0;
const sessions = [];

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
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


app.get('/sessions', (req, res) => {
    res.send({sessions});
});

io.on('connection', (socket) => {
    let sessionId = socket.handshake.query.sessionId;
    console.log('connection %d', numUsers, socket.handshake.query.sessionId);

    if (sessionId && !sessions.find(s => s === sessionId)) {
        console.log('disconnect');
        socket.disconnect();
        return;
    }

    ++numUsers;

    if (!sessionId) {
        sessionId = Math.floor(Math.random() * 100000).toString();
        sessions.push(sessionId);
        console.log('new session', sessionId);
    }
    
    socket.join(sessionId);

    socket.on('ready', () => {
        socket.to(sessionId).emit('start');
    });

    socket.on('sync', (data) => {
        // socket.broadcast.emit('sync', {
        socket.to(sessionId).emit('sync', {
            // username: socket.username,
            message: data
        });
    });

    socket.on('disconnect', () => {
        --numUsers;
        console.log('disconnect %d', numUsers);

        // socket.broadcast.emit('user left', {
        //     username: socket.username,
        //     numUsers: numUsers
        // });
    });
});
