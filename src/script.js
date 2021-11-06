import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { InteractionManager } from "three.interactive";
import * as dat from "dat.gui";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import firefliesVertexShader from "./shaders/fireflies/vertex.glsl";
import firefliesFragmentShader from "./shaders/fireflies/fragment.glsl";
import rgbVertexShader from "./shaders/rgb/vertex.glsl";
import rgbFragmentShader from "./shaders/rgb/fragment.glsl";
import { Vector2 } from "three";
import { Vector3 } from "three";
import { Color } from "three";
import { water2, wireframe2 } from "./water.js";
import testVertexShader from "./shaders/test/vertex.glsl";
import testFragmentShader from "./shaders/test/fragment.glsl";
import ScrollMagic from "scrollmagic";
//import "ScrollMagic/scrollmagic/minified/plugins/debug.addIndicators.min.js";

// Debug

// gui.domElement.id = "gui";
console.log(firefliesVertexShader);
console.log(firefliesFragmentShader);

console.log(gsap);
const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
// Scene
const scene = new THREE.Scene();
// water2();
// Fog

{
  const near = 1;
  const far = 7;
  const color = "#012b43";
  scene.fog = new THREE.Fog(color, near, far);
  scene.background = new THREE.Color(color);
}

// Models

const gltfLoader = new GLTFLoader();

let landscape3 = new THREE.Object3D();
let ufo = new THREE.Object3D();
let ufo2 = new THREE.Object3D();

let mixer = null;

gltfLoader.load("/models/landscape3.gltf", (gltf) => {
  gltf.scene.scale.set(0.025, 0.025, 0.025);
  gltf.scene.position.set(0, -0.2, 0.9);
  gltf.scene.rotation.set(0.3, 0.3, 0);
  scene.add(gltf.scene);
  // model.name = 'model';
  landscape3 = gltf.scene;

  // Add gltf model to scene
  scene.add(landscape3);
});

gltfLoader.load("/models/ufo3.glb", (gltf) => {
  gltf.scene.scale.set(0.025, 0.025, 0.025);
  gltf.scene.position.set(0, -1, 0);

  ufo = gltf.scene;

  // Add gltf model to scene
  scene.add(ufo);
});

gltfLoader.load("/models/ufo3.glb", (gltf) => {
  gltf.scene.scale.set(0.025, 0.025, 0.025);
  gltf.scene.position.set(0, -7, 3);

  ufo2 = gltf.scene;

  // Add gltf model to scene
  scene.add(ufo2);
});

// Ufo animation

// const flightPath = {
//   curviness: 1.25,
//   autoRotate: true,
//   values: [
//     { x: 100, y: -20 },
//     { x: 300, y: 10 },
//   ],
// };

// const tween = new gsap.timeline();

// gsap.to(ufo2.position, {
//   // bezier: flightPath,
//   ease: "Power1.easeInOut",
//   duration: 1,
//   x: -10,
// });

// const controller = new ScrollMagic.Controller();

// const newScene = new ScrollMagic.Scene({
//   triggerElement: ".scroller",
//   duration: "3000",
// })
//   .addIndicators()
//   .addTo(controller);
console.log(ufo2.position);
// window.addEventListener("load", () => {
//   gsap.to(landscape.position, {
//     duration: 2,
//     delay: 0,
//     repeat: 0,
//     z: 0,
//     x: 0,
//     y: 0,
//     yoyo: false,
//     ease: "slow(0.5, 0.8)",
//   });
// });
var landObject = scene.getObjectByName("landscape3");

// Fireflies
// Geometry
const firefliesGeometry = new THREE.BufferGeometry();
const firefliesCount = 6000;
const positionArray = new Float32Array(firefliesCount * 3);
const positionArray2 = new Float32Array();
const scaleArray = new Float32Array(firefliesCount);

for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3 + 0] = (Math.random() - 0.5) * 25;
  // positionArray[i * 3 + 1] = Math.random() * 1.5 * 10;
  positionArray[i * 3 + 1] = (Math.random() - 0.2) * 10;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 15;

  scaleArray[i] = Math.random();
}

firefliesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);
firefliesGeometry.setAttribute(
  "aScale",
  new THREE.BufferAttribute(scaleArray, 1)
);

firefliesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

//Firefly Material
const firefliesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 50 },
  },
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

// gui
//   .add(firefliesMaterial.uniforms.uSize, "value")
//   .min(1)
//   .max(500)
//   .step(1)about / contact
//   .name("firefliesSize");

//Firefly Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
fireflies.position.z = 1;
fireflies.position.y = -0.5;
scene.add(fireflies);

console.log(positionArray);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = false;
// directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.camera.far = 15;
// directionalLight.shadow.camera.left = -7;
// directionalLight.shadow.camera.top = 7;
// directionalLight.shadow.camera.right = 7;
// directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Textures
let texture = new THREE.TextureLoader().load("/textures/FbStart_thumb.jpg");
let texture2 = new THREE.TextureLoader().load("/textures/BoxTrolls_thumb.jpg");
let texture3 = new THREE.TextureLoader().load(
  "/textures/amazon_huddles_thumb.jpg"
);
let texture4 = new THREE.TextureLoader().load(
  "/textures/nikeAbstract_thumb.jpg"
);

