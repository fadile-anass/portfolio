const skillModel = require('../models/skillModel');

exports.createSkill = async (req, res) => {
  try {
    const { name, iconName } = req.body;
    await skillModel.createSkill(name, iconName);
    res.status(200).json({ message: "Skill created successfully" });
  } catch (err) {
    console.error("Error creating skill:", err);
    res.status(500).json({ error: "Error creating skill" });
  }
};


exports.getAllSkills = async (req, res) => {
  try {
    const [results] = await skillModel.getAllSkills();
    res.json(results);
  } catch (err) {
    console.error("Error retrieving skills:", err);
    res.status(500).send("Error retrieving skills");
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const skillId = req.params.id;
    await skillModel.deleteSkill(skillId);
    res.status(200).send("Skill deleted successfully");
  } catch (err) {
    console.error("Error deleting skill:", err);
    res.status(500).send("Error deleting skill");
  }
};
