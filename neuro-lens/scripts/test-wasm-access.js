const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MEDIAPIPE_DIR = path.join(__dirname, '..', 'public', 'mediapipe');

console.log('🧪 Testing WASM file accessibility...\n');

// Check if files exist
const wasmFiles = [
  'vision_wasm_internal.wasm',
  'vision_wasm_nosimd_internal.wasm'
];

console.log('📁 Checking local files:');
wasmFiles.forEach(file => {
  const filePath = path.join(MEDIAPIPE_DIR, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`   ✅ ${file}: ${(stats.size / (1024 * 1024)).toFixed(1)}MB`);
  } else {
    console.log(`   ❌ ${file}: Missing`);
  }
});

// Test HTTP access
console.log('\n🌐 Testing HTTP access to localhost:3000...');

const testFile = 'vision_wasm_internal.wasm';
const testUrl = `http://localhost:3000/mediapipe/${testFile}`;

const req = http.get(testUrl, (res) => {
  console.log(`   📡 Status: ${res.statusCode}`);
  console.log(`   📊 Headers:`, res.headers);
  
  if (res.statusCode === 200) {
    console.log('   ✅ WASM file accessible via HTTP');
  } else {
    console.log('   ❌ WASM file not accessible via HTTP');
  }
  
  res.on('data', (chunk) => {
    console.log(`   📦 Received ${chunk.length} bytes`);
  });
  
  res.on('end', () => {
    console.log('   🏁 HTTP request completed');
  });
});

req.on('error', (error) => {
  console.log('   ❌ HTTP request failed:', error.message);
  console.log('   💡 Make sure the dev server is running: npm run dev');
});

req.setTimeout(5000, () => {
  console.log('   ⏰ HTTP request timed out');
  req.destroy();
});

console.log(`   🔗 Testing URL: ${testUrl}`);
console.log('\n💡 If the dev server is not running, start it with: npm run dev');

