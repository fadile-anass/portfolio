const promisePool = require('../database');

exports.createProject = async (title, description, ghlink, imgData) => {
  return promisePool.query(
    "INSERT INTO projects (title, description, ghlink, image) VALUES (?, ?, ?, ?)",
    [title, description, ghlink, imgData]
  );
};

exports.getAllProjects = async () => {
  return promisePool.query("SELECT * FROM projects");
};

exports.getProjectById = async (id) => {
  return promisePool.query("SELECT * FROM projects WHERE id = ?", [id]);
};

exports.updateProject = async (id, title, description, ghlink, imgData) => {
  return promisePool.query(
    "UPDATE projects SET title = ?, description = ?, ghlink = ?, image = ? WHERE id = ?",
    [title, description, ghlink, imgData, id]
  );
};

exports.deleteProject = async (id) => {
  return promisePool.query("DELETE FROM projects WHERE id = ?", [id]);
};
