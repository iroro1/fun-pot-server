const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 5000;
const router = require("./router");
const { addUser, getUser, getUsersInRoom, removeUser } = require("./users");

const app = express();
const server = http.createServer(app);

app.use(router);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// sockets code
io.on("connection", (socket) => {
  socket.on("join", ({ playerName, gameCode }, cb) => {
    const { error, user, userArr } = addUser(socket.id, playerName, gameCode);
    if (error) {
      cb({ error });
    }
    console.log("we have a new connection", socket.id, user, userArr);

    if (user?.playerName) {
      socket.join(user?.gameCode);

      socket.emit("message", {
        user: "admin",
        text: `Hello ${user?.playerName}, welcome to the game group with code ${user?.gameCode}`,
      });
      socket.broadcast.to(user?.gameCode).emit({
        user: user?.playerName,
        text: `${user?.playerName}, has joined the game!`,
      });
    }
    // io.to(user?.gameCode).emit("userList", {
    //   user,
    //   userList: getUsersInRoom(user?.gameCode),
    // });

    cb();
  });

  socket.on("sendMessage", (message, cb) => {
    const user = getUser(socket.id);
    io.to(user?.gameCode).emit("message", {
      user: user?.playerName,
      text: message,
    });
    // io.to(user?.gameCode).emit("userList", {
    //   user: user?.playerName,
    //   userList: getUsersInRoom(user?.gameCode),
    // });
    cb();
  });

  socket.on("gamesEvent", (gamesData, cb) => {
    const id = socket.id;
    console.log(gamesData, id);
    const board = updateLeaderBoard(gamesData, id);
    io.to(user?.gameCode).emit("gamesEvent", {
      ...gamesData,
      leaderBoard: board,
    });
    cb();
  });

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (user) {
      removeUser(socket.id);
      io.to(user?.gameCode).emit("message", {
        user: "admin",
        text: `${user?.playerName} has left the game`,
      });
    }
  });
});

// server code
server.listen(PORT, () => {
  console.log("Server started on Port : ", PORT);
});
