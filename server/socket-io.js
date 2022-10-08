import { Server as socketIo } from "socket.io";

export function socketSetUp(server) {
  const io = new socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
    }, //in case server and client run on different urls
  });

  const messages = [];
  const names = new Map();

  io.use(function (socket, next) {
    // first handshake
    const name = socket.request._query["name"];
    names.set(socket.id, name);
    next();
  });

  io.on("connection", (socket) => {
    console.log("client connected: ", socket.id);
    socket.emit("messages", messages);

    socket.on("new-message", (msg) => addMessage(socket.id, msg));

    socket.on("disconnect", (reason) => {
      console.log("client disconnected: ", socket.id);
    });
  });

  function addMessage(clientId, msg) {
    messages.push({
      client: { id: clientId, name: names.get(clientId) },
      message: msg,
    });
    io.emit("messages", messages);
  }
}
