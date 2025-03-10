const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const UserController = require('../controllers/userController');

router.get('/', authMiddleware, UserController.getAllUsers);

router.get('/search', authMiddleware, UserController.searchUsers);

router.get('/:uuid', authMiddleware, UserController.getUserByUUID);

module.exports = router;
