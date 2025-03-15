const express = require("express");
const router = express.Router();
const multer = require('multer');
const projectController = require("../controllers/projectController");
const authMiddleware = require("../middlewares/authMiddleware");

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

// Public routes - no authentication required
router.get('/',  projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);

// Protected routes - authentication required
router.post('/create', authMiddleware, upload.single('image'), projectController.createProject);
router.put('/update/:projectId', authMiddleware, upload.single('image'), projectController.updateProject);
router.delete('/delete/:id', authMiddleware, projectController.deleteProject);

module.exports = router;