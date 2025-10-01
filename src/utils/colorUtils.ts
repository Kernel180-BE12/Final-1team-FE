// 미리 정의된 예쁜 파스텔톤 색상 목록입니다.
const PASTEL_COLORS = [
  '#ffc8dd', // 부드러운 벚꽃 핑크
  '#ffc09f', // 따뜻한 살구색
  '#ffee93', // 은은한 바나나 옐로우
  '#d4f0c7', // 차분한 민트 그린
  '#b6f1f0ff', // 시원한 터키 블루
  '#b4e1fa', // 맑은 하늘색
  '#c7ceea', // 차분한 라벤더
  '#e5d9f2', // 부드러운 연보라
];

/**
 * 주어진 ID를 기반으로 미리 정의된 색상 팔레트에서 색상을 선택하여 반환합니다.
 * @param id - 스페이스 ID와 같은 숫자형 ID
 * @returns {string} 16진수 색상 코드 (예: '#FFADAD')
 */
export const getColorForId = (id: number): string => {
  // ID가 유효하지 않은 경우를 대비하여 기본 색상을 반환합니다.
  if (!id || id <= 0) {
    return PASTEL_COLORS[0];
  }
  // ID를 색상 배열의 길이로 나눈 나머지를 인덱스로 사용합니다.
  // 이렇게 하면 ID가 아무리 커져도 배열의 범위를 벗어나지 않고 순환하게 됩니다.
  // (id - 1)을 하는 이유는, id 1번이 인덱스 0번(첫 번째 색상)을 가리키게 하기 위함입니다.
  const index = (id - 1) % PASTEL_COLORS.length;
  return PASTEL_COLORS[index];
};
