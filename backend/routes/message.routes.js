const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');

router.post('/', messageController.sendMessage);
router.get('/conversations', messageController.getConversations);
router.get('/:userId', messageController.getConversation);

module.exports = router;
