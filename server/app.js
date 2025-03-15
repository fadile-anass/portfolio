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

// Routes Middleware
app.use('/projects', projectRoutes);
app.use('/resume', resumeRoutes);
app.use('/auth', authRoutes);  // Added auth routes middleware
app.use('/skills', skillRoutes);
app.use('/tool', toolRoutes);
app.use('/type', typeRoutes);

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});