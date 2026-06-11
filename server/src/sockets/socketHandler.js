const registerAlertEvents = require('./alertEvents');

const registerSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log('Socket connected:',socket.id);

        socket.on('join_org', (orgId) => {
            socket.join(orgId);
            console.log('Socket joined org room:', socket.id, orgId);
        });
        
        registerAlertEvents(io, socket);
        socket.on('disconnect', () => {
            console.log('socket disconnected:', socket.id);
        });
    });
};

module.exports = registerSocketHandlers;