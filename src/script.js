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

// Debug
// const gui = new dat.GUI();
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

let landscape = new THREE.Object3D();
let ufo = new THREE.Object3D();

let mixer = null;

gltfLoader.load("/models/landscape.gltf", (gltf) => {
  gltf.scene.scale.set(0.025, 0.025, 0.025);
  gltf.scene.position.set(0, -0.2, 1);

  scene.add(gltf.scene);
  // model.name = 'model';
  landscape = gltf.scene;

  // Add gltf model to scene
  scene.add(landscape);
});

gltfLoader.load("/models/ufo3.glb", (gltf) => {
  gltf.scene.scale.set(0.025, 0.025, 0.025);
  gltf.scene.position.set(0, -1, 0);

  ufo = gltf.scene;

  // Add gltf model to scene
  scene.add(ufo);
});
console.log(ufo);
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
var landObject = scene.getObjectByName("landscape");

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
//   .step(1)
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
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
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

// immediately use the texture for material creation
// const material = new THREE.MeshBasicMaterial({ map: texture });

const sizes2 = new THREE.Vector2(2, 1.5); // Mesh size
const offSet = new Vector2(0, 0); // Mesh position

const planeGeometry = new THREE.PlaneGeometry(0.5, 0.25, 10, 10);
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

const material1 = new THREE.ShaderMaterial({
  uniforms: {
    // uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    // uSize: { value: 50 },
    uTexture: { value: texture },
    // uScale: { value: new THREE.Vector2(0.0, 0.0) },
    // uAlpha: { value: 0.0 },
    uOffset: { value: new THREE.Vector2(0.0, 0.0) },
    scaleX: { type: "f", value: 1.0 },
    scaleY: { type: "f", value: 1.0 },
    scaleZ: { type: "f", value: 1.0 },
    // uMouseTest: { value: new THREE.Vector2(0.0, 0.0) },
  },
  vertexShader: rgbVertexShader,
  fragmentShader: rgbFragmentShader,
  side: THREE.DoubleSide,
  wireframe: false,

  // opacity: 0.5,
  // transparent: true,
});

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
console.log(material2.uniforms.uTexture.value);

let material4 = material1.clone();
material4.uniforms.uTexture.value = texture4;

let material5 = material1.clone();
material5.uniforms.uTexture.value = texture5;

const plane1 = new THREE.Mesh(planeGeometry, material1);

const plane2 = new THREE.Mesh(planeGeometry, material2);
const plane3 = new THREE.Mesh(planeGeometry, material3);

const plane4 = new THREE.Mesh(planeGeometry, material4);

const plane5 = new THREE.Mesh(planeGeometry, material5);
const plane6 = new THREE.Mesh(planeGeometry, material3);
const plane7 = new THREE.Mesh(planeGeometry, material3);
const plane8 = new THREE.Mesh(planeGeometry, material3);
// plane1.position.x = 0;
// plane1.position.y = 1.5;
// plane1.position.z = 3;
// plane1.name = "plane1";

scene.add(plane1);

// plane2.position.x = 2;
// plane2.position.y = 1.5;
// plane2.position.z = 3;
// plane2.name = "plane2";

scene.add(plane2);

// plane3.position.x = -2;
// plane3.position.y = 1.5;
// plane3.position.z = 3;
// plane3.name = "plane1";

scene.add(plane3);

// plane4.position.x = 0;
// plane4.position.y = 0.5;
// plane4.position.z = 3;
// plane4.name = "plane4";

scene.add(plane4);

// plane5.position.x = 2;
// plane5.position.y = 0.5;
// plane5.position.z = 3;
plane5.name = "plane5";

scene.add(plane5);

// plane6.position.x = -2;
// plane6.position.y = 0.5;
// plane6.position.z = 3;
plane6.name = "plane6";

scene.add(plane6);
// scene.add(plane7);
// scene.add(plane8);

let planeArr = [[plane1, plane2, plane3, plane4, plane5], [plane6]];
let pos = -2.4;
let pos2 = -2.4;
const planePos = () => {
  planeArr[0].forEach((plane) => {
    pos++;
    plane.position.y = 1;
    plane.position.z = 4;
    plane.position.x = pos -= 0.2;
  });
  planeArr[1].forEach((plane) => {
    pos2++;
    plane.position.y = 0.5;
    plane.position.z = 4;
    plane.position.x = pos2 -= 0.2;
  });
};
planePos();

// let pos2 = 2.3;
// const planePos2 = () => {
//   planeArr[1].forEach((plane) => {
//     pos2++;
//     plane.position.y = 1;
//     plane.position.z = 4;
//     plane.position.x += pos2 -= 1.8;
//   });
// };
// planePos2();

