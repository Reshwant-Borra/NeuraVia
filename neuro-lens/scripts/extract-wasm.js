const fs = require('fs');
const path = require('path');

// Paths
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
const mediapipePath = path.join(nodeModulesPath, '@mediapipe', 'tasks-vision');
const publicMediapipePath = path.join(__dirname, '..', 'public', 'mediapipe');

// WASM files to extract
const wasmFiles = [
  'vision_wasm_internal.wasm',
  'vision_wasm_nosimd_internal.wasm',
  'vision_wasm_threads_internal.wasm'
];

console.log('🔍 Looking for MediaPipe WASM files...');

// Check if @mediapipe/tasks-vision is installed
if (!fs.existsSync(mediapipePath)) {
  console.error('❌ @mediapipe/tasks-vision not found in node_modules');
  console.log('Please run: npm install');
  process.exit(1);
}

// Find the wasm directory
const wasmDir = path.join(mediapipePath, 'wasm');
if (!fs.existsSync(wasmDir)) {
  console.error('❌ WASM directory not found in @mediapipe/tasks-vision');
  process.exit(1);
}

console.log('✅ Found MediaPipe WASM directory');

// Ensure public/mediapipe directory exists
if (!fs.existsSync(publicMediapipePath)) {
  fs.mkdirSync(publicMediapipePath, { recursive: true });
  console.log('📁 Created public/mediapipe directory');
}

// Copy WASM files
let copiedCount = 0;
wasmFiles.forEach(file => {
  const sourcePath = path.join(wasmDir, file);
  const destPath = path.join(publicMediapipePath, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${file}`);
    copiedCount++;
  } else {
    console.log(`⚠️  ${file} not found in source`);
  }
});

if (copiedCount > 0) {
  console.log(`\n🎉 Successfully copied ${copiedCount} WASM files to public/mediapipe/`);
  console.log('The pose detection should now work offline!');
} else {
  console.log('\n❌ No WASM files were copied');
}
