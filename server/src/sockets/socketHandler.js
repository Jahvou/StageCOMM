const registerSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log('Socket connected: ${socket.id}');

        socket.on('join_org', (orgId) => {
            socket.join(orgId);
            console.log('Socket ${socket.id} joined org room: ${orgId}');
        });
        
        socket.on('disconnect', () => {
            console.log('socket disconnected: ${socket.id}');
        });
    });
};

module.exports = registerSocketHandlers;