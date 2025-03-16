const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const resumeController = require('../controllers/resumeController');
const authMiddleware = require("../middlewares/authMiddleware");

// Determine if we're in a serverless environment
const isServerless = process.env.NODE_ENV === 'production' || process.env.AWS_LAMBDA_FUNCTION_NAME;

// Use /tmp directory in serverless environments, otherwise use ./uploads
const uploadsDir = isServerless ? '/tmp/uploads' : './uploads';

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Created uploads directory at ${uploadsDir}`);
  }
} catch (err) {
  console.error(`Failed to create uploads directory: ${err.message}`);
  // Continue execution even if directory creation fails
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
const upload = multer({ storage });

router.get('/', resumeController.getAllResumes);
router.post('/',authMiddleware, upload.single('pdf'), resumeController.createResume);
router.delete('/:id',authMiddleware, resumeController.deleteResume);

module.exports = router;