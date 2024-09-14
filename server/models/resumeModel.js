const promisePool = require('../database');

exports.createResume = async (name, link, pdfPath) => {
  return promisePool.query(
    "INSERT INTO resume (name, link, pdf) VALUES (?, ?, ?)",
    [name, link, pdfPath]
  );
};

exports.getAllResumes = async () => {
  return promisePool.query("SELECT * FROM resume");
};

exports.deleteResume = async (id) => {
  return promisePool.query("DELETE FROM resume WHERE id = ?", [id]);
};
