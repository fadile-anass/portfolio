const mysql = require("mysql2");

const pool = mysql.createPool({
  uri: process.env.mysql_uri,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();
module.exports = promisePool;
