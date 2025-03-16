const fs = require('fs');
const resumeRoutes = require('./routes/resumeRoutes');
const cors = require("cors");
const toolRoutes = require('./routes/toolRoutes');
const path = require('path');
const skillRoutes = require('./routes/skillRoutes');
const projectRoutes = require('./routes/projectRoutes');
const express = require("express");
const typeRoutes = require('./routes/typeRoutes');
require('dotenv').config();

// Check for required dependencies
try {
  require('./ensure-dependencies');
} catch (error) {
  console.error('Error ensuring dependencies:', error);
}

const app = express();

// Import Routes
const authRoutes = require('./routes/authRoutes');  // Added auth routes import

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make uploads directory accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes Middleware
app.use('/projects', projectRoutes);
app.use('/resume', resumeRoutes);
app.use('/auth', authRoutes);  // Added auth routes middleware
app.use('/skills', skillRoutes);
app.use('/tool', toolRoutes);
app.use('/type', typeRoutes);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  // redacted
}

// Error handling middleware
app.use((err, req, res, next) => {
  // redacted
});
// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  // redacted
});