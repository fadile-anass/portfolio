const express = require("express");
const router = express.Router();
const multer = require('multer');
const resumeController = require('../controllers/resumeController');
const authMiddleware = require("../middlewares/authMiddleware");

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
router.post('/',authMiddleware, upload.single('pdf'), resumeController.createResume);
router.delete('/:id',authMiddleware, resumeController.deleteResume);

module.exports = router;
