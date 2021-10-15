import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";
import { Color } from "three";
console.log(waterVertexShader);
console.log(waterFragmentShader);

/**
 * Base
 */

// Debug
const gui = new dat.GUI({ width: 340 });
const debugObject = {
  fogNear: 1,
  fogFar: 3,
  fogColor: "#780f00",
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
//scene.background = new THREE.Color("skyblue");
scene.fog = new THREE.Fog(
  debugObject.fogColor,
  debugObject.fogNear,
  debugObject.fogFar
);

scene.background = new THREE.Color(debugObject.fogColor);
const testElevation = { height: 0 };
/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(25, 10, 20, 20);

// Color
debugObject.depthColor = "#186691";
debugObject.surfaceColor = "#9bd8ff";

console.log(testElevation.height);
// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 0 },

    uBigWavesElevation: { value: 0.12 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uBigWavesSpeed: { value: 0.75 },

    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesIterations: { value: 4 },

    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: {
      value: new THREE.Color("#12849d"),
    },

    uFoamColor: { value: new THREE.Color("white") },

    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 10 },

    ...THREE.UniformsLib["fog"],
  },
  wireframe: false,
  fog: true,
});
console.log(waterMaterial);
const waterMaterial2 = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 0 },

    uBigWavesElevation: { value: 0.12 },

    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uBigWavesSpeed: { value: 0.75 },

    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesIterations: { value: 4 },

    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: {
      value: new THREE.Color("white"),
    },

    uFoamColor: { value: new THREE.Color("white") },

    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 5 },
    ...THREE.UniformsLib["fog"],
  },
  wireframe: false,
  fog: true,
});

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

const light = new THREE.AmbientLight(0x404040); // soft white light
light.position.y = 10;
scene.add(light);

var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// wireframe
// var geometry2 = new THREE.WireframeGeometry(geometry); // or EdgesGeometry
// var material2 = new THREE.LineBasicMaterial({
//   color: 0xffffff,
//   transparent: true,
// });
// var wireframe = new THREE.LineSegments(geometry2, material2);
// mesh.add(wireframe);

const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
water.position.y = -1;

scene.add(water);

// wireframe

var geometry2 = new THREE.WireframeGeometry(waterGeometry); // or EdgesGeometry
var material2 = new THREE.LineBasicMaterial({
  color: 0xffffff,
  transparent: true,
});
var wireframe = new THREE.LineSegments(geometry2, waterMaterial2);
// wireframe.material.uniforms.uSurfaceColor.value = { r: 1, g: 1, b: 1 };
console.log(wireframe.material.uniforms.uSurfaceColor.value);
wireframe.rotation.x = -Math.PI * 0.5;
wireframe.position.y = -1;
export default wireframe;
mesh.add(wireframe);
// const debugObject = {
//   // waveDepthColor: "#1e4d40",
//   // waveSurfaceColor: "#4d9aaa",
//   fogNear: 1,
//   fogFar: 3,
//   fogColor: "#8e99a2",
// };
// Debug
gui
  .add(testElevation, "height")
  .min(0)
  .max(1)
  .step(0.001)
  .name("testElevation");

gui
  .add(waterMaterial.uniforms.uBigWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uBigWavesElevation");
gui
  .add(waterMaterial2.uniforms.uBigWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uBigWavesElevationWire");

gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uBigWavesFrequencyX");
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uBigWavesFrequencyY");
gui
  .add(waterMaterial.uniforms.uBigWavesSpeed, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uBigWavesSpeed");

gui
  .add(waterMaterial.uniforms.uSmallWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uSmallWavesElevation");
gui
  .add(waterMaterial.uniforms.uSmallWavesFrequency, "value")
  .min(0)
  .max(30)
  .step(0.001)
  .name("uSmallWavesFrequency");
gui
  .add(waterMaterial.uniforms.uSmallWavesSpeed, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uSmallWavesSpeed");
gui
  .add(waterMaterial.uniforms.uSmallWavesIterations, "value")
  .min(0)
  .max(8)
  .step(1)
  .name("uSmallWavesIterations");
gui
  .addColor(debugObject, "depthColor")
  .name("depthColor")
  .onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
  });

gui
  .addColor(debugObject, "surfaceColor")
  .name("surfaceColor")
  .onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
  });

gui
  .add(waterMaterial.uniforms.uColorOffset, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uColorOffset");
gui
  .add(waterMaterial.uniforms.uColorMultiplier, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uColorMultiplier");
gui
  .addColor(debugObject, "fogColor")
  .name("Fog Color")
  .onChange(() => {
    waterMaterial.uniforms.fogColor.value.set(debugObject.fogColor);
    scene.background.set(debugObject.fogColor);
    scene.fog = new THREE.Fog(
      debugObject.fogColor,
      debugObject.fogNear,
      debugObject.fogFar
    );
  });
// Mesh

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 1, -40);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Update water
  waterMaterial.uniforms.uTime.value = elapsedTime * 0.09;
  waterMaterial2.uniforms.uTime.value = elapsedTime * 0.09;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
export const water2 = water;
export const wireframe2 = wireframe;
