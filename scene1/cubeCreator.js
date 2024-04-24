/**
 * 객체의 회전을 통해 길 만들기 효과 보여주기
 */

import * as THREE from "three";

// raw Box 생성
const rawBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
const rawBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const greenBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const redBoxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// Box instance 생성
const cube1 = new THREE.Mesh(rawBoxGeometry, rawBoxMaterial);
cube1.position.set(0, 0, 0);

const cube2 = new THREE.Mesh(rawBoxGeometry, rawBoxMaterial);
cube2.position.set(1, 0, 0);

const cube3 = new THREE.Mesh(rawBoxGeometry, rawBoxMaterial);
cube3.position.set(2, 0, 0);

const cube4 = new THREE.Mesh(rawBoxGeometry, rawBoxMaterial);
cube4.position.set(2, 1, 0);

const object = new THREE.Group();
object.add(cube1);
object.add(cube2);
object.add(cube3);
object.add(cube4);

// 장애물 박스 생성
const greenCube = new THREE.Mesh(rawBoxGeometry, greenBoxMaterial);
const redCube = new THREE.Mesh(rawBoxGeometry, redBoxMaterial);
greenCube.position.set(2, 2, 0);
redCube.position.set(2, 0, 2);

export { object, greenCube, redCube };
