import { Server } from "socket.io";

let userSocketsMap: any = {};
let io: any = null;

function connectSockets(server: any) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket: any) => {
    console.log("user connected ", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId && !Array.isArray(userId)) {
      userSocketsMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketsMap));

    socket.on("disconnect", () => {
      console.log("user disconnected ", socket.id);
      delete userSocketsMap[userId as string];
      io.emit("getOnlineUsers", Object.keys(userSocketsMap));
    });
  });
}
const getReceiverSocketId = (receiverId: string) => {
  return userSocketsMap[receiverId];
};

export { connectSockets, getReceiverSocketId, io };
