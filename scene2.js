/**
 * 카메라 회전 통해 착시 구현할 오브젝트 생성
 */

import * as THREE from "three";

// raw Box 생성
const rawBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
const blueBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const greenBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const redBoxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// stairBox 생성
const cube1 = new THREE.Mesh(rawBoxGeometry, blueBoxMaterial);
cube1.position.set(0, 0, 0);

const cube2 = new THREE.Mesh(rawBoxGeometry, blueBoxMaterial);
cube2.position.set(1, 0, 0);

const cube3 = new THREE.Mesh(rawBoxGeometry, blueBoxMaterial);
cube3.position.set(2, 0, 0);

const cube4 = new THREE.Mesh(rawBoxGeometry, blueBoxMaterial);
cube4.position.set(1, 1, 0);

const cube5 = new THREE.Mesh(rawBoxGeometry, blueBoxMaterial);
cube5.position.set(2, 1, 0);

const cube6 = new THREE.Mesh(rawBoxGeometry, blueBoxMaterial);
cube6.position.set(2, 2, 0);

const stairObject = new THREE.Group();
stairObject.add(cube1);
stairObject.add(cube2);
stairObject.add(cube3);
stairObject.add(cube4);
stairObject.add(cube5);
stairObject.add(cube6);

// 기둥 박스 생성
const columnX = 4;
const cube7 = new THREE.Mesh(rawBoxGeometry, greenBoxMaterial);
cube7.position.set(columnX, 0, -1);

const cube8 = new THREE.Mesh(rawBoxGeometry, greenBoxMaterial);
cube8.position.set(columnX, 1, -1);

const cube9 = new THREE.Mesh(rawBoxGeometry, greenBoxMaterial);
cube9.position.set(columnX, 0, 0);

const cube10 = new THREE.Mesh(rawBoxGeometry, greenBoxMaterial);
cube10.position.set(columnX, 1, 0);

const columnObject = new THREE.Group();
columnObject.add(cube7);
columnObject.add(cube8);
columnObject.add(cube9);
columnObject.add(cube10);

export { stairObject, columnObject };
