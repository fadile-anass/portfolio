const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// List of dependencies required by multer
const dependencies = [
  { name: 'xtend', version: '4.0.2' },
  { name: 'append-field', version: '1.0.0' },
  { name: 'busboy', version: '1.6.0' },
  { name: 'concat-stream', version: '1.6.2' },
  { name: 'mkdirp', version: '0.5.6' },
  { name: 'object-assign', version: '4.1.1' },
  { name: 'type-is', version: '1.6.18' },
  { name: 'streamsearch', version: '1.1.0' }
];

// Check and install missing dependencies
dependencies.forEach(dep => {
  const depPath = path.join(__dirname, 'node_modules', dep.name);
  
  if (!fs.existsSync(depPath)) {
    console.log(`Installing missing dependency: ${dep.name}@${dep.version}`);
    try {
      execSync(`npm install ${dep.name}@${dep.version} --no-save`, { stdio: 'inherit' });
      console.log(`${dep.name} installed successfully!`);
    } catch (error) {
      console.error(`Failed to install ${dep.name}:`, error);
    }
  } else {
    console.log(`${dep.name} is already installed.`);
  }
});

console.log('All dependencies checked and installed if needed.');