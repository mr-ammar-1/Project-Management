const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes for CRUD operations on users
router.post('/api/users', userController.addUser);
router.put('/api/users', userController.updateUser);
router.delete('/api/users', userController.deleteUser);
router.post('/api/login', userController.login);
router.get('/api/users', userController.getAllUsers);
router.get('/api/notifications/:email', userController.getNotificationsByEmail);
router.get('/api/users/getUserByEmail/:email', userController.getUserByEmail);


router.put('/api/notifications', userController.markNotificationsAsRead);




module.exports = router;