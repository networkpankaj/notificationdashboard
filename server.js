const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const leaveRouter = require('./routes/leaveRouter');
const attendanceRouter = require('./routes/attendanceRouter'); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/notificationApp');

// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

app.use('/api/leave', leaveRouter);
app.use('/api/attendance', attendanceRouter); 

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.set('socketio', io);


server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
