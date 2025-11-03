const TextToSVG = require('text-to-svg');
const fs = require('fs');
const path = require('path');

// Paths to the downloaded fonts
const BLOCK_FONT_PATH = path.join(__dirname, '../assets/fonts/ComicNeue-Bold.ttf');
const CURSIVE_FONT_PATH = path.join(__dirname, '../assets/fonts/Caveat-Bold.ttf');

// Canvas size for consistent scaling
const CANVAS_SIZE = 400;
const FONT_SIZE = 320;

// Letters to convert (A-J for now)
const LETTERS_UPPERCASE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const LETTERS_LOWERCASE = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

async function generateLetterPaths() {
  console.log('Loading fonts...');

  // Load the fonts
  const blockFont = TextToSVG.loadSync(BLOCK_FONT_PATH);
  const cursiveFont = TextToSVG.loadSync(CURSIVE_FONT_PATH);

  const letterData = {};

  // Generate uppercase (block) letters
  console.log('\nGenerating uppercase letters with Comic Neue Bold...');
  LETTERS_UPPERCASE.forEach(letter => {
    const attributes = { fill: 'black' };
    const options = {
      x: 40,
      y: CANVAS_SIZE * 0.75,
      fontSize: FONT_SIZE,
      anchor: 'left baseline',
      attributes: attributes
    };

    const svg = blockFont.getSVG(letter, options);

    // Extract the path 'd' attribute from the SVG
    const pathMatch = svg.match(/d="([^"]+)"/);
    if (pathMatch) {
      const pathData = pathMatch[1];

      // Get the bounding box to understand the letter dimensions
      const metrics = blockFont.getMetrics(letter, options);

      letterData[letter] = {
        type: 'uppercase',
        path: pathData,
        metrics: {
          width: metrics.width,
          height: metrics.height,
          ascender: metrics.ascender,
          descender: metrics.descender
        }
      };

      console.log(`  ${letter}: Generated path with ${pathData.length} characters`);
    }
  });

  // Generate lowercase (cursive) letters
  console.log('\nGenerating lowercase letters with Caveat...');
  LETTERS_LOWERCASE.forEach(letter => {
    const attributes = { fill: 'black' };
    const options = {
      x: 40,
      y: CANVAS_SIZE * 0.75,
      fontSize: FONT_SIZE,
      anchor: 'left baseline',
      attributes: attributes
    };

    const svg = cursiveFont.getSVG(letter, options);

    // Extract the path 'd' attribute from the SVG
    const pathMatch = svg.match(/d="([^"]+)"/);
    if (pathMatch) {
      const pathData = pathMatch[1];

      // Get the bounding box
      const metrics = cursiveFont.getMetrics(letter, options);

      letterData[letter] = {
        type: 'lowercase',
        path: pathData,
        metrics: {
          width: metrics.width,
          height: metrics.height,
          ascender: metrics.ascender,
          descender: metrics.descender
        }
      };

      console.log(`  ${letter}: Generated path with ${pathData.length} characters`);
    }
  });

  // Save to JSON file
  const outputPath = path.join(__dirname, '../app/data/letter-paths.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(letterData, null, 2));

  console.log(`\n✅ Successfully generated paths for ${Object.keys(letterData).length} letters`);
  console.log(`📁 Saved to: ${outputPath}`);

  // Generate a preview SVG for letter 'A' and 'a'
  generatePreviewSVG(letterData, 'A');
  generatePreviewSVG(letterData, 'a');
}

function generatePreviewSVG(letterData, letter) {
  const data = letterData[letter];
  if (!data) return;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" fill="#FFC107"/>
  <path d="${data.path}" fill="none" stroke="white" stroke-width="3" stroke-dasharray="15,15" opacity="0.7"/>
  <path d="${data.path}" fill="white" opacity="0.3"/>
</svg>`;

  const previewPath = path.join(__dirname, `../assets/preview-${letter}.svg`);
  fs.writeFileSync(previewPath, svg);
  console.log(`📄 Preview SVG for '${letter}' saved to: ${previewPath}`);
}

// Run the generator
generateLetterPaths().catch(err => {
  console.error('❌ Error generating letter paths:', err);
  process.exit(1);
});