let texture5 = new THREE.TextureLoader().load("/textures/Fox_Sports_thumb.jpg");

let texture6 = new THREE.TextureLoader().load("/textures/IbmWeb_thumb.jpg");

let texture7 = new THREE.TextureLoader().load("/textures/Paranorman_thumb.jpg");
let texture8 = new THREE.TextureLoader().load(
  "/textures/Nissan_Holiday_Spirit_Everyone_thumb.jpg"
);
let texture9 = new THREE.TextureLoader().load("/textures/reactPillows.jpg");

let texture10 = new THREE.TextureLoader().load("/textures/KIA_thumb.jpg");
let texture11 = new THREE.TextureLoader().load("/textures/Kroger_Digital.jpg");
let texture12 = new THREE.TextureLoader().load(
  "/textures/origin_genomics_thumb.jpg"
);
let texture13 = new THREE.TextureLoader().load(
  "/textures/HouseSpecial_Kroger_thumb.jpg"
);
let texture14 = new THREE.TextureLoader().load("/textures/BTeam_thumb.jpg");
let texture15 = new THREE.TextureLoader().load(
  "/textures/safetyDemo_thumb.jpg"
);
let texture16 = new THREE.TextureLoader().load(
  "/textures/Oxfam_Americ_thumb.jpg"
);
let texture17 = new THREE.TextureLoader().load(
  "/textures/VerizonAnthem_thumb.jpg"
);
let texture18 = new THREE.TextureLoader().load(
  "/textures/track_town_thumb.jpg"
);
let texture19 = new THREE.TextureLoader().load("/textures/planters_thumb.jpg");
let texture20 = new THREE.TextureLoader().load(
  "/textures/LAIKA_TRU2011_N2D1_Generic_web_thumb.jpg"
);

// immediately use the texture for material creation
// const material = new THREE.MeshBasicMaterial({ map: texture });

const sizes2 = new THREE.Vector2(2, 1.5); // Mesh size
const offSet = new Vector2(0, 0); // Mesh position
const offSet2 = new Vector2(0, 0); // Mesh position
const planeGeometry = new THREE.PlaneGeometry(1, 0.5, 5, 5);
// console.log(geometry.parameters.width);

// let textureArr = [texture, texture2];

// console.log(texture.id);

// switch (tex) {
//   case textureArr[0].id === 4:
//     tex = texture;
//     break;
//   case textureArr[1].id === 5:
//     tex = texture2;
// }
// let tex = null;
// for (let i = 0; i < textureArr.length; i++) {
//   switch (textureArr[i]) {
//     case textureArr[0]:
//       tex = material1.uniforms.uTexture.value = texture;
//       break;
//     case textureArr[1]:
//       tex = texture2;
//   }
// }

//Debug test
// var text = {
//   message: "dat.gui",
//   speed: 0.8,
//   progress: 0,
//   displayOutline: false,
// };

// var gui = new dat.GUI({ autoPlace: false });
// var menu = gui.addFolder("folder");
// menu.add(text, "message");
// menu.add(text, "speed", -5, 5);
// menu.add(text, "displayOutline");
// menu.add(text, "progress", 0, 1, 0.001);

// var customContainer = document.getElementById("my-gui-container");
// customContainer.appendChild(gui.domElement);
// console.log(text.progress);

// const materialTest = new THREE.ShaderMaterial({
//   uniforms: {
//     time: { value: 1.0 },
//     uTexture: { value: texture19 },
//     uTextureSize: { value: new THREE.Vector2(100, 100) },
//     uCorners: { value: new THREE.Vector4(1, 1, 1, 1) },
//     uResolution: { value: new THREE.Vector2(1200, 1200) },
//     uProgress: { value: 0.0 },
//     resolution: { value: new THREE.Vector2() },
//     uQuadSize: { value: new THREE.Vector2(300, 300) },
//   },
//   vertexShader: testVertexShader,
//   fragmentShader: testFragmentShader,
//   side: THREE.DoubleSide,
//   wireframe: false,

//   // opacity: 0.5,
//   // transparent: true,
// });

// gsap to animate corners

// gsap
//   .timeline()
//   .to(materialTest.uniforms.uCorners.value, {
//     x: 1,
// ease: "expo.in",
// duration: 5,
// })
// .to(
//   materialTest.uniforms.uCorners.value,
//   {
//     y: 1,
// ease: "expo.in",
// duration: 0.1,
//   }
//   // 0.1
// )
// .to(
//   materialTest.uniforms.uCorners.value,
//   {
//     z: 1,
// ease: "expo.in",
// duration: 0.1,
//   }
//   // 0.2
// )
// .to(
//   materialTest.uniforms.uCorners.value,
//   {
//     w: 1,
//     // ease: "expo.in",
//     // duration: 0.1,
//   }
//   // 0.3
// );
// const planeTest = new THREE.Mesh(planeGeometry, materialTest);
// // new THREE.MeshBasicMaterial({ color: "#ff0000" })
// scene.add(planeTest);

