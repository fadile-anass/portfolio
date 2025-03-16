const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if xtend is properly installed
const xtendPath = path.join(__dirname, 'node_modules', 'xtend');
if (!fs.existsSync(xtendPath)) {
  console.log('Installing missing xtend dependency...');
  try {
    execSync('npm install xtend@4.0.2 --save', { stdio: 'inherit' });
    console.log('xtend installed successfully!');
  } catch (error) {
    console.error('Failed to install xtend:', error);
  }
} else {
  console.log('xtend is already installed.');
}

// Check if multer is properly installed
const multerPath = path.join(__dirname, 'node_modules', 'multer');
if (!fs.existsSync(multerPath)) {
  console.log('Installing missing multer dependency...');
  try {
    execSync('npm install multer@1.4.5-lts.1 --save', { stdio: 'inherit' });
    console.log('multer installed successfully!');
  } catch (error) {
    console.error('Failed to install multer:', error);
  }
} else {
  console.log('multer is already installed.');
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory...');
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('uploads directory created successfully!');
} else {
  console.log('uploads directory already exists.');
}

console.log('Dependency check completed.');