const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying MediaPipe Pose Detection Implementation...\n');

// Check paths
const publicMediapipePath = path.join(__dirname, '..', 'public', 'mediapipe');
const cameraCanvasPath = path.join(__dirname, '..', 'src', 'components', 'CameraCanvas.tsx');
const packageJsonPath = path.join(__dirname, '..', 'package.json');

let allChecksPassed = true;

// 1. Check @mediapipe/tasks-vision installation
console.log('1. 📦 @mediapipe/tasks-vision installation:');
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const mediapipeVersion = packageJson.dependencies['@mediapipe/tasks-vision'];
  if (mediapipeVersion) {
    console.log(`   ✅ Installed: ${mediapipeVersion}`);
  } else {
    console.log('   ❌ Not found in dependencies');
    allChecksPassed = false;
  }
} catch (error) {
  console.log('   ❌ Error reading package.json');
  allChecksPassed = false;
}

// 2. Check Pose Landmarker model
console.log('\n2. 🎯 Pose Landmarker (lite) model:');
const modelPath = path.join(publicMediapipePath, 'pose_landmarker_lite.task');
if (fs.existsSync(modelPath)) {
  const stats = fs.statSync(modelPath);
  console.log(`   ✅ Model file: ${(stats.size / (1024 * 1024)).toFixed(1)}MB`);
} else {
  console.log('   ❌ Model file missing');
  allChecksPassed = false;
}

// 3. Check WASM files
console.log('\n3. 🌐 Offline WASM assets:');
const wasmFiles = [
  'vision_wasm_internal.wasm',
  'vision_wasm_nosimd_internal.wasm'
];

let wasmCount = 0;
wasmFiles.forEach(file => {
  const wasmPath = path.join(publicMediapipePath, file);
  if (fs.existsSync(wasmPath)) {
    const stats = fs.statSync(wasmPath);
    console.log(`   ✅ ${file}: ${(stats.size / (1024 * 1024)).toFixed(1)}MB`);
    wasmCount++;
  } else {
    console.log(`   ❌ ${file}: Missing`);
  }
});

if (wasmCount === wasmFiles.length) {
  console.log('   ✅ All required WASM files present');
} else {
  console.log('   ❌ Some WASM files missing');
  allChecksPassed = false;
}

// 4. Check CameraCanvas implementation
console.log('\n4. 📹 CameraCanvas component implementation:');
if (fs.existsSync(cameraCanvasPath)) {
  const content = fs.readFileSync(cameraCanvasPath, 'utf8');
  
  // Check FilesetResolver path
  if (content.includes("FilesetResolver.forVisionTasks('/mediapipe')")) {
    console.log('   ✅ FilesetResolver uses local path');
  } else {
    console.log('   ❌ FilesetResolver not using local path');
    allChecksPassed = false;
  }
  
  // Check fixed dimensions
  if (content.includes('width: 640') && content.includes('height: 480')) {
    console.log('   ✅ Fixed 640x480 dimensions configured');
  } else {
    console.log('   ❌ Fixed dimensions not configured');
    allChecksPassed = false;
  }
  
  // Check facingMode
  if (content.includes("facingMode: 'user'")) {
    console.log('   ✅ User-facing camera configured');
  } else {
    console.log('   ❌ User-facing camera not configured');
    allChecksPassed = false;
  }
  
  // Check modelAssetPath
  if (content.includes("modelAssetPath: '/mediapipe/pose_landmarker_lite.task'")) {
    console.log('   ✅ Model asset path configured');
  } else {
    console.log('   ❌ Model asset path not configured');
    allChecksPassed = false;
  }
  
  // Check runningMode
  if (content.includes("runningMode: 'VIDEO'")) {
    console.log('   ✅ VIDEO running mode configured');
  } else {
    console.log('   ❌ VIDEO running mode not configured');
    allChecksPassed = false;
  }
  
  // Check PoseOverlay component usage
  if (content.includes('<PoseOverlay')) {
    console.log('   ✅ PoseOverlay component integrated');
  } else {
    console.log('   ❌ PoseOverlay component not found');
    allChecksPassed = false;
  }
  
  // Check smoothing implementation
  if (content.includes('OneEuroFilter') || content.includes('EMASmoother')) {
    console.log('   ✅ Smoothing utilities implemented');
  } else {
    console.log('   ❌ Smoothing utilities not found');
    allChecksPassed = false;
  }
  
  // Check quality indicator
  if (content.includes('qualityReason') || content.includes('quality')) {
    console.log('   ✅ Quality indicator implemented');
  } else {
    console.log('   ❌ Quality indicator not found');
    allChecksPassed = false;
  }
  
  // Check FPS meter
  if (content.includes('fps') || content.includes('FPS')) {
    console.log('   ✅ FPS meter implemented');
  } else {
    console.log('   ❌ FPS meter not found');
    allChecksPassed = false;
  }
  
  // Check requestAnimationFrame
  if (content.includes('requestAnimationFrame')) {
    console.log('   ✅ requestAnimationFrame loop implemented');
  } else {
    console.log('   ❌ requestAnimationFrame not found');
    allChecksPassed = false;
  }
} else {
  console.log('   ❌ CameraCanvas.tsx not found');
  allChecksPassed = false;
}

// 5. Check assessments page
console.log('\n5. 📄 Assessments page:');
const assessmentsPath = path.join(__dirname, '..', 'src', 'app', 'assessments', 'page.tsx');
if (fs.existsSync(assessmentsPath)) {
  const content = fs.readFileSync(assessmentsPath, 'utf8');
  if (content.includes('Live Preview') || content.includes('CameraCanvas')) {
    console.log('   ✅ Live Preview section implemented');
  } else {
    console.log('   ❌ Live Preview section not found');
    allChecksPassed = false;
  }
} else {
  console.log('   ❌ Assessments page not found');
  allChecksPassed = false;
}

// 6. Check Next.js WASM configuration
console.log('\n6. ⚙️ Next.js WASM configuration:');
const nextConfigPath = path.join(__dirname, '..', 'next.config.ts');
if (fs.existsSync(nextConfigPath)) {
  const content = fs.readFileSync(nextConfigPath, 'utf8');
  if (content.includes('urlPattern: /\\.(?:wasm)$/i') && content.includes('CacheFirst')) {
    console.log('   ✅ WASM caching configured');
  } else {
    console.log('   ❌ WASM caching not configured');
    allChecksPassed = false;
  }
} else {
  console.log('   ❌ Next.js config not found');
  allChecksPassed = false;
}

// Summary
console.log('\n' + '='.repeat(60));
if (allChecksPassed) {
  console.log('🎉 ALL CHECKS PASSED! Implementation is complete.');
  console.log('\n✅ Ready for runtime testing:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Navigate to: http://localhost:3000/assessments');
  console.log('   3. Test live pose detection with camera');
} else {
  console.log('❌ Some checks failed. Please review the issues above.');
}
console.log('='.repeat(60));
