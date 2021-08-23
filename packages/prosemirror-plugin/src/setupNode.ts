import { io } from "socket.io-client";

export const socket = io("http://localhost:8080");

socket.on("connect", function () {
  console.log("socket connected");
});
