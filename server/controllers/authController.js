const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/UserModel");

// User Registration
exports.register = async (req, res) => {
    console.log("Registration request received:", req.body); // Log incoming request
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { username, password } = req.body;
  
      // Check if user exists
      console.log("Checking for existing user...");
      const existingUsers = await User.findByUsername(username);
      if (existingUsers.length > 0) {
        console.log("Username already exists:", username);
        return res.status(400).json({ message: "Username taken" });
      }
  
      // Hash password
      console.log("Hashing password...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create user
      console.log("Creating user...");
      await User.create(username, hashedPassword);
      console.log("User created successfully");
      res.status(201).json({ message: "User registered" });
    } catch (err) {
      console.error("FATAL ERROR:", err); // Log the full error
      res.status(500).json({ message: "Internal server error" });
    }
  };

// User Login
exports.login = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { username, password } = req.body;
  
      // Check if user exists
      const users = await User.findByUsername(username);
      if (users.length === 0) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const user = users[0];
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.json({ token });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
