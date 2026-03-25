const fs = require('fs');
const path = require('path');
const base = 'D:\\antigravity\\eco os\\public';

const parts = ['p1.txt','p2.txt','p3.txt','p4.txt'].map(f =>
  fs.readFileSync(path.join(base, f), 'utf8')
);

const combined = parts.join('\n');
fs.writeFileSync(path.join(base, 'ecoflows.html'), combined, {encoding:'utf8'});
console.log('Written ecoflows.html with UTF-8 encoding, size:', fs.statSync(path.join(base,'ecoflows.html')).size, 'bytes');
