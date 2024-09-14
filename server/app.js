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

// Middleware
app.use(cors());
app.use(express.json());

// Routes Middleware
app.use('/projects', projectRoutes);
app.use('/resume', resumeRoutes);
app.use('/skills', skillRoutes);
app.use('/tool', toolRoutes);
app.use('/type', typeRoutes);

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
