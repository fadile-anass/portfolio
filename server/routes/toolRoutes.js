const express = require("express");
const router = express.Router();
const toolController = require('../controllers/toolController');
const authMiddleware = require("../middlewares/authMiddleware");

router.get('/', toolController.getAllTools);
router.post('/create',authMiddleware, toolController.createTool);
router.delete('/delete/:id',authMiddleware, toolController.deleteTool);

module.exports = router;
