const fs = require('fs');
const path = require('path');

// Source paths
const workerPath = path.resolve(__dirname, '../node_modules/pdfjs-dist/legacy/build/pdf.worker.min.js');

// Destination paths
const publicDir = path.resolve(__dirname, '../public');
const destPath = path.join(publicDir, 'pdf.worker.min.js');

// Create public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy worker file
fs.copyFileSync(workerPath, destPath);
console.log('PDF.js worker file copied to public directory');