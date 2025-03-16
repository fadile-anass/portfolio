const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

console.log('Checking client dependencies...');

// Check if yocto-queue is properly installed
const yoctoQueuePath = path.join(__dirname, 'node_modules', 'yocto-queue');
if (!fs.existsSync(yoctoQueuePath)) {
  console.log('Installing missing dependency: yocto-queue');
  try {
    execSync('npm install yocto-queue', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to install yocto-queue:', error.message);
  }
}

// Check for other common missing dependencies
const commonDeps = [
  'react-scripts',
  '@babel/plugin-proposal-private-property-in-object'
];

commonDeps.forEach(dep => {
  const depPath = path.join(__dirname, 'node_modules', dep);
  if (!fs.existsSync(depPath)) {
    console.log(`Installing missing dependency: ${dep}`);
    try {
      execSync(`npm install ${dep} --save-dev`, { stdio: 'inherit' });
    } catch (error) {
      console.error(`Failed to install ${dep}:`, error.message);
    }
  }
});

console.log('Client dependency check completed.');