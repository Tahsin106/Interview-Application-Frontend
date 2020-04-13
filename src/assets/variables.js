import io from "socket.io-client";
export const hostname ='http://localhost:8080';
export const socket = io.connect(hostname);