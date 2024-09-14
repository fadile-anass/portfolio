const express = require("express");
const router = express.Router();
const multer = require('multer');
const resumeController = require('../controllers/resumeController');

// Configure Multer for PDF upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get('/', resumeController.getAllResumes);
router.post('/', upload.single('pdf'), resumeController.createResume);
router.delete('/:id', resumeController.deleteResume);

module.exports = router;