// planeTest.postition.set(0, 0, 4);

// planeTest.position.z = 0;
// planeTest.position.y = 0;
// planeTest.position.x = 0;
// planeTest.rotation.z = 0.0;

const material1 = new THREE.ShaderMaterial({
  uniforms: {
    // uTime: { value: 0 },
    time: { value: 1.0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    // uSize: { value: 50 },
    uTexture: { value: texture },
    uCorners: { value: new THREE.Vector4(1, 1, 1, 1) },
    uResolution: { value: new THREE.Vector2(1200, 1200) },
    // uScale: { value: new THREE.Vector2(0.0, 0.0) },
    // uAlpha: { value: 0.0 },
    uProgress: { value: 0.0 },
    uOffset: { value: new THREE.Vector2(0.0, 0.0) },
    scaleX: { type: "f", value: 1.0 },
    scaleY: { type: "f", value: 1.0 },
    scaleZ: { type: "f", value: 1.0 },
    // resolution: { value: new THREE.Vector2() },
    // uQuadSize: { value: new THREE.Vector2(300, 300) },
    // uMouseTest: { value: new THREE.Vector2(0.0, 0.0) },
  },
  vertexShader: rgbVertexShader,
  fragmentShader: rgbFragmentShader,
  side: THREE.DoubleSide,
  wireframe: false,

  // opacity: 0.5,
  // transparent: true,
});
// let tl = gsap
//   .timeline()
//   .to(material1.uniforms.uCorners.value, {
//     x: 1,
//   })
//   .to(material1.uniforms.uCorners.value, {
//     y: 1,
//   });
// const material2 = new THREE.ShaderMaterial({
//   uniforms: {
//     uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },

//     uTexture: {
//       value: texture2,
//     },

//     uOffset: { value: new THREE.Vector2(0.0, 0.0) },
//   },
//   vertexShader: rgbVertexShader,
//   fragmentShader: rgbFragmentShader,
//   side: THREE.DoubleSide,
//   wireframe: false,
// });
let material2 = material1.clone();
material2.uniforms.uTexture.value = texture2;

let material3 = material1.clone();
material3.uniforms.uTexture.value = texture3;

let material4 = material1.clone();
material4.uniforms.uTexture.value = texture4;

let material5 = material1.clone();
material5.uniforms.uTexture.value = texture5;

let material6 = material1.clone();
material6.uniforms.uTexture.value = texture6;

let material7 = material1.clone();
material7.uniforms.uTexture.value = texture7;

let material8 = material1.clone();
material8.uniforms.uTexture.value = texture8;

let material9 = material1.clone();
material9.uniforms.uTexture.value = texture9;

let material10 = material1.clone();
material10.uniforms.uTexture.value = texture10;

let material11 = material1.clone();
material11.uniforms.uTexture.value = texture11;

let material12 = material1.clone();
material12.uniforms.uTexture.value = texture12;

let material13 = material1.clone();
material13.uniforms.uTexture.value = texture13;

let material14 = material1.clone();
material14.uniforms.uTexture.value = texture14;

let material15 = material1.clone();
material15.uniforms.uTexture.value = texture15;

let material16 = material1.clone();
material16.uniforms.uTexture.value = texture16;

let material17 = material1.clone();
material17.uniforms.uTexture.value = texture17;

let material18 = material1.clone();
material18.uniforms.uTexture.value = texture18;

let material19 = material1.clone();
material19.uniforms.uTexture.value = texture19;

let material20 = material1.clone();
material20.uniforms.uTexture.value = texture20;

const plane1 = new THREE.Mesh(planeGeometry, material1);
plane1.name = "plane1";
const plane2 = new THREE.Mesh(planeGeometry, material2);
const plane3 = new THREE.Mesh(planeGeometry, material3);

const plane4 = new THREE.Mesh(planeGeometry, material4);

const plane5 = new THREE.Mesh(planeGeometry, material5);
const plane6 = new THREE.Mesh(planeGeometry, material6);
const plane7 = new THREE.Mesh(planeGeometry, material7);
const plane8 = new THREE.Mesh(planeGeometry, material8);
const plane9 = new THREE.Mesh(planeGeometry, material9);
const plane10 = new THREE.Mesh(planeGeometry, material10);
const plane11 = new THREE.Mesh(planeGeometry, material11);
const plane12 = new THREE.Mesh(planeGeometry, material12);
const plane13 = new THREE.Mesh(planeGeometry, material13);
const plane14 = new THREE.Mesh(planeGeometry, material14);
const plane15 = new THREE.Mesh(planeGeometry, material15);
const plane16 = new THREE.Mesh(planeGeometry, material16);
const plane17 = new THREE.Mesh(planeGeometry, material17);
const plane18 = new THREE.Mesh(planeGeometry, material18);
const plane19 = new THREE.Mesh(planeGeometry, material19);
const plane20 = new THREE.Mesh(planeGeometry, material20);

scene.add(plane1);

scene.add(plane2);

scene.add(plane3);

scene.add(plane4);

plane5.name = "plane5";

scene.add(plane5);

plane6.name = "plane6";

scene.add(plane6);
scene.add(plane7);
scene.add(plane8);
scene.add(plane9);
scene.add(plane10);
scene.add(plane11);
scene.add(plane12);
scene.add(plane13);
scene.add(plane14);
scene.add(plane15);
scene.add(plane16);
scene.add(plane17);
scene.add(plane18);
scene.add(plane19);
scene.add(plane20);

let planeArr = [
  [plane1, plane2, plane3, plane4, plane5],
  [plane6, plane7, plane8, plane9, plane10],
  [plane11, plane12, plane13, plane14, plane15],
  [plane16, plane17, plane18, plane19, plane20],
];
let pos = -2.4;
let pos2 = -2.4;
let pos3 = -2.4;
let pos4 = -2.4;
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

const planePos = () => {
  planeArr[0].forEach((plane) => {
    pos++;
    plane.position.y = pos - 2;
    plane.position.z = 4;
    plane.position.x += getRandomInt(-1.0, 2.0);
    console.log(planeArr[0][2]);
  });
  planeArr[1].forEach((plane) => {
    pos2++;
    plane.position.y = pos2 - 4;
    plane.position.z = 4;
    plane.position.x += getRandomInt(-1.0, 2.0);
  });
  planeArr[2].forEach((plane) => {
    pos3++;
    plane.position.y = pos3 - 6;
    plane.position.z = 4;
    plane.position.x += getRandomInt(-1.0, 2.0);
  });
  planeArr[3].forEach((plane) => {
    pos4++;
    plane.position.y = pos4 - 8;
    plane.position.z = 4;
    plane.position.x += getRandomInt(-1.0, 2.0);
  });
};

plane1.position.set(0, 2, 4);
plane2.position.set(1, 1, 4);
plane3.position.set(0, 0, 4);
plane4.position.set(-1, -1, 4);
plane5.position.set(1, -2, 4);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// let cubeArray = [];
// for (var k = 0; k < 10; k++) {
//   for (var j = 0; j < 10; j++) {
//     for (var i = 0; i < 10; i++) {
//       var object = new THREE.Mesh(geometry, material);
//       object.position.x = i;
//       object.position.y = j;
//       object.position.z = k;
//       cubeArray .push("object");
//       scene.add(object);
//     }
//   }
// }

console.log(sizes);
console.log(planeArr[0][4].position);
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
  document.body.appendChild(renderer.domElement);
  // Update fireflies
  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
    window.devicePixelRatio,
    2
  );
  // renderer.domElement.addEventListener("click", onclick, true);
  // alert("onclick");
  // Update effect composer
  // effectComposer.setSize(sizes.width, sizes.height);
});

