const express = require("express");
const router = express.Router();
const skillController = require('../controllers/skillController');
const authMiddleware = require("../middlewares/authMiddleware");

router.get('/', skillController.getAllSkills);
router.post('/create',authMiddleware, skillController.createSkill);
router.delete('/delete/:id',authMiddleware, skillController.deleteSkill);

module.exports = router;
