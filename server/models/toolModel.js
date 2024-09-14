const promisePool = require('../database');

exports.createTool = async (name, toolIcon) => {
  return promisePool.query(
    "INSERT INTO tool (name, toolIcon) VALUES (?, ?)",
    [name, toolIcon]
  );
};

exports.getAllTools = async () => {
  return promisePool.query("SELECT * FROM tool");
};

exports.deleteTool = async (id) => {
  return promisePool.query("DELETE FROM tool WHERE id = ?", [id]);
};
