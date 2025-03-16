const mysql = require("mysql2");

// Parse the connection URI to remove any invalid options
let connectionConfig;
if (process.env.mysql_uri) {
  // If using a URI string
  connectionConfig = {
    uri: process.env.mysql_uri,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
  
  // If you need to explicitly set SSL options
  if (process.env.NODE_ENV === 'production') {
    connectionConfig.ssl = {
      // You can add specific SSL options here if needed
      // rejectUnauthorized: true
    };
  }
} else {
  // Fallback to direct connection parameters if no URI is provided
  connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

const pool = mysql.createPool(connectionConfig);

module.exports = pool.promise();