import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { object, greenCube, redCube } from "./scene1";
import { stairObject, columnObject } from "./scene2";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";

// Scene 생성
const scene = new THREE.Scene();

// Camera 생성
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const helper = new THREE.CameraHelper(camera);
scene.add(helper);

// Camera 위치 설정(right-handed)
camera.position.set(0, 0, 20);
camera.lookAt(0, 0, 0);
camera.rotation.x = Math.PI / 2;

// Renderer 생성
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls 생성
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 2;
controls.maxDistance = 30;
controls.maxPolarAngle = controls.minPolarAngle = Math.PI / 4;

controls.update();

// GridHelper, AxesHelper 생성
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Add cube to scene
// scene.add(object);
// scene.add(greenCube);
// scene.add(redCube);
scene.add(stairObject);
scene.add(columnObject);

// Angle 표현할 DOM 지정
const azimuthalInfo = document.querySelector("#azimuthal-info");
const angleInfo = document.querySelector("#angle-info");
const xPosInfo = document.querySelector("#x-pos");
const yPosInfo = document.querySelector("#y-pos");
const zPosInfo = document.querySelector("#z-pos");

// Animation
function animate() {
  requestAnimationFrame(animate);

  // object.rotation.x += 0.01;
  controls.update();

  const azimuthalAngle = controls.getAzimuthalAngle();
  azimuthalInfo.textContent = `Azimuthal Angle(rad): ${azimuthalAngle}`;
  const angle = controls.getAzimuthalAngle() * (180 / Math.PI);
  angleInfo.textContent = `Angle(deg): ${angle}`;

  const xPos = camera.position.x;
  const yPos = camera.position.y;
  const zPos = camera.position.z;
  xPosInfo.textContent = `x: ${xPos}`;
  yPosInfo.textContent = `y: ${yPos}`;
  zPosInfo.textContent = `z: ${zPos}`;

  renderer.render(scene, camera);
}
animate();

// Resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);
