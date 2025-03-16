const mysql = require("mysql2");
require('dotenv').config();

// Parse the MySQL URI if it's in URI format
let config = {};
if (process.env.mysql_uri) {
  try {
    const url = new URL(process.env.mysql_uri);
    config = {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1), // Remove leading '/'
      port: url.port || 3306
    };
  } catch (error) {
    // If URI parsing fails, try using direct connection parameters
    console.warn("Failed to parse MySQL URI, checking for individual connection parameters");
  }
} 

// If no URI or parsing failed, try individual environment variables
if (!config.host) {
  config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  };
}

const pool = mysql.createPool({
  ...config,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Successfully connected to MySQL database');
    connection.release();
  }
});

const promisePool = pool.promise();
module.exports = promisePool;