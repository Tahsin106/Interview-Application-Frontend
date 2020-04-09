import io from "socket.io-client";
export const hostname ='http://192.168.0.17:8080';
export const socket = io.connect(hostname);