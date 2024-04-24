const angle45 = Math.PI / 4;

const sin45 = Math.sin(angle45);
const cos45 = Math.cos(angle45);

const point1 = { x: 2.5, y: 2.5, z: 0.5 };
const point2 = { x: 3.5, y: 1.5, z: -0.5 };

function distanceBetweenPoints(point1, point2) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  const dz = point2.z - point1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// 거리를 최소화하는 x 값을 구하는 함수
function findMinimumX(point1) {
  const precision = 0.001; // 정밀도
  let angle = 0; // 초기 x 값
  let minDistance = distanceBetweenPoints(point1, {
    x: Math.sin(angle) * cos45 * 20,
    y: sin45 * 20,
    z: Math.cos(angle) * cos45 * 20,
  }); // 초기 거리

  // 거리를 최소화하는 x 값을 찾음
  while (true) {
    angle += precision; // x 값을 증가시킴
    const distance = distanceBetweenPoints(point1, {
      x: Math.sin(angle) * cos45 * 20,
      y: sin45 * 20,
      z: Math.cos(angle) * cos45 * 20,
    });
    if (distance >= minDistance) break; // 거리가 증가하면 반복 종료
    minDistance = distance; // 최소 거리 업데이트
  }

  return angle;
}

console.log(findMinimumX(point1));
