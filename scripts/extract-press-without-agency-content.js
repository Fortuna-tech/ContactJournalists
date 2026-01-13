/**
 * Script to extract content from PressWithoutAgencyBlog.tsx and update database
 * Run this with: node scripts/extract-press-without-agency-content.js
 */

const fs = require('fs');
const path = require('path');

// Read the component file
const componentPath = path.join(__dirname, '../src/pages/blog/PressWithoutAgencyBlog.tsx');
const componentContent = fs.readFileSync(componentPath, 'utf-8');

// Extract content between the prose div (lines 45-1895 approximately)
// We need to extract everything inside <div className="prose prose-invert prose-lg max-w-none">
// until the closing </div> before the footer

// Find the start of the prose section
const proseStart = componentContent.indexOf('<div className="prose prose-invert prose-lg max-w-none">');
if (proseStart === -1) {
  console.error('Could not find prose section');
  process.exit(1);
}

// Find the end - look for the closing div before the footer section
// The footer starts with {/* Footer */}
const footerStart = componentContent.indexOf('{/* Footer */}');
if (footerStart === -1) {
  console.error('Could not find footer section');
  process.exit(1);
}

// Extract content between prose start and footer
let proseContent = componentContent.substring(proseStart, footerStart);

// Remove the opening div tag
proseContent = proseContent.replace(/^<div className="prose[^"]*">/, '');

// Convert JSX to HTML
// Replace className with class
proseContent = proseContent.replace(/className=/g, 'class=');
// Remove JSX expressions like {variable} - we'll need to handle these manually
// For now, just extract the HTML structure

// Clean up - remove extra whitespace but preserve structure
proseContent = proseContent.trim();

// Write to a file for inspection
const outputPath = path.join(__dirname, '../extracted-content.html');
fs.writeFileSync(outputPath, proseContent);

console.log('Content extracted to:', outputPath);
console.log('Content length:', proseContent.length);
console.log('\nNext step: Review the extracted content and update the database manually via the admin form.');



