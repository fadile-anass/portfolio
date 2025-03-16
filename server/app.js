require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();

// Import Routes
const projectRoutes = require('./routes/projectRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const skillRoutes = require('./routes/skillRoutes');
const toolRoutes = require('./routes/toolRoutes');
const typeRoutes = require('./routes/typeRoutes');
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
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});