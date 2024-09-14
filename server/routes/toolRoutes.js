const express = require("express");
const router = express.Router();
const toolController = require('../controllers/toolController');

router.get('/', toolController.getAllTools);
router.post('/', toolController.createTool);
router.delete('/:id', toolController.deleteTool);

module.exports = router;
