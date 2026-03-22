import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateImage } from "@rachid_zahrani/image-generator";

import resumeRoutes from './routes/resumeRoutes.js';
import toolRoutes from './routes/toolRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import typeRoutes from './routes/typeRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Check for required dependencies
try {
  await import('./fix-dependencies.js');
} catch (error) {
  console.error('Error ensuring dependencies:', error);
}

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make uploads directory accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Middleware
app.use('/projects', projectRoutes);
app.use('/resume', resumeRoutes);
app.use('/auth', authRoutes);
app.use('/skills', skillRoutes);
app.use('/tool', toolRoutes);
app.use('/type', typeRoutes);

app.post("/generateImage", async (req, res) => {
  try {
    const { prompt, selectedShape } = req.body;
    const image = await generateImage({
      prompt,
      selectedShape: selectedShape,
    });
    res.set("Content-Type", "image/png");
    res.send(image);
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});


// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
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