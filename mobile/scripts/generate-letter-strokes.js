const fs = require('fs');
const path = require('path');

/**
 * Generate simple geometric letter paths with correct stroke order
 * Each letter is defined programmatically with proper stroke sequence
 */

const CANVAS_SIZE = 400;
const PADDING = 40;
const WIDTH = CANVAS_SIZE - (2 * PADDING);
const HEIGHT = CANVAS_SIZE - (2 * PADDING);

// Helper functions to create path strings
function line(x1, y1, x2, y2) {
  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

function arc(x, y, radius, startAngle, endAngle, counterclockwise = false) {
  const start = {
    x: x + radius * Math.cos(startAngle),
    y: y + radius * Math.sin(startAngle)
  };
  const end = {
    x: x + radius * Math.cos(endAngle),
    y: y + radius * Math.sin(endAngle)
  };
  const largeArc = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
  const sweep = counterclockwise ? 0 : 1;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}

function generatePoints(pathString, numPoints = 30) {
  const coords = pathString.match(/[\d.]+/g);
  if (!coords || coords.length < 4) return [];

  const points = [];
  for (let i = 0; i < coords.length - 1; i += 2) {
    const x = parseFloat(coords[i]);
    const y = parseFloat(coords[i + 1]);
    if (!isNaN(x) && !isNaN(y)) {
      points.push({ x, y });
    }
  }

  // Interpolate to get consistent number of points
  if (points.length < numPoints) {
    const interpolated = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const segmentPoints = Math.ceil(numPoints / (points.length - 1));

      for (let j = 0; j < segmentPoints; j++) {
        const t = j / segmentPoints;
        interpolated.push({
          x: p1.x + (p2.x - p1.x) * t,
          y: p1.y + (p2.y - p1.y) * t
        });
      }
    }
    interpolated.push(points[points.length - 1]);
    return interpolated.slice(0, numPoints);
  }

  return points.slice(0, numPoints);
}

