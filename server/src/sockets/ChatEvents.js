const Chat = require('../models/Chat');

const registerChatEvents = (io, socket) => {

    // load recent chat messages
    socket.on('get_messages', async (data) => {
        try {
            const { orgId } = data;
            const messages = await chat.find({ org: orgId })
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

      const message = await Chat.create({
        org: orgId,
        sentBy,
        text,
      });

      const populated = await message.populate('sentBy', 'name role');

      io.to(orgId).emit('new_message', populated);
    } catch (err) {
      socket.emit('chat_error', { message: err.message });
    }
  });
};

module.exports = registerChatEvents;