const raycaster = new THREE.Raycaster();
let currentIntersect = null;

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  500
);
camera.position.z = 6;
camera.position.y = 1;
scene.add(camera);
scene.add(wireframe2);
scene.add(water2);
console.log(camera);
// gui.add(camera.position, "y").min(-5).max(120);

// Orbit controls
// const controls = new OrbitControls(camera, canvas);
// controls.target.set(0, 0, 0);
// controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// console.log(landscape2.position.y);

// console.log(sideText.innerHTML);
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const objectsToTest = [
    plane1,
    plane2,
    plane3,
    plane4,
    plane5,
    plane6,
    plane7,
    plane8,
    plane9,
    plane10,
    plane11,
    plane12,
    plane13,
    plane14,
    plane15,
    plane16,
    plane17,
    plane18,
    plane19,
    plane20,
  ];
  const intersects = raycaster.intersectObjects(objectsToTest);
  let thumbEase = "expo.inOut";
  // console.log(sideText);
  // object1.name = "object1";
  if (intersects.length) {
    if (!currentIntersect) {
      console.log("mouse enter");
      console.log(intersects[0].object.name);
      // let sideText = document.getElementById("sideText");
      // console.log(sideText);
      // intersects[0].object == plane1
      //   ? (sideText.innerHTML = "Facebook")
      //   : (sideText.innerHTML = "");

      // plane1.object.name == "plane1" ? (sideText.innerHTML = "Facebook") : null;
      // console.log(sideText);
      gsap.to(intersects[0].object.scale, {
        duration: 1,
        delay: 0,
        repeat: 0,
        // onComplete: onComplete,
        z: 1,
        x: 1.5,
        y: 1.5,

        ease: "expo.out",
      });

      // gsap.to(intersects[0].object.rotation, {
      //   duration: 1,
      //   delay: 0,
      //   repeat: 0,
      //   // onComplete: onComplete,
      //   // y: Math.PI / 2,
      //   y: 0.2,

      //   ease: "expo.out",
      // });
      // gsap.to(sideText, {
      //   duration: 1,
      //   delay: 0,
      //   repeat: 0,
      //   // onComplete: onComplete,
      //   z: 0,
      //   x: window.innerWidth * 0.17,
      //   y: 0,
      //   opacity: 1,
      //   ease: "expo.out",
      // });

      // corners distorion effect in
      // gsap
      //   .timeline()
      //   .to(
      //     materialTest.uniforms.uCorners.value,
      //     {
      //       x: 2,
      //       ease: "slow(0.7, 0.7, false)",
      //       delay: 0,
      //       duration: 1,
      //     },
      //     0.03
      //   )
      //   .to(
      //     materialTest.uniforms.uCorners.value,
      //     {
      //       y: 2,
      //       ease: "slow(0.7, 0.7, false)",
      //       duration: 1,
      //     },
      //     0.04
      //   )
      //   .to(
      //     materialTest.uniforms.uCorners.value,
      //     {
      //       z: 2,
      //       ease: "slow(0.7, 0.7, false)",
      //       duration: 1,
      //     },
      //     0.05
      //   )
      //   .to(
      //     materialTest.uniforms.uCorners.value,
      //     {
      //       w: 2,
      //       ease: "back.out(-5.7)",
      //       duration: 1,
      //     },
      //     0.06
      //   );
      console.log(intersects[0].object.scale);
    }
    currentIntersect = intersects[0];
    // intersects[0].object.position.x = mouse.x * 0.2;
    // intersects[0].object.position.y = mouse.y * 0.2;
  } else {
    if (currentIntersect) {
      console.log("mouse leave");
      console.log(currentIntersect.object);
      gsap.to(currentIntersect.object.scale, {
        duration: 1,
        delay: 0,
        repeat: 0,
        // onComplete: onComplete,
        z: 1,
        x: 1,
        y: 1,

        ease: "expo.out",
      });
      // gsap.to(currentIntersect.object.rotation, {
      //   duration: 0.5,
      //   delay: 0,
      //   repeat: 0,
      //   // onComplete: onComplete,
      //   // y: Math.PI / 2,
      //   y: 0,

      //   ease: "power2.out",
      // });
      // gsap.to(sideText, {
      //   duration: 1,
      //   delay: 1,
      //   repeat: 0,
      //   // onComplete: onComplete,
      //   z: 0,
      //   x: 0,
      //   y: 0,
      //   opacity: 0,
      //   ease: "expo.out",
      // });
      // corners distorion effect out
      // gsap
      //   .timeline()
      //   .to(materialTest.uniforms.uCorners.value, {
      //     x: 1,
      //     ease: "expo.out",
      //     delay: 0,
      //     duration: 0.1,
      //   })
      //   .to(
      //     materialTest.uniforms.uCorners.value,
      //     {
      //       y: 1,
      //       ease: "expo.out",
      //       duration: 0.4,
      //     },
      //     0.01
      //   )
      //   .to(
      //     materialTest.uniforms.uCorners.value,
      //     {
      //       z: 1,
      //       ease: "expo.out",
      //       duration: 0.8,
      //     },
      //     0.02
      //   )
      //   .to(
      //     materialTest.uniforms.uCorners.value,
      //     {
      //       w: 1,
      //       ease: "expo.out",
      //       duration: 1.0,
      //     },
      //     0.03
      //   );
    }
    // sideText.innerHTML = "";
    currentIntersect = null;
  }
});
console.log(currentIntersect);

