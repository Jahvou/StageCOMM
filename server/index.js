require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const connectDB = require('./src/db');
const registerSocketHandlers = require('./src/sockets/socketHandler');

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST']
    },
});

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', app: 'StageCOMM API' });
});

registerSocketHandlers(io);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    httpServer.listen(PORT, () => {
        console.log('StageCOMM server running on port' , PORT);
    });
});