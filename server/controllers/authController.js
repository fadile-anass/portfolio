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
// User Login
exports.login = async (req, res) => {
  console.log("Login request received:", { username: req.body.username }); // Log incoming request (without password)
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Check if user exists
    console.log("Checking if user exists...");
    const users = await User.findByUsername(username);
    if (users.length === 0) {
      console.log("User not found:", username);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    console.log("User found, verifying password...");

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password verification failed");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    console.log("Password verified successfully");
    
    // Check if jwt_secret is defined - using lowercase to match .env file
    if (!process.env.jwt_secret) {
      console.error("jwt_secret is not defined in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Generate JWT token - using lowercase jwt_secret to match .env file
    console.log("Generating JWT token...");
    const token = jwt.sign({ id: user.id }, process.env.jwt_secret, { expiresIn: "1h" });
    console.log("Login successful for user:", username);

    res.json({ token });
  } catch (err) {
    console.error("FATAL LOGIN ERROR:", err); // Log the full error
    res.status(500).json({ message: "Internal server error" });
  }
};
  
