#!/usr/bin/env bash

set -euo pipefail

# Initialize npm project
npm init -y

# Install dependencies
npm install -D typescript vite

# Add Vitest for testing
npm install -D vitest

# Add types for webgl2
npm install -D @types/webgl2

# Set up TypeScript configuration
cat > tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "types": ["vitest/globals", "webgl2"]
  },
  "include": ["src"]
}
EOL

# Add Vitest configuration to vite.config.ts
cat > vite.config.ts << EOL
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
  }
})
EOL

# Create basic HTML file
cat > index.html << EOL
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solitaire</title>
    <style>
      body { 
          margin: 0; 
          overflow: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
      }
      canvas { 
          display: block; 
          width: 70%; 
          aspect-ratio: 16/9;
          min-width: 640px;
          min-height: 360px;
      }
  </style>
</head>
<body>
    <h1>Solitaire</h1>
    <canvas id="glCanvas"></canvas>
    <script type="module" src="/src/main.ts"></script>
</body>
</html>
EOL

# Create basic project structure for WebGL
mkdir -p src

# Create a minimal WebGL starter file
cat > src/main.ts << EOL
// WebGL application entry point
function main() {
  const canvas = document.querySelector('#glCanvas') as HTMLCanvasElement;
  
  // Initialize the GL context
  const gl = canvas.getContext('webgl2');
  
  // Only continue if WebGL is available and working
  if (gl === null) {
    console.error('Unable to initialize WebGL. Your browser may not support it.');
    return;
  }
  
  // Set clear color to black
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);
}

// Run when the page loads
window.onload = main;
EOL

cat > src/sum.ts << EOL
export function sum(a: number, b: number): number {
    return a + b
}
EOL

# Create basic test file
mkdir -p src/__tests__
cat > src/__tests__/sum.test.ts << EOL
import { expect, test } from 'vitest'
import { sum } from '../sum.js'

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
})

test('adds 1 + 2 to not equal 4', () => {
    expect(sum(1, 2)).not.toBe(4)
})
EOL


# Add scripts to package.json
npm pkg set scripts.dev="vite"
npm pkg set scripts.build="vite build"
npm pkg set scripts.preview="vite preview"
npm pkg set scripts.test="vitest"

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
  echo "Creating .gitignore..."
  cat > .gitignore << EOF
node_modules/
dist/
EOF
fi

# Setup git
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
  echo "Setting up Git repository"
  git init
  git config user.name "Paix"
  git config user.email "paixellate@gmail.com"
  git config --list
  git add .
  git commit -m "Initial paixial commit"
fi


echo "Setup complete! Your project is ready."
echo "To start development, run: npm run dev"
echo "To build static app, run: npm run build"
echo "To preview a static app build, run: npm run preview"
echo "To run tests, use: npm test"