camera.updateMatrixWorld();

let clicked = false;
let toggle = () => {
  clicked = clicked ? false : true;
};

let clicked2 = false;
let toggle2 = () => {
  clicked2 = clicked2 ? false : true;
};

// const domEvents = new THREEx.domEvents(camera, renderer.domElement);

// domEvents.addEventListener(plane1, "click", (event) => {
//   material1.wireframe = true;
// });
var images_modal = document.getElementById("myModal");
var images_modalContact = document.getElementById("myModalContact");
// var videos_modal = document.getElementById('video-model-div');

// When the user clicks anywhere outside of the modal, close it

window.onclick = function (event) {
  var video = document.getElementById("myVideoPlayer");
  function stopVideo() {
    videocontainer.pause();
    videocontainer.currentTime = 0;
  }
  if (event.target == images_modal) {
    images_modal.style.display = "none";
    stopVideo();
  }
  if (event.target == images_modalContact) {
    images_modalContact.style.display = "none";
    contactButton.innerHTML = "about / contact";

    gsap.to(camera.position, {
      y: 0,
      z: 6,
      duration: 1,
      ease: "power3.inOut",
    });
    clicked = false;
  }
};

// window.onclick = function (event) {
//   if (event.target == images_modalContact) {
//     images_modalContact.style.display = "none";
//     gsap.to(camera.position, {
//       keyframes: [{ y: 0, z: 6, duration: 1, ease: "power3.inOut" }],
//     });
//     clicked = false;
//   }
// if (event.target == videos_modal) {
//   videos_modal.style.display = "none";
// }
// };

