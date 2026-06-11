require("dotenv").config();

const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const connectDB = require('./src/db');
const registerSocketHandlers = require('./src/sockets/socketHandler');

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST'],
    },
});

registerSocketHandlers(io);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    httpServer.listen(PORT, () => {
        console.log('StageCOMM server is running on port', PORT);
    });
});