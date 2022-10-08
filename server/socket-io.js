import { Server as socketIo } from "socket.io";

export function socketSetUp(server) {
  const io = new socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
    }, //in case server and client run on different urls
  });

  const messages = {};

  io.use(function (socket, next) {
    // first handshake
    next();
  });

  io.on("connection", (socket) => {
    const name = socket.request._query["name"];
    const room = socket.request._query["room"];
    console.log(`client connected: ${socket.id}, room: ${room}`);

    socket.join(room);

    if (!messages[room]) {
      messages[room] = [];
    }

    socket.emit("messages", messages[room]);

    socket.on("send-message", (msg) => addMessage(room, socket.id, name, msg));

    socket.on("disconnect", (reason) => {
      console.log(`client disconnected: ${socket.id}, room: ${room}`);
      if (!io.sockets.adapter.rooms.get(room)) {
        console.log(`room ${room} is empty and messages are being cleared`);
        messages[room] = [];
      }
    });
  });

  function addMessage(room, clientId, name, msg) {
    const message = {
      client: { id: clientId, name: name },
      message: msg,
    };
    messages[room].push(message);
    io.to(room).emit("new-message", message);
  }
}
