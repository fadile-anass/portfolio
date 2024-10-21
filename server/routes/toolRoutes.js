const express = require("express");
const router = express.Router();
const toolController = require('../controllers/toolController');

router.get('/', toolController.getAllTools);
router.post('/create', toolController.createTool);
router.delete('/delete/:id', toolController.deleteTool);

module.exports = router;