let contactButton = document.getElementById("contact");
const contact = (event) => {
  contactButton.addEventListener("click", function (event) {
    toggle();
    clicked2 = false;
    clicked
      ? (contactButton.innerHTML = "back")
      : (contactButton.innerHTML = "about / contact");
    console.log(clicked);
    clicked
      ? gsap.to(camera.position, {
          // duration: 3,
          // y: 5,
          // z: 2,
          // ease: "circ.out",
          y: 3,
          z: -3,
          duration: 1,
          ease: "power3.inOut",
        })
      : gsap.to(camera.position, {
          // duration: 3,
          // y: 5,
          // z: 2,
          // ease: "circ.out",
          y: 0,
          z: 6,
          duration: 1,
          ease: "power3.inOut",
        });

    // clicked ? modalsContact() : (images_modal.style.display = "none");
    if (clicked) {
      modalsContact();
      var video = document.getElementById("myVideoPlayer");
      function stopVideo() {
        videocontainer.pause();
        videocontainer.currentTime = 0;
      }
      images_modal.style.display = "none";
      stopVideo();
    }
    if (!clicked) {
      images_modalContact.style.display = "none";
    }
    // gsap.to(camera.position, {
    //   duration: 2,
    //   delay: 1,
    //   repeat: 0,

    //   z: 0,
    //   x: 0,
    //   y: 0,
    //   yoyo: false,
    //   ease: "circ.out",
    // });
  });
};
contact();
let modals = () => {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks on <span> (x), close the modal
  var modalEdge = document.getElementsByClassName(
    "w3-modal-content w3-animate-zoom w3-card-3"
  )[0];
  var video = document.getElementById("videoclip");

  function stopVideo() {
    videocontainer.pause();
    videocontainer.currentTime = 0;
  }

  span.onclick = function () {
    stopVideo();
    modal.style.display = "none";
  };
  modalEdge.onclick = function () {
    stopVideo();
    modal.style.display = "none";
  };
};
//Contact modal
let modalsContact = () => {
  var modal = document.getElementById("myModalContact");
  modal.style.display = "block";

  // Get the <span> element that closes the modal
  var spanContact = document.getElementsByClassName("closeContact")[0];
  // When the user clicks on <span> (x), close the modal

  spanContact.onclick = function () {
    modal.style.display = "none";
    contactButton.innerHTML = "about / contact";
    gsap.to(camera.position, {
      keyframes: [{ y: 0, z: 6, duration: 1, ease: "power3.inOut" }],
    });
    clicked = false;
  };
};
console.log(currentIntersect);
// var video = document.getElementById("myVideoPlayer");
// function playVideo() {
//   video.play();
// }

// var videobutton = document.getElementById("videolink1");
var videocontainer = document.getElementById("videoclip");
var videosource = document.getElementById("mp4video");
var newmp4 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1634854784/FbStartBright_video_V9_ym7azq.mp4";

var newmp42 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1634854777/boxtrolls_uwlqcu.mp4";

var newmp43 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1634950067/Huddle_PushPull_Blue_2021web_tfga7a.mp4";

var newmp44 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1635202662/FA18_RN_React_3DAbstract_v007W_web_a518dl.mp4";

var newmp45 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1635282727/Fox_Sports_web_pcxuaz.mp4";
var newmp46 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1635283250/IbmWeb2_nyae84.mp4";
var newmp47 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1635284068/ParanormanCredits_web2_khcvtx.mp4";
var newmp48 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1635284901/Nissan_Holiday_Spirit_Everyone_web_skw91k.mp4";
var newmp49 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1635285300/FA18_RN_React_Pillows_v007W2_p7zel9.mp4";
var newmp410 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1635285558/KIA_web_bz95z7.mp4";
var newmp411 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1635285791/Kroger_Digital_Engagement_hhp9zg.mp4";
var newmp412 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1635285844/origin_genomics_web_bwwxoj.mp4";
var newmp413 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1635285804/HouseSpecial_Kroger_Refresh_cc6bxq.mp4";
var newmp414 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1635285997/BTeam_web2_djtyoc.mp4";
var newmp415 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1635286387/Toyota_safetyDemo_web_h1uwff.mp4";
var newmp416 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1635286742/Oxfam_GiftBetter_obv985.mp4";
var newmp417 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1635287547/VerizonAnthem_web2_fsion9.mp4";
var newmp418 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1635288168/track_town_web2_vyb4oo.mp4";
var newmp419 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1635288448/planters_afur4u.mp4";
var newmp420 =
  "https://res.cloudinary.com/dvzxotcmb/video/upload/v1635289373/LAIKA_TRU2011_N2D1_Generic_web_d5gffx.mp4";

