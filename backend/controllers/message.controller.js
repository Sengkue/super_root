const { Message, User, UserProfile, Notification } = require('../models');
const { Op } = require('sequelize');

// Helper to get active user ID from headers or fallback to Alice
const getActiveUserId = async (req) => {
  const headerUserId = req.headers['userid'] || req.headers['x-user-id'];
  if (headerUserId) {
    const user = await User.findByPk(headerUserId);
    if (user) return user.id;
  }
  // Fallback
  const fallback = await User.findOne({ where: { username: 'Alice' } });
  return fallback ? fallback.id : null;
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = await getActiveUserId(req);

    if (!senderId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!receiverId || !content) {
      return res.status(400).json({ error: 'Receiver ID and content are required' });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      content,
    });

    // Create a notification for the receiver
    const sender = await User.findByPk(senderId, {
      attributes: ['username']
    });
    
    await Notification.create({
      userId: receiverId,
      type: 'message',
      message: `${sender ? sender.username : 'Someone'} sent you a message`,
      link: `/chat/${senderId}`
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = await getActiveUserId(req);

    if (!currentUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: currentUserId, receiverId: userId },
          { senderId: userId, receiverId: currentUserId },
        ],
      },
      order: [['createdAt', 'ASC']],
    });

    // Mark as read
    await Message.update(
      { read: true },
      {
        where: {
          senderId: userId,
          receiverId: currentUserId,
          read: false,
        },
      }
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const currentUserId = await getActiveUserId(req);

    if (!currentUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: currentUserId }, { receiverId: currentUserId }],
      },
      order: [['createdAt', 'DESC']],
    });

    // Extract unique user IDs from the messages
    const userIds = new Set();
    messages.forEach((msg) => {
      if (msg.senderId !== currentUserId) userIds.add(msg.senderId);
      if (msg.receiverId !== currentUserId) userIds.add(msg.receiverId);
    });

    const users = await User.findAll({
      where: { id: Array.from(userIds) },
      include: [{ model: UserProfile, as: 'profile' }],
      attributes: ['id', 'username', 'number'],
    });

    // Attach latest message for each conversation
    const conversations = users.map((user) => {
      const userMessages = messages.filter(
        (msg) =>
          (msg.senderId === user.id && msg.receiverId === currentUserId) ||
          (msg.senderId === currentUserId && msg.receiverId === user.id)
      );
      
      const latestMessage = userMessages[0]; // because it's sorted by DESC
      
      const unreadCount = userMessages.filter(
        (msg) => msg.senderId === user.id && msg.receiverId === currentUserId && !msg.read
      ).length;

      return {
        user,
        latestMessage,
        unreadCount
      };
    });
    
    // Sort conversations by latest message time
    conversations.sort((a, b) => b.latestMessage.createdAt - a.latestMessage.createdAt);

    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};
