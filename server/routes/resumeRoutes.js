const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const resumeController = require('../controllers/resumeController');
const authMiddleware = require("../middlewares/authMiddleware");

// Ensure uploads directory exists
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// Configure Multer for PDF upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

router.get('/', resumeController.getAllResumes);
router.post('/',authMiddleware, upload.single('pdf'), resumeController.createResume);
router.delete('/:id',authMiddleware, resumeController.deleteResume);

module.exports = router;