// const planePos2 = () => {
//   planeArr[1].forEach((plane) => {
//     pos++;
//     plane.position.y = 0;
//     plane.position.z = 4;
//     plane.position.x += pos -= 1.8;
//   });
// };
// planePos2();
console.log(planeArr);

// const group1 = new THREE.Group();
// group1.add(planeArr);

// scene.add(group1);
// Sizes
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
scene.add(camera);
scene.add(wireframe2);
scene.add(water2);
console.log(camera);

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

console.log(landscape.position.y);

// let plane1On = () => {
//   gsap.to(plane1.position, {
//     duration: 1,
//     delay: 0.0,
//     repeat: 0,

//     z: 1.5,
//     x: 0,
//     y: 0,
//     yoyo: false,
//     ease: "slow(0.5, 0.8)",
//   });
// };

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const objectsToTest = [plane1, plane2, plane3, plane4, plane5];
  const intersects = raycaster.intersectObjects(objectsToTest);

  // object1.name = "object1";
  if (intersects.length) {
    if (!currentIntersect) {
      console.log("mouse enter");
      console.log(intersects);

      // gsap.to(intersects[0].object.position, {
      //   duration: 1,
      //   delay: 0,
      //   repeat: 0,
      //   // onComplete: onComplete,
      //   z: 4,
      //   x: 0,
      //   y: 0,
      //   ease: "expo.out",
      // });

      // gsap.to(intersects[0].object.position, {
      //   duration: 1,
      //   delay: 0,
      //   repeat: 0,
      //   // onComplete: onComplete,

      //   z: 0,
      //   x: 0,
      //   y: 0,
      //   ease: "expo.out",
      // });

      gsap.to(intersects[0].object.scale, {
        duration: 1,
        delay: 0,
        repeat: 0,
        // onComplete: onComplete,
        z: 1,
        x: 2,
        y: 2,
        ease: "expo.out",
      });
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
      // gsap.to(currentIntersect.object.position, {
      //   duration: 1,
      //   delay: 0,
      //   repeat: 0,
      //   // onComplete: onComplete,

      //   z: 0,
      //   x: 0,
      //   y: 0,
      //   ease: "expo.out",
      // });
    }

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
    contactButton.innerHTML = "contact";

    gsap.to(camera.position, {
      keyframes: [{ y: 0, z: 6, duration: 1, ease: "power3.inOut" }],
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
      : (contactButton.innerHTML = "contact");
    console.log(clicked);
    clicked
      ? gsap.to(camera.position, {
          // duration: 3,
          // y: 5,
          // z: 2,
          // ease: "circ.out",
          keyframes: [{ y: 3, z: -3, duration: 1, ease: "power3.inOut" }],
        })
      : gsap.to(camera.position, {
          // duration: 3,
          // y: 5,
          // z: 2,
          // ease: "circ.out",
          keyframes: [{ y: 0, z: 6, duration: 1, ease: "power3.inOut" }],
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
    contactButton.innerHTML = "contact";
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
let landscapeOn = () => {
  gsap.to(landscape.position, {
    duration: 1,
    delay: 0,
    repeat: 0,
    z: 0,
    x: 0,
    y: 0,
    yoyo: false,
    ease: "slow(0.5, 0.8)",
  });
};

const tick = () => {
  // landscapeOn();
  //renderer.render(scene, camera);
  // target.x = (1 - mouse.x) * 0.2;
  // target.y = (1 - mouse.y) * 0.2;

  target.x = mouse.x * 0.08;
  target.y = mouse.y * 0.08;

  material1.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );
  material2.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );
  material3.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );

  material4.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );

  material5.uniforms.uOffset.value.set(
    (target.x - offSet.x) * 0.3,
    -(target.y - offSet.y) * 0.3
  );

  // Default camera setting
  camera.rotation.x += 0.1 * (target.y - camera.rotation.x);
  camera.rotation.y += 0.1 * (target.x - camera.rotation.y);
  renderer.render(scene, camera);

  //Clock
  // console.log(camera.rotation.y);
  const elapsedTime = clock.getElapsedTime();
  // ufo.position.x = Math.sin(elapsedTime / 3);
  // ufo.position.z = Math.sin(elapsedTime / 15);

  const ufoAngle = -elapsedTime * 0.18;
  ufo.position.y = Math.sin(elapsedTime);
  ufo.position.x = Math.cos(ufoAngle) * (7 + Math.sin(elapsedTime * 0.32));
  ufo.position.z = Math.sin(ufoAngle) * (7 + Math.sin(elapsedTime * 0.5));
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
