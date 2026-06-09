const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

// Post routes
router.get('/users', postController.getAllUsers); // For user switcher
router.get('/user/:userId', postController.getUserPosts); // For profile
router.get('/saved', postController.getSavedPosts); // For saved page
router.get('/', postController.getFeed);
router.post('/', postController.createPost);
router.post('/:id/comments', postController.addComment);
router.post('/:id/like', postController.toggleLike);
router.post('/:id/save', postController.toggleSave);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;
