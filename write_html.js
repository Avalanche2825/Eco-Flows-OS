const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'public', 'ecoflows.src'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'public', 'ecoflows.html'), html, 'utf8');
console.log('ecoflows.html written successfully');
