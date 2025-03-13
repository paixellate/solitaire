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