// document.getElementById("videolink1");
window.addEventListener("click", () => {
  var title = document.getElementById("title");
  var desc = document.getElementById("desc");
  if (currentIntersect) {
    switch (currentIntersect.object) {
      case plane1:
        modals();

        title.innerHTML = "FACEBOOK START";
        desc.innerHTML = "Animation / effects";
        videosource.setAttribute("src", newmp4);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        console.log(plane1.position.z);

        console.log("clicked on object1");
        break;

      case plane2:
        console.log("clicked on object2");
        modals();

        title.innerHTML = "BOXTROLLS";

        desc.innerHTML = "Animation / comp of all elements";
        videosource.setAttribute("src", newmp42);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane3:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "AMAZON";

        desc.innerHTML = "Animation / comp of all elements";
        videosource.setAttribute("src", newmp43);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane4:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "NIKE ABSTRACT";

        desc.innerHTML = "Animation / comp of all elements";
        videosource.setAttribute("src", newmp44);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane5:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "FOX SPORTS";

        desc.innerHTML = "Lighting / particle effects";
        videosource.setAttribute("src", newmp45);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane6:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "IBM THINK";

        desc.innerHTML = "Animation / modeling / effects";
        videosource.setAttribute("src", newmp46);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane7:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "PARANORMAN CREDITS";

        desc.innerHTML = "Animation / comp of all elements";
        videosource.setAttribute("src", newmp47);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane8:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "NISSAN HOLIDAY SPIRIT";

        desc.innerHTML = "Coloring / comp of all elements";
        videosource.setAttribute("src", newmp48);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane9:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "NIKE PILLOWS";

        desc.innerHTML = "Animation / effects";
        videosource.setAttribute("src", newmp49);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane10:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "KIA BLAZERS";

        desc.innerHTML = "Animation / comp of all elements";
        videosource.setAttribute("src", newmp410);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane11:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "KROGER";

        desc.innerHTML = "Animation / effects / comp of all elements";
        videosource.setAttribute("src", newmp411);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane12:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "ORIGIN GENOMICS";

        desc.innerHTML = "Animation / effects / comp of all elements";
        videosource.setAttribute("src", newmp412);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane13:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "KROGER";

        desc.innerHTML = "Animation / effects / comp of all elements";
        videosource.setAttribute("src", newmp413);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane14:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "B-TEAM";

        desc.innerHTML = "Animation / effects / comp of all elements";
        videosource.setAttribute("src", newmp414);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane15:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "TOYOTA";

        desc.innerHTML = "Particle effects / comp";
        videosource.setAttribute("src", newmp415);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane16:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "OXFAM AMERICA";

        desc.innerHTML =
          "Asset creation / comp / animation of secondary elements";
        videosource.setAttribute("src", newmp416);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane17:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "VERIZON ANTHEM";

        desc.innerHTML = "Animation / asset creation / comp of all elements";
        videosource.setAttribute("src", newmp417);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane18:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "NIKE TRACKTOWN VISUALIZATION";

        desc.innerHTML = "Animation / asset creation / comp of all elements";
        videosource.setAttribute("src", newmp418);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane19:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "PLANTERS";

        desc.innerHTML = "Animation / comp of all cg elements";
        videosource.setAttribute("src", newmp419);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
      case plane20:
        console.log("clicked on object3");
        modals();

        title.innerHTML = "TOYS R US";

        desc.innerHTML = "Animation / comp of all cg elements";
        videosource.setAttribute("src", newmp420);
        videocontainer.load();
        console.log(videosource);
        videocontainer.play();

        break;
    }
  }
});

// const mouseOverTest = () => {
//   window.addEventListener("mouseover", () => {
//     console.log("mouse enter");

//     gsap.to(objectsToTest[0], {
//       scale: ((objectsToTest[0].scale.x = 1), (objectsToTest[0].scale.y = 1)),
//     });
//   });
// };
const clock = new THREE.Clock();

// console.log(currentIntersect);
// let landscapeOn = () => {
//   gsap.to(landscape.position, {
//     duration: 1,
//     delay: 0,
//     repeat: 0,
//     z: 0,
//     x: 0,
//     y: 0,
//     yoyo: false,
//     ease: "slow(0.5, 0.8)",
//   });
// };
let y = 0;
let position = 0;

window.addEventListener("wheel", onMouseWheel);
// let div1 = document.getElementById("div1");
// let yScroll = 0;
// let yScroll2 = 0;
let scrollPosition = 0;
let scrollTarget = 0;
// let scrollPosition2 = 0;
let current = 0;
let target3 = 0;
let ease = 0.075;
// let div1 = document.querySelector(".div1");

function onMouseWheel(event) {
  scrollTarget = event.deltaY * 0.0007;
  // yScroll2 = event.deltaY * 0.0007;
}

// let scrollEvent = () => {
//   document.addEventListener("mousewheel", (e) => {
//     scrollTarget = camera.position.y;
//   });
// };
// scrollEvent();
// window.addEventListener("scroll", scrollEvent());

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}
// console.log(materialTest);
// let time = 0;

