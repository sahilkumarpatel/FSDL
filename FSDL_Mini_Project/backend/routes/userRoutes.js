const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', adminAuth, userController.getUsers);
router.put('/:id/role', adminAuth, userController.updateUserRole);

module.exports = router;
