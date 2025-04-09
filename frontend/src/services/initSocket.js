import { io } from 'socket.io-client';

const initSocket = () => io();

export default initSocket;
