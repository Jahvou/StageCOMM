const Chat = require('../models/Chat');

const registerChatEvents = (io, socket) => {

    // load recent chat messages
    socket.on('get_messages', async (data) => {
        try {
            const { orgId } = data;
            const roomId = orgId || socket.id;
            const messages = await Chat.find({ org: roomId })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('sentBy', 'name role');

            socket.emit('messages_loaded', messages.reverse());
        } catch (err) {
            socket.emit('chat_error', { message: err.message });
        }
    });

    // send a new chat message
     socket.on('send_message', async (data) => {
    try {
      const { orgId, sentBy, text } = data;
      const roomId = orgId || sentBy;

      const message = await Chat.create({
        org: roomId,
        sentBy,
        text,
      });

      const populated = await message.populate('sentBy', 'name role');

      io.to(roomId).emit('new_message', populated);
    } catch (err) {
      socket.emit('chat_error', { message: err.message });
    }
  });
};

module.exports = registerChatEvents;