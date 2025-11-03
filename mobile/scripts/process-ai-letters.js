const fs = require('fs');
const path = require('path');

/**
 * Process AI-generated letter paths and add points for the rocket to follow
 */

// Paste the ChatGPT JSON here
const aiGeneratedLetters = {
  "A": {
    "type": "uppercase",
    "strokes": [
      {
        "path": "M 200 40 L 40 360",
        "description": "Left diagonal stroke from top to bottom-left"
      },
      {
        "path": "M 200 40 L 360 360",
        "description": "Right diagonal stroke from top to bottom-right"
      },
      {
        "path": "M 110 216 L 290 216",
        "description": "Horizontal crossbar from left to right"
      }
    ]
  },
  "B": {
    "type": "uppercase",
    "strokes": [
      {
        "path": "M 80 40 L 80 360",
        "description": "Vertical stem from top to bottom"
      },
      {
        "path": "M 80 40 Q 300 40 300 120 Q 300 200 80 200",
        "description": "Upper semicircle from top of stem, curving right and back to midline"
      },
      {
        "path": "M 80 200 Q 320 200 320 280 Q 320 360 80 360",
        "description": "Lower semicircle from midline, curving right and back to bottom"
      }
    ]
  },
  "C": {
    "type": "uppercase",
    "strokes": [
      {
        "path": "M 340 120 Q 280 40 200 40 Q 80 40 80 200 Q 80 360 200 360 Q 280 360 340 280",
        "description": "Single counterclockwise curve from upper-right around to lower-right"
      }
    ]
  },
  "D": {
    "type": "uppercase",
    "strokes": [
      {
        "path": "M 80 40 L 80 360",
        "description": "Vertical stem from top to bottom"
      },
      {
        "path": "M 80 40 Q 340 40 340 200 Q 340 360 80 360",
        "description": "Outer bowl curve from top to bottom, returning to the stem"
      }
    ]
  },
  "E": {
    "type": "uppercase",
    "strokes": [
      {
        "path": "M 100 40 L 100 360",
        "description": "Vertical stem from top to bottom"
      },
      {
        "path": "M 100 40 L 320 40",
        "description": "Top horizontal bar from left to right"
      },
      {
        "path": "M 100 200 L 280 200",
        "description": "Middle horizontal bar from left to right"
      },
      {
        "path": "M 100 360 L 320 360",
        "description": "Bottom horizontal bar from left to right"
      }
    ]
  },
  "F": {
    "type": "uppercase",
    "strokes": [
      {
        "path": "M 100 40 L 100 360",
        "description": "Vertical stem from top to bottom"
      },
      {
        "path": "M 100 40 L 320 40",
        "description": "Top horizontal bar from left to right"
      },
      {
        "path": "M 100 200 L 260 200",
        "description": "Middle horizontal bar from left to right"
      }
    ]
  },
  "G": {
    "type": "uppercase",
    "strokes": [
      {
        "path": "M 340 120 Q 280 40 200 40 Q 80 40 80 200 Q 80 360 200 360 Q 320 360 340 280",
        "description": "Large counterclockwise curve like a 'C'"
      },
      {
        "path": "M 200 220 L 340 220",
        "description": "Inner horizontal bar from left to right"
      }
    ]
  },
  "H": {
    "type": "uppercase",
    "strokes": [
      {
        "path": "M 80 40 L 80 360",
        "description": "Left vertical stem from top to bottom"
      },
      {
        "path": "M 320 40 L 320 360",
        "description": "Right vertical stem from top to bottom"
      },
      {
        "path": "M 80 200 L 320 200",
        "description": "Middle crossbar from left to right"
      }
    ]
  },
  "I": {
    "type": "uppercase",
    "strokes": [
      {
        "path": "M 120 40 L 280 40",
        "description": "Top horizontal cap from left to right"
      },
      {
        "path": "M 200 40 L 200 360",
        "description": "Central vertical stroke from top to bottom"
      },
      {
        "path": "M 120 360 L 280 360",
        "description": "Bottom horizontal cap from left to right"
      }
    ]
  },
  "J": {
    "type": "uppercase",
    "strokes": [
      {
        "path": "M 120 40 L 300 40",
        "description": "Top horizontal bar from left to right"
      },
      {
        "path": "M 300 40 L 300 300 Q 300 360 220 360 Q 180 360 160 340",
        "description": "Long downstroke with leftward hook at the bottom"
      }
    ]
  }
};

