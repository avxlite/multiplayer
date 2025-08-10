const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const drawnPixels = [];
const chatHistory = [];


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("canvasState", drawnPixels);

  socket.on("drawSquare", (data) => {
    drawnPixels.push(data);
    socket.broadcast.emit("drawSquare", data);
  });
  socket.emit("chatHistory", chatHistory);

  socket.on("chatMessage", (msg) => {
    const message = { id: socket.id, text: msg };
    chatHistory.push(message);
    io.emit("chatMessage", message);
  });


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
