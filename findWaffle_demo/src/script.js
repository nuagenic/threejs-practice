import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";
import { DragControls } from "three/addons/controls/DragControls.js";

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
  leftWallColor: "#ffdbdb",
  rightWallColor: "#6d2727",
  bottomWallColor: "#ea8a8a",
  cubeColor: "#000000",
};

gui.addColor(parameters, "leftWallColor").onChange(() => {
  leftWallMaterial.color.set(parameters.leftWallColor);
});
gui.addColor(parameters, "rightWallColor").onChange(() => {
  rightWallMaterial.color.set(parameters.rightWallColor);
});
gui.addColor(parameters, "bottomWallColor").onChange(() => {
  bottomWallMaterial.color.set(parameters.bottomWallColor);
});
gui.addColor(parameters, "cubeColor").onChange(() => {
  cubeMaterial.color.set(parameters.cubeColor);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/**
 * Wall
 */
// Geometry
const wallGeometry = new THREE.PlaneGeometry(500, 500, 500, 500);

// Material
const leftWallMaterial = new THREE.MeshBasicMaterial({
  color: parameters.leftWallColor,
});
const rightWallMaterial = new THREE.MeshBasicMaterial({
  color: parameters.rightWallColor,
});
const bottomWallMaterial = new THREE.MeshBasicMaterial({
  color: parameters.bottomWallColor,
});

// Mesh
const leftWall = new THREE.Mesh(wallGeometry, leftWallMaterial);
const rightWall = new THREE.Mesh(wallGeometry, rightWallMaterial);
const bottomWall = new THREE.Mesh(wallGeometry, bottomWallMaterial);

leftWall.position.set(0, 250, 250);
leftWall.rotation.y = Math.PI / 2;
rightWall.position.set(250, 250, 0);
bottomWall.position.set(250, 0, 250);
bottomWall.rotation.x = -Math.PI / 2;

scene.add(leftWall, rightWall, bottomWall);

/**
 * Cube
 */
// 추후 조작을 위해 cube가 아닌, cube처럼 보이는 plane 3면을 만들어서 사용
// Geometry
const cubeGeometry = new THREE.PlaneGeometry(45, 45, 45, 45);

// Material
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: parameters.cubeColor,
});

// Mesh
// 단일 큐브 모델 생성
const topSideCubes = [];
const leftSideCubes = [];
const rightSideCubes = [];

for (let i = 0; i < 6; i++) {
  const topSideCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  const leftSideCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  const rightSideCube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  topSideCube.position.set(25, 50, 25);
  topSideCube.rotation.x = -Math.PI / 2;
  leftSideCube.position.set(25, 25, 50);
  rightSideCube.position.set(50, 25, 25);
  rightSideCube.rotation.y = Math.PI / 2;
  topSideCubes.push(topSideCube);
  leftSideCubes.push(leftSideCube);
  rightSideCubes.push(rightSideCube);
}

const cubes = [];
for (let i = 0; i < 6; i++) {
  const cube = [topSideCubes[i], leftSideCubes[i], rightSideCubes[i]];
  cubes.push(cube);
}

// 큐브 그룹 복제본 생성
const cubeGroups = [];
for (let i = 0; i < 6; i++) {
  const cubeGroup = new THREE.Group();
  cubeGroup.add(...cubes[i]);
  cubeGroups.push(cubeGroup);
}

// 큐브 그룹 위치 설정
cubeGroups[0].position.set(0 + 200, 100 + 200, 0 + 200);
cubeGroups[1].position.set(0 + 200, 50 + 200, 50 + 200);
cubeGroups[2].position.set(50 + 200, 50 + 200, 0 + 200);
cubeGroups[3].position.set(0 + 200, 0 + 200, 100 + 200);
cubeGroups[4].position.set(50 + 200, 0 + 200, 50 + 200);
cubeGroups[5].position.set(100 + 200, 0 + 200, 0 + 200);

for (let i = 0; i < 6; i++) {
  scene.add(cubeGroups[i]);
}

/**
 * Raycaster
 */
document.addEventListener("click", onClick, false);

// document.addEventListener("mousedown", onMouseDown, false);
// document.addEventListener("mousemove", onMouseMove, false);
// document.addEventListener("mouseup", onMouseUp, false);

