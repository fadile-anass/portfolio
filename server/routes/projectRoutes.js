const express = require("express");
const router = express.Router();
const multer = require('multer');
const projectController = require("../controllers/projectController");

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

router.get('/', projectController.getAllProjects);
router.post('/', upload.single('image'), projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.put('/:projectId', upload.single('image'), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;
