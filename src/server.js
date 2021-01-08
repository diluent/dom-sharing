const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

// app.use(express.static(path.join(__dirname, 'public')));

let numUsers = 0;

io.on('connection', (socket) => {
    console.log('on connection')
  let addedUser = false;

  socket.on('sync', (data) => {
    socket.broadcast.emit('sync', {
      username: socket.username,
      message: data
    });
  });

  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});
  