/**
 * Generate points along an SVG path for the rocket to follow
 */
function generatePoints(pathString) {
  const points = [];

  // Parse the path commands
  const commands = pathString.match(/[MLQC]\s*[\d.\s]+/g) || [];

  for (const cmd of commands) {
    const type = cmd[0];
    const coords = cmd.slice(1).trim().match(/[\d.]+/g)?.map(Number) || [];

    if (type === 'M' || type === 'L') {
      // MoveTo or LineTo: interpolate many points along the line
      const lastPoint = points[points.length - 1];
      if (coords.length >= 2) {
        const startX = lastPoint ? lastPoint.x : coords[0];
        const startY = lastPoint ? lastPoint.y : coords[1];
        const endX = coords[0];
        const endY = coords[1];

        // Calculate distance to determine how many points we need
        const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const numPoints = Math.max(Math.ceil(distance / 8), 2); // Point every 8 pixels

        for (let i = 0; i <= numPoints; i++) {
          const t = i / numPoints;
          points.push({
            x: startX + (endX - startX) * t,
            y: startY + (endY - startY) * t
          });
        }
      }
    } else if (type === 'Q' && coords.length >= 4) {
      // Quadratic Bezier: interpolate curve with more points
      const lastPoint = points[points.length - 1] || { x: 0, y: 0 };
      const cpx = coords[0], cpy = coords[1];
      const endx = coords[2], endy = coords[3];

      // More points for curves - 30 instead of 10
      for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        const t1 = 1 - t;
        const x = t1 * t1 * lastPoint.x + 2 * t1 * t * cpx + t * t * endx;
        const y = t1 * t1 * lastPoint.y + 2 * t1 * t * cpy + t * t * endy;
        points.push({ x, y });
      }
    } else if (type === 'C' && coords.length >= 6) {
      // Cubic Bezier: interpolate curve with more points
      const lastPoint = points[points.length - 1] || { x: 0, y: 0 };
      const cp1x = coords[0], cp1y = coords[1];
      const cp2x = coords[2], cp2y = coords[3];
      const endx = coords[4], endy = coords[5];

      // More points for curves - 30 instead of 10
      for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        const t1 = 1 - t;
        const x = t1 * t1 * t1 * lastPoint.x + 3 * t1 * t1 * t * cp1x + 3 * t1 * t * t * cp2x + t * t * t * endx;
        const y = t1 * t1 * t1 * lastPoint.y + 3 * t1 * t1 * t * cp1y + 3 * t1 * t * t * cp2y + t * t * t * endy;
        points.push({ x, y });
      }
    }
  }

  return points;
}

/**
 * Process all letters
 */
function processLetters() {
  console.log('Processing AI-generated letters...\n');

  const processedLetters = {};

  Object.keys(aiGeneratedLetters).forEach(letter => {
    const data = aiGeneratedLetters[letter];
    console.log(`Processing '${letter}' (${data.type})...`);

    const strokes = data.strokes.map((stroke, idx) => {
      const points = generatePoints(stroke.path);
      console.log(`  Stroke ${idx + 1}: ${points.length} points - ${stroke.description}`);

      return {
        path: stroke.path,
        points: points,
        startPoint: points[0] || { x: 200, y: 200 }
      };
    });

    processedLetters[letter] = {
      type: data.type,
      strokes: strokes
    };
  });

  // Save to file
  const outputPath = path.join(__dirname, '../app/data/letter-strokes.json');
  fs.writeFileSync(outputPath, JSON.stringify(processedLetters, null, 2));

  console.log(`\n✅ Successfully processed ${Object.keys(processedLetters).length} letters`);
  console.log(`📁 Saved to: ${outputPath}`);

  // Summary
  console.log('\n📊 Summary:');
  Object.keys(processedLetters).forEach(letter => {
    const data = processedLetters[letter];
    console.log(`  ${letter}: ${data.strokes.length} stroke(s), ${data.type}`);
  });
}

// Run
processLetters();
