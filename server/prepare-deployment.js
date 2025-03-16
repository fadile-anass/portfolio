const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Preparing deployment package...');

// Create a temporary package.json with explicit dependencies
const packageJson = require('./package.json');
const tempPackageJson = {
  ...packageJson,
  dependencies: {
    ...packageJson.dependencies,
    // Explicitly add multer's dependencies
    'xtend': '^4.0.2',
    'append-field': '^1.0.0',
    'busboy': '^1.6.0',
    'concat-stream': '^1.6.2',
    'mkdirp': '^0.5.6',
    'object-assign': '^4.1.1',
    'type-is': '^1.6.18',
    'streamsearch': '^1.1.0'
  }
};

// Write the temporary package.json
fs.writeFileSync('temp-package.json', JSON.stringify(tempPackageJson, null, 2));

// Install dependencies using the temporary package.json
try {
  console.log('Installing all dependencies explicitly...');
  execSync('npm install --production --package-lock-only --package=temp-package.json', { stdio: 'inherit' });
  execSync('npm ci --production --package=temp-package.json', { stdio: 'inherit' });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Failed to install dependencies:', error);
  process.exit(1);
}

// Clean up
fs.unlinkSync('temp-package.json');

console.log('Deployment package prepared successfully!');