const fs = require('fs');
const path = require('path');

// Read the SVG file
const svgPath = process.argv[2];
if (!svgPath) {
  console.error('Usage: node process-svg-transforms.js <path-to-svg>');
  process.exit(1);
}

const svgContent = fs.readFileSync(svgPath, 'utf-8');

// Extract viewBox from SVG
const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/);
const originalViewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 500 500';
const [vbX, vbY, vbWidth, vbHeight] = originalViewBox.split(' ').map(Number);

console.error(`📦 Original viewBox: ${originalViewBox}`);

// Parse transform matrix - handle Freepik's Y-flip: matrix(1, 0, 0, -1, 0, 500)
function parseTransform(transformStr) {
  if (!transformStr) return { tx: 0, ty: 0, flipY: false, scaleY: 1 };

  // Handle matrix transform
  const matrixMatch = transformStr.match(/matrix\(([^)]+)\)/);
  if (matrixMatch) {
    const values = matrixMatch[1].split(',').map(s => parseFloat(s.trim()));
    // matrix(a, b, c, d, e, f) where:
    // a = scaleX, d = scaleY, e = translateX, f = translateY
    return {
      tx: values[4] || 0,
      ty: values[5] || 0,
      flipY: values[3] < 0, // d < 0 means Y-flip
      scaleY: values[3] || 1
    };
  }

  // Handle translate transform
  const translateMatch = transformStr.match(/translate\(([^)]+)\)/);
  if (translateMatch) {
    const values = translateMatch[1].split(/[\s,]+/).map(s => parseFloat(s.trim()));
    return {
      tx: values[0] || 0,
      ty: values[1] || 0,
      flipY: false,
      scaleY: 1
    };
  }

  return { tx: 0, ty: 0, flipY: false, scaleY: 1 };
}

// Apply transform to a single coordinate pair
function transformPoint(x, y, transform, rootTransform) {
  // First apply local translate
  let newX = x + transform.tx;
  let newY = y + transform.ty;

  // Then apply root transform (Y-flip)
  if (rootTransform.flipY) {
    // For matrix(1, 0, 0, -1, 0, 500): this flips Y axis
    // The formula is: newY = ty - oldY
    // So a point at y=0 becomes y=500, and y=500 becomes y=0
    newY = rootTransform.ty - newY;
  }

  return { x: newX, y: newY };
}

// Transform a path's d attribute
function transformPath(pathData, transform, rootTransform) {
  // This is a simplified transform - it handles the most common commands
  // Split path into commands and coordinates
  const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];

  let transformedPath = '';
  let currentX = 0, currentY = 0;

  for (const cmd of commands) {
    const letter = cmd[0];
    const values = cmd.slice(1).trim().split(/[\s,]+/).filter(v => v).map(Number);

    if (letter === 'M' || letter === 'm') {
      // Move command
      for (let i = 0; i < values.length; i += 2) {
        const x = letter === 'M' ? values[i] : currentX + values[i];
        const y = letter === 'M' ? values[i + 1] : currentY + values[i + 1];
        const transformed = transformPoint(x, y, transform, rootTransform);

        transformedPath += `${i === 0 ? 'M' : 'L'} ${transformed.x.toFixed(4)} ${transformed.y.toFixed(4)} `;
        currentX = x;
        currentY = y;
      }
    } else if (letter === 'L' || letter === 'l') {
      // Line command
      for (let i = 0; i < values.length; i += 2) {
        const x = letter === 'L' ? values[i] : currentX + values[i];
        const y = letter === 'L' ? values[i + 1] : currentY + values[i + 1];
        const transformed = transformPoint(x, y, transform, rootTransform);

        transformedPath += `L ${transformed.x.toFixed(4)} ${transformed.y.toFixed(4)} `;
        currentX = x;
        currentY = y;
      }
    } else if (letter === 'C' || letter === 'c') {
      // Cubic bezier
      for (let i = 0; i < values.length; i += 6) {
        const x1 = letter === 'C' ? values[i] : currentX + values[i];
        const y1 = letter === 'C' ? values[i + 1] : currentY + values[i + 1];
        const x2 = letter === 'C' ? values[i + 2] : currentX + values[i + 2];
        const y2 = letter === 'C' ? values[i + 3] : currentY + values[i + 3];
        const x = letter === 'C' ? values[i + 4] : currentX + values[i + 4];
        const y = letter === 'C' ? values[i + 5] : currentY + values[i + 5];

        const t1 = transformPoint(x1, y1, transform, rootTransform);
        const t2 = transformPoint(x2, y2, transform, rootTransform);
        const t3 = transformPoint(x, y, transform, rootTransform);

        transformedPath += `C ${t1.x.toFixed(4)} ${t1.y.toFixed(4)} ${t2.x.toFixed(4)} ${t2.y.toFixed(4)} ${t3.x.toFixed(4)} ${t3.y.toFixed(4)} `;
        currentX = x;
        currentY = y;
      }
    } else if (letter === 'Z' || letter === 'z') {
      transformedPath += 'Z ';
    }
    // Add more commands as needed (Q, S, T, A, H, V, etc.)
  }

  return transformedPath.trim();
}

// Extract root transform (the Y-flip)
const rootGroupMatch = svgContent.match(/<g[^>]*class="page-1"[^>]*transform="([^"]*)"/);
const rootTransform = rootGroupMatch ? parseTransform(rootGroupMatch[1]) : { tx: 0, ty: 0, flipY: false, scaleY: 1 };

console.error(`🔄 Root transform: flipY=${rootTransform.flipY}, ty=${rootTransform.ty}`);

// Extract all path elements with their transforms
const groupRegex = /<g[^>]*transform="translate\(([^)]+)\)"[^>]*>\s*<path[^>]*d="([^"]*)"/g;
const paths = [];
let match;

while ((match = groupRegex.exec(svgContent)) !== null) {
  const transformStr = `translate(${match[1]})`;
  const pathData = match[2];

  // Skip very small paths
  if (pathData.length < 20) continue;

  const localTransform = parseTransform(transformStr);
  const transformedPath = transformPath(pathData, localTransform, rootTransform);

  paths.push(transformedPath);
}

console.error(`✅ Found ${paths.length} paths`);

// Generate the drawing object
const drawingParts = paths.map((path, index) => ({
  id: `part-${index + 1}`,
  path: path,
  name: `Parte ${index + 1}`
}));

const drawingName = path.basename(svgPath, '.svg');
const emoji = '🎨'; // Default emoji

const drawingObject = {
  id: drawingName,
  name: `${emoji} ${drawingName.charAt(0).toUpperCase() + drawingName.slice(1)}`,
  viewBox: originalViewBox,
  parts: drawingParts
};

// Output as formatted JSON
console.log(JSON.stringify(drawingObject, null, 2));

console.error(`\n🎉 Processed ${drawingParts.length} parts from ${svgPath}`);
console.error(`📐 ViewBox: ${originalViewBox}`);
