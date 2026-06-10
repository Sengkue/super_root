const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Standard RESTful routes for User resource
router.post('/login', userController.login);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id/profile', userController.updateProfile);
router.put('/:id/password', userController.changePassword);

module.exports = router;
