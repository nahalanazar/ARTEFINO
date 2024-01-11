import Notification from "../models/notificationModel.js";
import asyncHandler from 'express-async-handler'
import User from "../models/userModel.js";

async function storeNotification(userId, newMessageReceived) {
    try {
        const existingNotification = await Notification.findOne({
            sender: newMessageReceived.sender._id,
            receiver: userId
        });
        if (!existingNotification) {
            const notification = new Notification({
            sender: newMessageReceived.sender._id,
            receiver: userId,
            chat: newMessageReceived.chat._id,
            content: newMessageReceived.content
        })
            await notification.save();
            console.log(`Notification stored for user ${userId}`);
        }
    } catch (error) {
        console.error('Error storing notification:', error);
    }
}
const createNotification = async (senderId, receiverId, chatId, content, link) => {
    try {
        await Notification.create({
            sender: senderId,
            receiver: receiverId,
            chat: chatId,
            content,
            link
        })
    } catch (error) {
        console.error('Error creating notification: ', error.message)
    }
}

const fetchNotifications = asyncHandler(async (req, res) => {

    // Use lean() to convert the query result to a plain JavaScript object
    const notifications = await Notification.find({ receiver: req.user._id }).lean();

    // Populate the "chat" field with the documents from the "Chat" collection
    const populatedNotifications = await Notification.populate(notifications, {
        path: "chat",
    });

    // Populate the "users" field within each "chat" document with the documents from the "User" collection
    const finalNotifications = await User.populate(populatedNotifications, {
        path: "chat.users",
        select: "name profileImageName email",
    });

    res.json(finalNotifications);
})

const deleteNotification = asyncHandler(async (req, res) => {
    const notificationId = req.params.notificationId;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
    }

    // notification.isRead = true;
    await notification.deleteOne();

    res.status(200).json({ message: 'Notification Deleted' });
})

export {
    createNotification,
    fetchNotifications,
    deleteNotification,
    storeNotification
}
