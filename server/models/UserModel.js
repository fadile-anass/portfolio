const db = require("../database");

class User {
  static async findByUsername(username) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
      return rows;
    } catch (error) {
      console.error("Error finding user by username:", error);
      throw error;
    }
  }

  static async create(username, password) {
    try {
      const [result] = await db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

module.exports = User;