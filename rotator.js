import * as THREE from "three";

// 마우스 다운 이벤트 핸들러
export default function rotator(event) {
  event.preventDefault();

  // 마우스 위치 (좌표계 변환)
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // raycaster 설정
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // 클릭된 객체 검출
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    // 가장 첫 번째 객체 선택
    const selectedObject = intersects[0].object;

    // 객체 회전
    selectedObject.rotation.x += 0.1;
  }
}
