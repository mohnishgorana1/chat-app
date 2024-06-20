import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new SocketIOServer(server);

  io.on("connection", (socket) => {
    console.log("A Client Connected", socket.id);

    socket.on("message", (msg) => {
      console.log("Received msg", msg);
      io.emit("message", msg);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected", socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// import { Server as SocketIOServer } from "socket.io";
// import { createServer } from "http";
// import next from "next";

// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = createServer((req, res) => {
//     // This is the part where we handle Next.js pages
//     handle(req, res);
//   });

//   const io = new SocketIOServer(server);

//   io.on("connection", (socket) => {
//     console.log("A Client Connected", socket.id);

//     socket.on("message", (msg) => {
//       console.log("Received msg", msg);
//       io.emit("message", msg);
//     });

//     socket.on("disconnect", () => {
//       console.log("Disconnected", socket.id);
//     });
//   });

//   const PORT = process.env.PORT || 3000;
//   server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// });
