const typeModel = require('../models/typeModel');

exports.getAllTypes = async (req, res) => {
  try {
    const [results] = await typeModel.getAllTypes();
    res.json(results);
  } catch (err) {
    console.error("Error retrieving types:", err);
    res.status(500).send("Error retrieving types");
  }
};
