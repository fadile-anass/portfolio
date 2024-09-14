const toolModel = require('../models/toolModel');

exports.createTool = async (req, res) => {
  try {
    const { name, toolIcon } = req.body;
    await toolModel.createTool(name, toolIcon);
    res.status(200).send("Tool created successfully");
  } catch (err) {
    console.error("Error creating tool:", err);
    res.status(500).send("Error creating tool");
  }
};

exports.getAllTools = async (req, res) => {
  try {
    const [results] = await toolModel.getAllTools();
    res.json(results);
  } catch (err) {
    console.error("Error retrieving tools:", err);
    res.status(500).send("Error retrieving tools");
  }
};

exports.deleteTool = async (req, res) => {
  try {
    const toolId = req.params.id;
    await toolModel.deleteTool(toolId);
    res.status(200).send("Tool deleted successfully");
  } catch (err) {
    console.error("Error deleting tool:", err);
    res.status(500).send("Error deleting tool");
  }
};
