const fs = require('fs');
const path = require('path');

// Read the SVG file
const svgPath = process.argv[2];
if (!svgPath) {
  console.error('Usage: node process-svg-advanced.js <path-to-svg>');
  process.exit(1);
}

const svgContent = fs.readFileSync(svgPath, 'utf-8');

// Extract viewBox
const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/);
let viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 500 500';

// Parse viewBox to get dimensions
const [vbX, vbY, vbWidth, vbHeight] = viewBox.split(' ').map(Number);

// Function to calculate bounding box of a path
function getPathBounds(pathData) {
  // Simple approximation - extract all numbers and find min/max
  const numbers = pathData.match(/-?\d+\.?\d*/g);
  if (!numbers || numbers.length < 2) return null;

  const coords = [];
  for (let i = 0; i < numbers.length; i += 2) {
    if (numbers[i + 1]) {
      coords.push({ x: parseFloat(numbers[i]), y: parseFloat(numbers[i + 1]) });
    }
  }

  if (coords.length === 0) return null;

  const xs = coords.map(c => c.x);
  const ys = coords.map(c => c.y);

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
  };
}

// Extract all path elements with their d attribute
const pathMatches = svgContent.matchAll(/<path[^>]*d="([^"]*)"/g);
const paths = [];
const allBounds = [];

for (const match of pathMatches) {
  const pathData = match[1];

  // Skip very small paths (likely decorative)
  if (pathData.length < 20) continue;

  const bounds = getPathBounds(pathData);
  if (bounds) {
    allBounds.push(bounds);
    paths.push(pathData);
  }
}

// Calculate overall bounding box
if (allBounds.length > 0) {
  const overallBounds = {
    minX: Math.min(...allBounds.map(b => b.minX)),
    maxX: Math.max(...allBounds.map(b => b.maxX)),
    minY: Math.min(...allBounds.map(b => b.minY)),
    maxY: Math.max(...allBounds.map(b => b.maxY))
  };

  const width = overallBounds.maxX - overallBounds.minX;
  const height = overallBounds.maxY - overallBounds.minY;

  // Create new viewBox that encompasses all paths with padding
  const padding = Math.max(width, height) * 0.1;
  viewBox = `${overallBounds.minX - padding} ${overallBounds.minY - padding} ${width + padding * 2} ${height + padding * 2}`;

  console.error(`📊 Calculated viewBox: ${viewBox}`);
}

// Generate the drawing object
const drawingParts = paths.map((path, index) => ({
  id: `part-${index + 1}`,
  path: path,
  name: `Parte ${index + 1}`
}));

const drawingName = path.basename(svgPath, '.svg');
const emoji = '🎨'; // Default emoji, can be customized

const drawingObject = {
  id: drawingName,
  name: `${emoji} ${drawingName.charAt(0).toUpperCase() + drawingName.slice(1)}`,
  viewBox: viewBox,
  parts: drawingParts
};

// Output as formatted JSON
console.log(JSON.stringify(drawingObject, null, 2));

// Stats
console.error(`\n✅ Processed ${drawingParts.length} parts from ${svgPath}`);
console.error(`📐 ViewBox: ${viewBox}`);