// Define uppercase letters (block style)
const uppercaseLetters = {
  'A': [
    {
      path: line(PADDING + WIDTH * 0.5, PADDING, PADDING, PADDING + HEIGHT),
      description: "Left diagonal stroke"
    },
    {
      path: line(PADDING + WIDTH * 0.5, PADDING, PADDING + WIDTH, PADDING + HEIGHT),
      description: "Right diagonal stroke"
    },
    {
      path: line(PADDING + WIDTH * 0.25, PADDING + HEIGHT * 0.6, PADDING + WIDTH * 0.75, PADDING + HEIGHT * 0.6),
      description: "Horizontal crossbar"
    }
  ],
  'B': [
    {
      path: line(PADDING, PADDING, PADDING, PADDING + HEIGHT),
      description: "Vertical stroke"
    },
    {
      path: `M ${PADDING} ${PADDING} Q ${PADDING + WIDTH * 0.7} ${PADDING} ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT * 0.25} Q ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT * 0.5} ${PADDING} ${PADDING + HEIGHT * 0.5}`,
      description: "Top bump"
    },
    {
      path: `M ${PADDING} ${PADDING + HEIGHT * 0.5} Q ${PADDING + WIDTH * 0.8} ${PADDING + HEIGHT * 0.5} ${PADDING + WIDTH * 0.8} ${PADDING + HEIGHT * 0.75} Q ${PADDING + WIDTH * 0.8} ${PADDING + HEIGHT} ${PADDING} ${PADDING + HEIGHT}`,
      description: "Bottom bump"
    }
  ],
  'C': [
    {
      path: `M ${PADDING + WIDTH} ${PADDING + HEIGHT * 0.2} Q ${PADDING + WIDTH * 0.3} ${PADDING} ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT * 0.5} Q ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT} ${PADDING + WIDTH} ${PADDING + HEIGHT * 0.8}`,
      description: "C curve"
    }
  ],
  'D': [
    {
      path: line(PADDING, PADDING, PADDING, PADDING + HEIGHT),
      description: "Vertical stroke"
    },
    {
      path: `M ${PADDING} ${PADDING} Q ${PADDING + WIDTH} ${PADDING} ${PADDING + WIDTH} ${PADDING + HEIGHT * 0.5} Q ${PADDING + WIDTH} ${PADDING + HEIGHT} ${PADDING} ${PADDING + HEIGHT}`,
      description: "Curved right side"
    }
  ],
  'E': [
    {
      path: line(PADDING, PADDING, PADDING, PADDING + HEIGHT),
      description: "Vertical stroke"
    },
    {
      path: line(PADDING, PADDING, PADDING + WIDTH * 0.8, PADDING),
      description: "Top horizontal"
    },
    {
      path: line(PADDING, PADDING + HEIGHT * 0.5, PADDING + WIDTH * 0.6, PADDING + HEIGHT * 0.5),
      description: "Middle horizontal"
    },
    {
      path: line(PADDING, PADDING + HEIGHT, PADDING + WIDTH * 0.8, PADDING + HEIGHT),
      description: "Bottom horizontal"
    }
  ],
  'F': [
    {
      path: line(PADDING, PADDING, PADDING, PADDING + HEIGHT),
      description: "Vertical stroke"
    },
    {
      path: line(PADDING, PADDING, PADDING + WIDTH * 0.8, PADDING),
      description: "Top horizontal"
    },
    {
      path: line(PADDING, PADDING + HEIGHT * 0.5, PADDING + WIDTH * 0.6, PADDING + HEIGHT * 0.5),
      description: "Middle horizontal"
    }
  ],
  'G': [
    {
      path: `M ${PADDING + WIDTH} ${PADDING + HEIGHT * 0.2} Q ${PADDING + WIDTH * 0.3} ${PADDING} ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT * 0.5} Q ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT} ${PADDING + WIDTH} ${PADDING + HEIGHT * 0.8}`,
      description: "C curve"
    },
    {
      path: line(PADDING + WIDTH, PADDING + HEIGHT * 0.5, PADDING + WIDTH * 0.5, PADDING + HEIGHT * 0.5),
      description: "Horizontal bar"
    }
  ],
  'H': [
    {
      path: line(PADDING, PADDING, PADDING, PADDING + HEIGHT),
      description: "Left vertical"
    },
    {
      path: line(PADDING + WIDTH, PADDING, PADDING + WIDTH, PADDING + HEIGHT),
      description: "Right vertical"
    },
    {
      path: line(PADDING, PADDING + HEIGHT * 0.5, PADDING + WIDTH, PADDING + HEIGHT * 0.5),
      description: "Horizontal crossbar"
    }
  ],
  'I': [
    {
      path: line(PADDING + WIDTH * 0.5, PADDING, PADDING + WIDTH * 0.5, PADDING + HEIGHT),
      description: "Vertical stroke"
    },
    {
      path: line(PADDING + WIDTH * 0.3, PADDING, PADDING + WIDTH * 0.7, PADDING),
      description: "Top horizontal"
    },
    {
      path: line(PADDING + WIDTH * 0.3, PADDING + HEIGHT, PADDING + WIDTH * 0.7, PADDING + HEIGHT),
      description: "Bottom horizontal"
    }
  ],
  'J': [
    {
      path: `M ${PADDING + WIDTH * 0.7} ${PADDING} L ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT * 0.7} Q ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT} ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT}`,
      description: "J stroke with curve"
    }
  ]
};

