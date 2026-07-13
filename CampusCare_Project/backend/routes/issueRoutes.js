const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const fs = require('fs');

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/', auth, upload.single('photo'), issueController.createIssue);
router.get('/', auth, issueController.getIssues);
router.get('/stats', adminAuth, issueController.getStats);
router.get('/:id', auth, issueController.getIssueById);
router.put('/:id/status', adminAuth, issueController.updateStatus);
router.post('/:id/feedback', auth, issueController.addFeedback);
router.delete('/:id', auth, issueController.deleteIssue);

module.exports = router;
