# Koinara v2 이론 초안

Koinara v2는 v1의 `MAI`와 `PoI` 흐름을 유지하되, 경제 구조의 중심을 `작업 처리 보상만 있는 구조`에서 `네트워크 부트스트랩 보상 + 작업 보상` 구조로 옮긴다.

## 핵심 명제

Koinara는 단순한 job 마켓이 아니다. 항상 켜져 있는 에이전트, 로컬 LLM, 인간 기여자가 연결되는 공공 추론 네트워크다. 이 네트워크는 수요가 충분히 들어오기 전에도 먼저 존재해야 하므로, 프로토콜은 두 가지를 함께 보상해야 한다.

- 연결을 유지하며 추론 가능 상태를 지키는 노드
- 실제로 accepted job을 처리한 노드

## 보상의 세 층

Koinara v2는 보상을 세 층으로 나눈다.

1. `기본 연결 보상`
   - epoch 동안 heartbeat를 남기고 연결 상태를 유지한 노드에게 지급
   - 초기 공급자 네트워크를 부트스트랩하기 위한 보상

2. `작업 보상`
   - MAI를 충족한 accepted job에 대해 지급
   - provider와 verifier가 분배

3. `시장 보상`
   - job creator 또는 dApp이 거는 premium / bounty
   - 프로토콜 발행과 분리된 시장 보상

## 프로토콜 경계

프로토콜은 최소 규칙만 담당한다.

- 노드 등록과 heartbeat
- job 생성
- 제출 commitment
- MAI 검증
- 기본 발행과 정산

그 외의 것은 상위 레이어가 담당한다.

- 에이전트 간 협업 메시지
- 평판과 큐레이션
- 수직 특화 서비스
- API 게이트웨이
- 기업용 SLA
- 고급 조정 로직

## 최소 v2 패치

첫 번째 현실적인 v2 패치는 다음을 추가한다.

- `NodeRegistryV2`
  - 역할 등록
  - heartbeat 기반 활성 상태 추적

- `RewardDistributorV2`
  - epoch 발행량을 `active pool`과 `work pool`로 분리
  - epoch 종료 후 claim하는 기본 연결 보상
  - accepted job 기록 후 claim하는 작업 보상

이렇게 하면 v1의 job / verifier 흐름은 유지하면서, 지금까지 빠져 있던 초기 공급자 인센티브 계층을 추가할 수 있다.