// 클릭 이벤트 핸들러 with Raycaster
function onClick(event) {
  // 마우스 포인터 위치 정규화
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // raycaster
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  // 교차하는 객체가 있는 경우, 해당 객체가 cubeGruoup인지 확인 후 spin 함수 호출
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    if (
      clickedObject.parent instanceof THREE.Group &&
      !cubeGroups.every((cubeGroup) => cubeGroup.spinned === true)
    ) {
      spin(clickedObject.parent);
    }
    // 모든 cubeGroup이 다 회전했을 때,
    if (cubeGroups.every((cubeGroup) => cubeGroup.spinned === true)) {
      controls.enabled = true;
      rotate(clickedObject);
    }
  }
}

function spin(object) {
  // // rotateOnAxis를 사용한 1안. frame rate로 인해 회전의 정확도가 보장되지 않는다.
  //   gsap.to(
  //     {},
  //     {
  //       duration: 1, // 애니메이션의 지속 시간 (초)
  //       onUpdate: function () {
  //         // x, y, z 축을 모두 합친 값으로 회전합니다.
  //         object.rotateOnAxis(
  //           new THREE.Vector3(1, 1, 1).normalize(),
  //           Math.PI / 360
  //         );
  //       },
  //       ease: "none", // 애니메이션의 이징(가속도) 설정
  //       onComplete: function () {
  //         console.log("Animation completed");
  //       },
  //     }
  //   );
  // // roation을 사용한 2안. 원하는 효과 얻어내지 못함.
  //   gsap.to(object.rotation, {
  //     duration: 1,
  //     x: Math.PI / 2,
  //     y: Math.PI / 2,
  //     z: Math.PI / 2,
  //   });
  // setRoationFromAxisAngle을 사용한 3안. 정확도는 높으나 애니메이션 효과가 없다. quaternion 공부 필요.
  gsap.to(
    {},
    {
      duration: 1, // 애니메이션의 지속 시간 (초)
      onUpdate: () => {
        // x, y, z 축을 모두 합친 값으로 회전합니다.
        object.setRotationFromAxisAngle(
          new THREE.Vector3(1, 1, 1).normalize(),
          Math.PI
        );
      },
      ease: "none", // 애니메이션의 이징(가속도) 설정
      onComplete: () => {
        object.spinned = true;
        console.log(object.spinned);
      },
    }
  );
}

function rotate(object) {
  if (draggableObjects.includes(object)) {
    if (topSideCubes.includes(object)) {
      gsap.to(object.rotation, {
        duration: 1,
        y: Math.PI / 2,
      });
    }
    if (leftSideCubes.includes(object)) {
      gsap.to(object.rotation, {
        duration: 1,
        y: Math.PI / 2,
      });
    }
  }
}

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
// Base Camera
const camera = new THREE.OrthographicCamera(
  sizes.width / -2,
  sizes.width / 2,
  sizes.height / 2,
  sizes.height / -2,
  1,
  1000
);
scene.add(camera);
camera.position.set(500, 500, 500);
camera.lookAt(0, 0, 0);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearAlpha(0);

/**
 * Controls
 */
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.update();
const draggableObjects = [
  leftSideCubes[0],
  leftSideCubes[2],
  leftSideCubes[5],
  rightSideCubes[0],
  rightSideCubes[1],
  rightSideCubes[3],
  topSideCubes[3],
  topSideCubes[4],
  topSideCubes[5],
];
const controls = new DragControls(
  draggableObjects,
  camera,
  renderer.domElement
);
controls.enabled = false;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  //   console.log(elapsedTime);

  // Update objects
  //   cubeGroup.rotateOnAxis(new THREE.Vector3(1, 1, 1), Math.PI / 360);
  //   cubeGroup.rotateX(Math.PI / 360);
  //   cubeGroup.rotateY(Math.PI / 360);
  //   cubeGroup.rotateZ(Math.PI / 360);

  //   cubeGroup.rotateOnAxis(new THREE.Vector3(1, 1, 1), Math.PI / 360);
  //   cubeGroup.rotateX(Math.PI / 360);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
tick();
