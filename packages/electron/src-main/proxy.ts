import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { ipcMain, webContents } from "electron";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket: Socket) => {
  _socket = socket;

  socket.on("pm-devtools", (message) => {
    respond(message);
  });
});
httpServer.listen(8080);

ipcMain.on("pm-devtools", (_event, message) => {
  if (message) {
    respond(message);
  }
});

let _socket: Socket;

function respond(message: any) {
  if (message.target === "devtools") {
    webContents.getAllWebContents().forEach((webContents) => {
      webContents.send("pm-devtools", message);
    });
  } else {
    safeRespondToDevtools(message);
  }
}

function safeRespondToDevtools(message: any, count = 0) {
  if (!_socket) {
    setTimeout(safeRespondToDevtools, 100, message, count + 1);
  } else {
    _socket!.emit("pm-devtools", message);
  }
}
