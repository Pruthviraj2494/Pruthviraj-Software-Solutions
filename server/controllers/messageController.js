const Message = require('../models/Message');
const { handleAPIResponse } = require('../utils/utils');

// Get messages between user and another user
exports.getMessages = async (req, res) => {
    try {
        const { otherId } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: otherId },
                { sender: otherId, receiver: req.user._id }
            ]
        }).sort({ timestamp: 1 }).populate('sender receiver', '-password');
        handleAPIResponse.success(res, messages);
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findByIdAndUpdate(messageId, { read: true }, { new: true });
        if (!message) {
            return handleAPIResponse.notFound(res, 'Message not found');
        }
        handleAPIResponse.success(res, message, 200, 'Message marked as read');
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};


function findUnresponsedActiveStudents(applications){
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const studentMap = new Map(); 
    for (const app of applications) {
        if (new Date(app.appliedDate) < sevenDaysAgo)
            continue; 
    if (!studentMap.has(app.studentId)) {
         studentMap.set(app.studentId, { count: 0, hasResponse: false }); 
        } 
        const entry = studentMap.get(app.studentId); 
        entry.count++; 
        if (app.status !== 'Applied') 
        entry.hasResponse = true;
    } 
    return [...studentMap.entries()].filter(([_, data]) => data.count > 3 && !data.hasResponse).map(([studentId]) => studentId);
}
