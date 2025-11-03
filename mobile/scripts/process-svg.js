const fs = require('fs');
const path = require('path');

// Read the SVG file
const svgPath = process.argv[2];
if (!svgPath) {
  console.error('Usage: node process-svg.js <path-to-svg>');
  process.exit(1);
}

const svgContent = fs.readFileSync(svgPath, 'utf-8');

// Extract viewBox
const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/);
const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 500 500';

// Extract all path elements with their d attribute
const pathMatches = svgContent.matchAll(/<path d="([^"]*)"/g);
const paths = [];

let index = 1;
for (const match of pathMatches) {
  const pathData = match[1];

  // Skip very small paths (likely decorative)
  if (pathData.length < 50) continue;

  paths.push({
    id: `part-${index}`,
    path: pathData,
    name: `Parte ${index}`
  });

  index++;
}

// Generate the drawing object
const drawingName = path.basename(svgPath, '.svg');
const emoji = '🦉'; // Default emoji, can be customized

const drawingObject = {
  id: drawingName,
  name: `${emoji} ${drawingName.charAt(0).toUpperCase() + drawingName.slice(1)}`,
  viewBox: viewBox,
  parts: paths
};

// Output as formatted JSON
console.log(JSON.stringify(drawingObject, null, 2));

// Also output stats
console.error(`\n✅ Processed ${paths.length} parts from ${svgPath}`);
console.error(`📐 ViewBox: ${viewBox}`);
