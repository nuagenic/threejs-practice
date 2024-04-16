import * as THREE from "three";

// Geometry 생성
const geometry = new THREE.BoxGeometry(3, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

export default cube;