// Define lowercase letters (simplified cursive style)
const lowercaseLetters = {
  'a': [
    {
      path: `M ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT * 0.3} Q ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT * 0.3} ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT * 0.65} Q ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT} ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT}`,
      description: "Circle part"
    },
    {
      path: line(PADDING + WIDTH * 0.7, PADDING + HEIGHT * 0.3, PADDING + WIDTH * 0.7, PADDING + HEIGHT),
      description: "Vertical stroke"
    }
  ],
  'b': [
    {
      path: line(PADDING + WIDTH * 0.3, PADDING, PADDING + WIDTH * 0.3, PADDING + HEIGHT),
      description: "Vertical stroke"
    },
    {
      path: `M ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT * 0.5} Q ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT * 0.5} ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT * 0.75} Q ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT} ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT}`,
      description: "Bottom bump"
    }
  ],
  'c': [
    {
      path: `M ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT * 0.4} Q ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT * 0.3} ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT * 0.65} Q ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT} ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT * 0.9}`,
      description: "C curve"
    }
  ],
  'd': [
    {
      path: `M ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT * 0.4} Q ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT * 0.3} ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT * 0.65} Q ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT} ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT}`,
      description: "Circle part"
    },
    {
      path: line(PADDING + WIDTH * 0.7, PADDING, PADDING + WIDTH * 0.7, PADDING + HEIGHT),
      description: "Vertical stroke"
    }
  ],
  'e': [
    {
      path: line(PADDING + WIDTH * 0.3, PADDING + HEIGHT * 0.65, PADDING + WIDTH * 0.7, PADDING + HEIGHT * 0.65),
      description: "Horizontal line"
    },
    {
      path: `M ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT * 0.65} Q ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT * 0.3} ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT * 0.3} Q ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT} ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT * 0.9}`,
      description: "Circular stroke"
    }
  ],
  'f': [
    {
      path: `M ${PADDING + WIDTH * 0.6} ${PADDING + HEIGHT * 0.2} Q ${PADDING + WIDTH * 0.5} ${PADDING} ${PADDING + WIDTH * 0.4} ${PADDING + HEIGHT * 0.1} L ${PADDING + WIDTH * 0.4} ${PADDING + HEIGHT}`,
      description: "Curved vertical"
    },
    {
      path: line(PADDING + WIDTH * 0.2, PADDING + HEIGHT * 0.4, PADDING + WIDTH * 0.6, PADDING + HEIGHT * 0.4),
      description: "Crossbar"
    }
  ],
  'g': [
    {
      path: `M ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT * 0.4} Q ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT * 0.3} ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT * 0.65} Q ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT} ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT}`,
      description: "Circle part"
    },
    {
      path: `M ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT * 0.4} L ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT * 1.2} Q ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT * 1.4} ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT * 1.3}`,
      description: "Descender with tail"
    }
  ],
  'h': [
    {
      path: line(PADDING + WIDTH * 0.3, PADDING, PADDING + WIDTH * 0.3, PADDING + HEIGHT),
      description: "Vertical stroke"
    },
    {
      path: `M ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT * 0.4} Q ${PADDING + WIDTH * 0.5} ${PADDING + HEIGHT * 0.3} ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT * 0.4} L ${PADDING + WIDTH * 0.7} ${PADDING + HEIGHT}`,
      description: "Hump and down"
    }
  ],
  'i': [
    {
      path: line(PADDING + WIDTH * 0.5, PADDING + HEIGHT * 0.4, PADDING + WIDTH * 0.5, PADDING + HEIGHT),
      description: "Vertical stroke"
    },
    {
      path: `M ${PADDING + WIDTH * 0.5} ${PADDING + HEIGHT * 0.15} L ${PADDING + WIDTH * 0.5} ${PADDING + HEIGHT * 0.2}`,
      description: "Dot"
    }
  ],
  'j': [
    {
      path: `M ${PADDING + WIDTH * 0.55} ${PADDING + HEIGHT * 0.4} L ${PADDING + WIDTH * 0.55} ${PADDING + HEIGHT * 1.2} Q ${PADDING + WIDTH * 0.55} ${PADDING + HEIGHT * 1.4} ${PADDING + WIDTH * 0.3} ${PADDING + HEIGHT * 1.3}`,
      description: "J stroke with tail"
    },
    {
      path: `M ${PADDING + WIDTH * 0.55} ${PADDING + HEIGHT * 0.15} L ${PADDING + WIDTH * 0.55} ${PADDING + HEIGHT * 0.2}`,
      description: "Dot"
    }
  ]
};

// Process all letters
function generateAllLetters() {
  console.log('Generating letter strokes programmatically...\n');

  const allLetters = {};

  // Process uppercase
  Object.keys(uppercaseLetters).forEach(letter => {
    console.log(`Processing uppercase ${letter}...`);
    const strokes = uppercaseLetters[letter].map(stroke => ({
      path: stroke.path,
      points: generatePoints(stroke.path),
      startPoint: generatePoints(stroke.path)[0] || { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.5 }
    }));

    allLetters[letter] = {
      type: 'uppercase',
      strokes: strokes
    };
    console.log(`  ${strokes.length} stroke(s) created`);
  });

  // Process lowercase
  Object.keys(lowercaseLetters).forEach(letter => {
    console.log(`Processing lowercase ${letter}...`);
    const strokes = lowercaseLetters[letter].map(stroke => ({
      path: stroke.path,
      points: generatePoints(stroke.path),
      startPoint: generatePoints(stroke.path)[0] || { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.5 }
    }));

    allLetters[letter] = {
      type: 'lowercase',
      strokes: strokes
    };
    console.log(`  ${strokes.length} stroke(s) created`);
  });

  // Save to file
  const outputPath = path.join(__dirname, '../app/data/letter-strokes.json');
  fs.writeFileSync(outputPath, JSON.stringify(allLetters, null, 2));

  console.log(`\n✅ Successfully generated ${Object.keys(allLetters).length} letters`);
  console.log(`📁 Saved to: ${outputPath}`);

  // Summary
  console.log('\n📊 Summary:');
  Object.keys(allLetters).forEach(letter => {
    const data = allLetters[letter];
    console.log(`  ${letter}: ${data.strokes.length} stroke(s), ${data.type}`);
  });
}

// Run
generateAllLetters();