const tick = () => {
  // console.log(materialTest.uniforms.uResolution);
  // time += 0.05;
  // materialTest.uniforms.time.value = time;
  // materialTest.uniforms.uProgress.value = text.progress;

  // tl.progress(text.progress);

  let ease = 0.95;
  let ease2 = 0.00025;
  scrollPosition += lerp(scrollPosition, scrollTarget, ease) * 0.35;
  scrollPosition *= 0.655;
  scrollTarget *= 0.95;
  // let scr = scrollTarget;
  // console.log(scrollTarget);
  // landscapeOn();
  //renderer.render(scene, camera);
  // target.x = (1 - mouse.x) * 0.2;
  // target.y = (1 - mouse.y) * 0.2;
  const elapsedTime = clock.getElapsedTime();
  // Scroll

  // scrollPosition += yScroll;
  // scrollPosition2 += yScroll2;
  // yScroll *= 0.9;
  // yScroll2 *= 0.9;
  camera.position.y -= scrollPosition;

  // console.log(camera.position.y);
  target.x = mouse.x * 0.08;
  target.y = mouse.y * 0.08;

  material1.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    // -(target.y - offSet.y) * 0.3,
    // offSet.x * 0.0,
    // offSet.x * 0.0,
    // lerp(scrollPosition, scrollTarget, ease) * 0.009
    // (scr *= Math.cos(1) * 0.03),
    lerp(scrollPosition, scrollTarget, ease2) / 2
  );
  // console.log(target2);
  material2.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,

    lerp(scrollPosition, scrollTarget, ease2) / 2
  );
  material3.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    lerp(scrollPosition, scrollTarget, ease2) / 2
  );

  material4.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,

    lerp(scrollPosition, scrollTarget, ease2) / 2
  );

  material5.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,

    lerp(scrollPosition, scrollTarget, ease2) / 2
  );

  material6.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    // -(target.y - offSet.y) * 0.3,
    lerp(scrollPosition, scrollTarget, ease2) / 2
  );

  material7.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );

  material8.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );

  material9.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );

  material10.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );
  material11.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );
  material12.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );
  material13.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );
  material14.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );
  material15.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );
  material16.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );
  material17.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );
  material18.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );
  material19.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );
  material20.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );

  // gsap.to(ufo2.position, {
  //   // bezier: flightPath,
  //   ease: "Power1.easeInOut",
  //   duration: 1,
  //   // x: scrollPosition * 500,
  //   y: -scrollPosition * 500,
  //   // onComplete: (ufo2.position.x = 2),
  // });

  ufo2.position.y = Math.sin(elapsedTime) * 0.5;
  ufo2.position.x += scrollTarget;
  ufo2.rotation.y += scrollTarget;
  // Default camera setting
  camera.rotation.x += 0.1 * (target.y - camera.rotation.x);
  camera.rotation.y += 0.1 * (target.x - camera.rotation.y);
  renderer.render(scene, camera);
  // camera.position.y = y * 0.002;
  // function onMouseWheel(ev) {
  //   event.preventDefault();

  //   camera.position.y += event.deltaY / 1000;

  //   // prevent scrolling beyond a min/max value
  //   camera.position.clampScalar(0, 10);
  // }
  //Clock
  // console.log(camera.rotation.y);

  // ufo.position.x = Math.sin(elapsedTime / 3);
  // ufo.position.z = Math.sin(elapsedTime / 15);

  const ufoAngle = -elapsedTime * 0.18;
  ufo.position.y = Math.sin(elapsedTime);
  ufo.position.x = Math.cos(ufoAngle) * (7 + Math.sin(elapsedTime * 0.32));
  ufo.position.z = Math.sin(ufoAngle) * (8 + Math.sin(elapsedTime * 0.5));
  ufo.rotation.y = elapsedTime;

  // ufo.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
  // Cast a ray
  // raycaster.setFromCamera(mouse, camera);

  // const objectsToTest = [plane1];
  // const intersects = raycaster.intersectObjects(objectsToTest);

  // if (intersects.length) {
  //   if (currentIntersect === null) {
  //     console.log("mouse enter");
  //   }
  //   // mouseOverTest();
  //   currentIntersect = intersects[0];
  // } else {
  //   if (currentIntersect) {
  //     console.log("mouse leave");
  //   }
  //   currentIntersect = null;
  // }

  // for (const object of objectsToTest) {
  //   object.material.color.set("red");
  // }

  // for (const intersect of intersects) {
  //   intersect.object.material.color.set("blue");
  // }

  // if (intersects.length) {
  //   if (currentIntersect === null) {
  //     console.log("mouse enter");
  //   }
  //   currentIntersect = intersects[0];
  // } else {
  //   if (currentIntersect) {
  //     console.log("mouse leave");
  //   }
  //   currentIntersect = null;
  // }

  // Update materials
  firefliesMaterial.uniforms.uTime.value = elapsedTime;

  // plane1On();

  window.requestAnimationFrame(tick);
};

tick();
