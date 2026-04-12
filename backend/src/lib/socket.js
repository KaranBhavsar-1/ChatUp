// import { Server } from "socket.io";
// import http from "http";
// import express from "express";
// import { ENV } from "./env.js";

// import {socketAuthMiddleware} from "../middleware/socket.Auth.Middleware.js";

// const app = express()
// const server = http.createServer(app)

// const io = new Server(server,{
//     cors: {
//         origin: [ENV.CLIENT_URL],
//         credentials:true,
//     },
// });

// io.use(socketAuthMiddleware)

// export function getReceiverSocketId(userId) {
//     return userSocketMap[userId]
// }
// const userSocketMap = {};

// io.on("connection", (socket) =>{
//     console.log("A User Connected", socket.user.fullname)

//     const userId = socket.userId;
//     userSocketMap[userId] = socket.id

//     io.emit("getOnlineUsers",Object.keys(userSocketMap));

//     socket.on("Disconnects", ()=>{
//         console.log("A User Disconnected" , socket.user.fullname)
//         delete userSocketMap[userId]
//         io.emit("getOnlineUsers",Object.keys(userSocketMap));

//     })
// })

// export {io, app, server}




import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.Auth.Middleware.js"

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: [ENV.CLIENT_URL],
    origin: "https://chatup-1-a7zk.onrender.com",
    // origin: "https://chatup-mz5r.onrender.com",

    credentials: true,
  },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// this is for storig online users
const userSocketMap = {}; // {userId:socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // with socket.on we listen for events from clients
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

});

export { io, app, server };