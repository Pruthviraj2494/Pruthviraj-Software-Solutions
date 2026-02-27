const Message = require('../models/Message');

const connectedUsers = new Map();

async function handleJoin(socket, userId) {
    connectedUsers.set(userId, socket);
    socket.join(userId);

    try {
        const messages = await Message.find({ receiver: userId, delivered: false });
        messages.forEach((msg) => {
            socket.emit('message', msg);
            msg.delivered = true;
            msg.save().catch((err) => console.error('Error saving message:', err.message));
        });
    } catch (err) {
        console.error('Error fetching undelivered messages:', err.message);
    }
}

async function handleSendMessage(io, data) {
    try {
        const { sender, receiver, content } = data;
        const message = await Message.create({ sender, receiver, content });
        io.to(receiver).emit('message', message);
    } catch (err) {
        console.error('Error sending message:', err.message);
    }
}


async function handleReadReceipt(io, messageId) {
    try {
        const message = await Message.findById(messageId);
        if (message && !message.read) {
            message.read = true;
            await message.save();
            io.to(message.sender.toString()).emit('read', { messageId });
        }
    } catch (err) {
        console.error('Error marking message as read:', err.message);
    }
}


function handleDisconnect(socket) {
    connectedUsers.forEach((s, userId) => {
        if (s === socket) {
            connectedUsers.delete(userId);
        }
    });
}


module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('join', (userId) => handleJoin(socket, userId));
        socket.on('message', (data) => handleSendMessage(io, data));
        socket.on('read', (messageId) => handleReadReceipt(io, messageId));
        socket.on('disconnect', () => handleDisconnect(socket));
    });
};
