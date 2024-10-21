const express = require("express");
const router = express.Router();
const skillController = require('../controllers/skillController');

router.get('/', skillController.getAllSkills);
router.post('/create', skillController.createSkill);
router.delete('/delete/:id', skillController.deleteSkill);

module.exports = router;
