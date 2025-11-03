const fs = require('fs');
const path = require('path');

// Load the generated letter paths
const letterPathsFile = path.join(__dirname, '../app/data/letter-paths.json');
const letterPaths = JSON.parse(fs.readFileSync(letterPathsFile, 'utf8'));

const CANVAS_SIZE = 400;

/**
 * Parse an SVG path string and split it into individual strokes
 * Each stroke starts with an 'M' (moveTo) command
 */
function parsePathIntoStrokes(pathString) {
  const strokes = [];

  // Split by M command (which starts a new path/stroke)
  const segments = pathString.split(/M/).filter(s => s.trim().length > 0);

  segments.forEach((segment) => {
    // Add back the M command
    const strokePath = 'M' + segment.trim();
    strokes.push(strokePath);
  });

  return strokes;
}

/**
 * Extract points from an SVG path for the rocket to follow
 * Simplified version - samples points along the path
 */
function generatePointsFromPath(pathString, numPoints = 30) {
  const points = [];

  // This is a simplified approach - extract coordinate pairs
  // In a real implementation, you'd use a library like svg-path-properties
  const coords = pathString.match(/[\d.]+/g);

  if (!coords || coords.length < 4) {
    return [];
  }

  // Sample points along the path
  for (let i = 0; i < coords.length - 1; i += 2) {
    const x = parseFloat(coords[i]);
    const y = parseFloat(coords[i + 1]);

    if (!isNaN(x) && !isNaN(y)) {
      points.push({ x, y });
    }
  }

  // If we have too many points, sample them down
  if (points.length > numPoints) {
    const sampledPoints = [];
    const step = points.length / numPoints;

    for (let i = 0; i < numPoints; i++) {
      const index = Math.floor(i * step);
      sampledPoints.push(points[index]);
    }

    return sampledPoints;
  }

  return points;
}

/**
 * Normalize coordinates to fit within our canvas
 */
function normalizeCoordinates(points, metrics, targetSize = CANVAS_SIZE) {
  if (points.length === 0) return [];

  // Find bounds
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  points.forEach(p => {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  });

  const width = maxX - minX;
  const height = maxY - minY;

  // Calculate scale to fit in canvas with padding
  const padding = targetSize * 0.1; // 10% padding
  const availableWidth = targetSize - (2 * padding);
  const availableHeight = targetSize - (2 * padding);

  const scale = Math.min(
    availableWidth / width,
    availableHeight / height
  );

  // Normalize and center
  return points.map(p => ({
    x: padding + (p.x - minX) * scale,
    y: padding + (p.y - minY) * scale
  }));
}

/**
 * Calculate normalization parameters for all strokes of a letter
 * This ensures all strokes use the same scale and offset
 */
function calculateNormalizationParams(allStrokes, targetSize = CANVAS_SIZE) {
  // Collect all coordinates from all strokes
  const allCoords = [];

  allStrokes.forEach(strokePath => {
    const coordPattern = /([\d.]+)\s+([\d.]+)/g;
    let match;
    while ((match = coordPattern.exec(strokePath)) !== null) {
      allCoords.push({
        x: parseFloat(match[1]),
        y: parseFloat(match[2])
      });
    }
  });

  if (allCoords.length === 0) {
    return { minX: 0, minY: 0, scale: 1, padding: 0 };
  }

  // Find bounds across ALL strokes
  const minX = Math.min(...allCoords.map(c => c.x));
  const minY = Math.min(...allCoords.map(c => c.y));
  const maxX = Math.max(...allCoords.map(c => c.x));
  const maxY = Math.max(...allCoords.map(c => c.y));

  const width = maxX - minX;
  const height = maxY - minY;

  // Calculate scale
  const padding = targetSize * 0.1;
  const availableWidth = targetSize - (2 * padding);
  const availableHeight = targetSize - (2 * padding);

  const scale = Math.min(
    availableWidth / width,
    availableHeight / height
  );

  return { minX, minY, scale, padding };
}

/**
 * Normalize an SVG path string using provided normalization params
 */
function normalizePathString(pathString, params) {
  const { minX, minY, scale, padding } = params;

  // Transform the path string
  const normalizedPath = pathString.replace(
    /([\d.]+)\s+([\d.]+)/g,
    (match, x, y) => {
      const nx = padding + (parseFloat(x) - minX) * scale;
      const ny = padding + (parseFloat(y) - minY) * scale;
      return `${nx.toFixed(2)} ${ny.toFixed(2)}`;
    }
  );

  return normalizedPath;
}

/**
 * Normalize coordinates using provided normalization params
 */
function normalizeCoordinatesWithParams(points, params) {
  const { minX, minY, scale, padding } = params;

  return points.map(p => ({
    x: padding + (p.x - minX) * scale,
    y: padding + (p.y - minY) * scale
  }));
}

/**
 * Process all letters and create stroke-based data
 */
function processLetters() {
  console.log('Processing letter paths into strokes...\n');

  const processedLetters = {};

  Object.keys(letterPaths).forEach(letter => {
    const data = letterPaths[letter];
    console.log(`Processing letter '${letter}'...`);

    // Split into strokes
    const strokePaths = parsePathIntoStrokes(data.path);
    console.log(`  Found ${strokePaths.length} stroke(s)`);

    // Calculate normalization params for ALL strokes together
    // This ensures all strokes are scaled and positioned consistently
    const normParams = calculateNormalizationParams(strokePaths);

    // Process each stroke using the same normalization params
    const strokes = strokePaths.map((strokePath, index) => {
      // Normalize the path using shared params
      const normalizedPath = normalizePathString(strokePath, normParams);

      // Generate points for the rocket to follow
      const rawPoints = generatePointsFromPath(strokePath);
      const normalizedPoints = normalizeCoordinatesWithParams(rawPoints, normParams);

      const startPoint = normalizedPoints[0] || { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.5 };

      console.log(`    Stroke ${index + 1}: ${normalizedPoints.length} points`);

      return {
        path: normalizedPath,
        points: normalizedPoints,
        startPoint: startPoint
      };
    });

    processedLetters[letter] = {
      type: data.type,
      strokes: strokes
    };
  });

  // Save processed data
  const outputPath = path.join(__dirname, '../app/data/letter-strokes.json');
  fs.writeFileSync(outputPath, JSON.stringify(processedLetters, null, 2));

  console.log(`\n✅ Successfully processed ${Object.keys(processedLetters).length} letters`);
  console.log(`📁 Saved to: ${outputPath}`);

  // Print summary
  console.log('\n📊 Summary:');
  Object.keys(processedLetters).forEach(letter => {
    const data = processedLetters[letter];
    console.log(`  ${letter}: ${data.strokes.length} stroke(s), ${data.type}`);
  });
}

// Run the processor
processLetters();
