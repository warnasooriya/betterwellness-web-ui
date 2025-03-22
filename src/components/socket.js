import { io } from 'socket.io-client';
import config from '../api/config';

 

const socket = io(config.webSocketUrl, {
  transports: ['websocket'],
  autoConnect: true,
  reconnection: true,
  // reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  query: { userId: localStorage.getItem('userId') },
});

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.log("Connection error:", error);
});

export default socket;