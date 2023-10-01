const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

const cors = require('cors');

app.use(cors());
app.use(express.json()); // Parse JSON requests

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        methods: ['POST', 'GET'],
        origin: 'http://127.0.0.1:5173'
    }
});

io.on("connection", (socket) => {
    console.log(`user connected on port: ${socket.id}`);
    socket.on('join_room', (data) => {
        socket.join(data)
    })
    socket.on('sent_message', (data) => {
        socket.to(data.room).emit('received_message',data.message)
        // console.log(data)
    })
});

server.listen(3001, () => {
    console.log('Server started on port 3001');
});
