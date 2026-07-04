import { io } from 'socket.io-client';

const SOCKET_URL = __DEV__
    ? 'http://192.168.2.33:3000'
    : 'https://stagecomm.onrender.com';

const socket = io(SOCKET_URL, {
    autoConnect: false,
});

export default socket;