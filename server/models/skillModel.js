const promisePool = require('../database');

exports.createSkill = async (name, iconName) => {
  return promisePool.query(
    "INSERT INTO skills (name, iconName) VALUES (?, ?)",
    [name, iconName]
  );
};

exports.getAllSkills = async () => {
  return promisePool.query("SELECT * FROM skills");
};

exports.deleteSkill = async (id) => {
  return promisePool.query("DELETE FROM skills WHERE id = ?", [id]);
};
