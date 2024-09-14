const promisePool = require('../database');

exports.getAllTypes = async () => {
  return promisePool.query("SELECT * FROM type");
};
