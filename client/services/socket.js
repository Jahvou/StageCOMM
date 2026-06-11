import { io } from 'socket.io-client';

const SOCKET_URL = __DEV__
    ? 'http://192.168.2.20:3000'
    : 'https://socket.stagecomm.com';

const socket = io(SOCKET_URL, {
    autoConnect: false,
});

export default socket;