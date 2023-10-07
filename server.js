const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 8888;

io.on("connection", (socket) => {
    socket.on("chat message", (data) => {
        io.emit(`chat message ${data.toUserName}`, data);
    })
});

app.use(express.static("public"));


server.listen(PORT);