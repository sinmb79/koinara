# Koinara: A Peer-to-Peer Collective Inference Network

## 초록

이 문서는 Koinara의 한국어 백서다.

영문 버전은 [`whitepaper.md`](./whitepaper.md)를 참고하라.

Koinara는 집단 추론을 위한 최소 프로토콜이다. 이 프로토콜은 지능, 진실, 최적의 정답 품질을 프로토콜 계층에서 정의하려 하지 않는다. 대신 `Minimum Acceptable Inference (MAI)`와 `Minimum Reward`라는 두 가지 프로토콜 원시 개념만 정의한다. 제출된 응답이 최소 수용 조건을 만족하면, 네트워크는 이를 `Proof of Inference (PoI)`로 기록하고 기준 프로토콜 보상을 발행한다. 속도, 깊이, 명확성, 유용성, 순위, 사용자 만족도처럼 그 이상의 모든 가치는 시장에 맡겨진다. 이러한 설계는 프로토콜을 좁고 중립적이며 체인 독립적으로 유지하면서도, 인간과 AI 에이전트가 동일한 최소 규칙 아래 참여할 수 있게 한다. Koinara v1은 이 모델의 EVM 친화적 참조 구현이다.

## 1. 서론

고급 추론은 점점 더 중앙화된 플랫폼을 통해 제공되고 있다. 그러나 실제 추론 능력은 개인, 조직, 도메인 전문가, 자율 에이전트, AI 시스템 전반에 분산되어 있다. 부족한 것은 더 나은 모델만이 아니다. 수요와 공급이 개방적이고 중립적인 최소 규칙 아래 만날 수 있도록 하는 공유 시장 인프라가 부족하다.

Koinara는 집단 추론이 많은 사람들이 생각하는 것보다 훨씬 더 작은 프로토콜 표면으로도 조정될 수 있다고 본다. 주관적 품질 랭킹, 평판 이데올로기, 거버넌스 오버헤드, 체인 특화 가정을 베이스 레이어에 넣는 대신, Koinara는 더 좁은 질문을 던진다.

개방형 추론 시장이 존재하기 위해 프로토콜이 반드시 정의해야 하는 최소한은 무엇인가?

v1에서 그 답은 의도적으로 엄격하다. 프로토콜이 정의하는 것은 오직 다음 두 가지뿐이다.

1. `Minimum Acceptable Inference`
2. `Minimum Reward`

그 외의 모든 것은 경쟁, 애플리케이션 설계, 혹은 프로토콜 밖의 사회적 조정 영역에 속한다.

## 2. 설계 목표

Koinara는 다섯 가지 설계 목표를 따른다.

### 2.1 최소주의

프로토콜은 개방형 추론 교환에 필요한 최소 조건만 정의해야 한다. 이 최소 조건을 보호하지 않는 복잡성은 베이스 레이어 밖에 남아 있어야 한다.

### 2.2 Permissionless Participation

인간과 AI 에이전트 모두 provider나 verifier로 참여할 수 있어야 한다. 프로토콜은 단일한 행위자 유형, 벤더, 조직을 전제해서는 안 된다.

### 2.3 Market-Driven Quality

프로토콜은 최고의 정답을 코드화하려 해서는 안 된다. 품질은 맥락적이고 시장 특화적이다. Koinara는 오직 응답이 최소 유효성 임계값을 넘었는지만 인정한다.

### 2.4 Neutral Infrastructure

베이스 레이어는 owner-light, governance-light 상태를 유지해야 한다. 추론 가치의 중앙 계획자가 아니라 공유 인프라로 기능해야 한다.

### 2.5 Chain-Independent Theory

프로토콜 로직은 실행 환경을 넘어 개념적으로 이식 가능해야 한다. Koinara v1은 EVM 친화적 참조 구현을 사용하지만, 근본 아이디어는 특정 체인에 묶여 있지 않다.

## 3. 문제 정의

현대의 추론 시스템은 대개 세 가지 계층을 하나의 폐쇄형 제품 안에 묶어 둔다.

- 요청 라우팅
- 응답 생성
- 응답 유효성 판정 및 지불

이 구조는 시장을 개방하기 어렵게 만든다. 사용자는 매칭, 실행, 랭킹, 정산을 모두 하나의 플랫폼에 의존하게 된다. Provider는 개방형 프로토콜 표면에서 경쟁하기 어렵고, verifier는 투명한 최소 유효성 프로세스에 독립적으로 참여하기 어렵다.

Koinara는 이 관심사를 분리한다. 이 프로토콜은 추론 시장의 모든 조정 문제를 해결하려 하지 않는다. 대신 다음을 위한 최소 공용 기반을 제공한다.

- 추론 수요 게시
- 응답 제출
- 응답이 최소 프로토콜 기준을 충족하는지 확인
- 기준을 충족하면 기본 보상 발행

이를 통해 프로토콜이 무엇이 최고의 정답인지 결정하지 않고도, 공통의 정산 및 유효성 계층을 만들 수 있다.

## 4. 핵심 개념

### 4.1 Inference Job

`Inference Job`은 네트워크에서 수요의 기본 단위다. Job은 요청 커밋, 스키마 커밋, 마감 시한, job type, 선택적 시장 프리미엄, 라이프사이클 상태를 정의한다.

### 4.2 Provider

`Provider`는 job에 대한 추론 응답을 제출한다. v1에서 온체인 정식 객체는 전체 응답 payload가 아니라 response hash다.

### 4.3 Verifier

`Verifier`는 제출물이 최소 프로토콜 규칙을 만족하는지 확인한다. v1에서 verifier는 품질 랭킹을 하지 않는다. 오직 최소 기준에 대해 승인하거나 거절한다.

### 4.4 Minimum Acceptable Inference

`Minimum Acceptable Inference (MAI)`는 응답이 프로토콜에 의해 유효하다고 인정받기 위해 필요한 최소 임계값이다.

### 4.5 Proof of Inference

`Proof of Inference (PoI)`는 제출물이 MAI 조건을 만족했고 verifier 프로세스에 의해 최종 확정되었음을 나타내는 프로토콜 기록이다.

### 4.6 KOIN

`KOIN`은 프로토콜 토큰이다. accepted inference reward distribution을 통해서만 발행되며, 프로토콜 cap과 emission schedule의 제약을 받는다.

### 4.7 Market Reward

`Market Reward`는 job에 부착되는 사용자 자금 기반 premium reward다. 이는 프로토콜 발행과 구별되며, 기준 프로토콜 경제가 아니라 시장 수요를 반영한다.

## 5. Minimum Acceptable Inference

Koinara는 프로토콜 유효성과 시장 가치의 명확한 분리를 중심에 둔다. 프로토콜은 어떤 최소 기준을 정의해야 하지만, 그 기준이 곧 품질 우위를 뜻해서는 안 된다.

v1에서 응답이 `Minimum Acceptable Inference`로 인정되려면 다음 조건을 모두 만족해야 한다.

1. `ValidJob`
2. `WithinDeadline`
3. `FormatPass`
4. `NonEmptyResponse`
5. `VerificationPass`

각 조건은 다음과 같이 해석된다.

### 5.1 ValidJob

참조된 job이 실제로 존재하며, 필요한 non-zero commitment와 함께 프로토콜을 통해 생성되었다.

### 5.2 WithinDeadline

응답이 선언된 deadline 이전 또는 그 시점에 제출되었다.

### 5.3 FormatPass

제출물이 유효한 schema commitment를 가진 job에 연결되어 있고, 프로토콜의 최소 구조 규칙 아래 평가될 수 있다.

### 5.4 NonEmptyResponse

응답 commitment가 비어 있지 않다.

### 5.5 VerificationPass

필요한 verifier quorum이 제출물을 승인한다.

이 조건들은 해당 응답이 더 넓은 시장 의미에서 최고의 답, 가장 깊은 답, 가장 빠른 답, 혹은 가장 유용한 답인지에 대해 아무것도 말하지 않는다. MAI는 보편적 진리 판정식이 아니다. 그것은 최소 프로토콜 수용 규칙이다.

## 6. Proof of Inference

PoI는 제출물이 MAI 임계값을 넘었을 때 생성되는 프로토콜 산물이다.

PoI는 다음을 의미한다.

- 유효한 job이 존재했다
- provider가 기한 내에 비어 있지 않은 응답을 제출했다
- 최소 구조 검사가 통과되었다
- verifier quorum이 제출물을 승인했다

PoI가 의미하지 않는 것은 다음과 같다.

- 이 응답이 전역적으로 최적의 정답이라는 것
- 모든 맥락에서 객관적 진실이라는 것
- 시장이 다른 답을 선호할 수 없다는 것
- 사용자 만족이 보장된다는 것

이 구분은 핵심적이다. Koinara는 완전한 인지가 아니라, 최소 수용 가능한 참여를 기록한다.

## 7. 네트워크 역할

Koinara v1은 세 가지 명시적 역할을 정의한다.

### 7.1 Job Creator

Job creator는 inference request commitment를 게시하고, 선택적으로 premium reward를 escrow에 넣음으로써 수요를 연다.

### 7.2 Provider

Provider는 response commitment를 제출하며, 제출물이 accepted 되면 protocol reward와 premium reward의 수취인이 된다.

### 7.3 Verifier

Verifier는 제출물이 최소 규칙을 만족하는지 검사하고, quorum을 향한 approval을 추가하거나 제출물을 reject한다.

프로토콜은 이 역할들이 오직 인간에 의해서만 혹은 오직 AI 시스템에 의해서만 수행된다고 가정하지 않는다. Koinara는 혼합 참여를 전제로 설계된다.

## 8. Job Lifecycle

v1의 lifecycle은 의도적으로 좁다.

### 8.1 상태

- `Created`
- `Open`
- `Submitted`
- `UnderVerification`
- `Accepted`
- `Rejected`
- `Settled`
- `Expired`

### 8.2 전이 흐름

1. Creator가 job을 연다.
2. Provider가 응답을 제출한다.
3. Verifier contract가 제출물을 등록하고 job을 verification 상태로 이동시킨다.
4. Verifier들이 승인하거나 거절한다.
5. Quorum이 충족되면 프로토콜이 PoI를 finalize하고 job을 accepted로 표시한다.
6. 보상이 분배되고 job이 settled 된다.
7. deadline 이전에 유효한 완료가 일어나지 않으면 job은 expired 될 수 있다.

### 8.3 라이프사이클 원칙

Accepted job만 KOIN을 mint한다. Rejected job과 expired job은 프로토콜 발행을 생성하지 않는다.

## 9. Job Type과 Quorum

Koinara v1에는 세 가지 job type이 있다.

- `Simple`
- `General`
- `Collective`

이 type들은 verifier quorum과 reward weight 모두에 영향을 준다.

### 9.1 Verifier Quorum

- `Simple = 1`
- `General = 3`
- `Collective = 5`

### 9.2 Reward Weight

- `Simple = 1`
- `General = 3`
- `Collective = 7`

프로토콜은 이 type들을 깊은 존재론으로 해석하지 않는다. 이들은 v1에서 최소 정산 로직을 위한 가벼운 조정 카테고리다.

## 10. 보상 모델

Koinara는 프로토콜 발행과 시장 보상을 분리한다.

### 10.1 Protocol Reward

Protocol reward는 `KOIN`의 기준 발행이다. 이는 네트워크의 최소 규칙 아래 accepted inference를 보상하기 위해 존재한다.

### 10.2 Market Reward

Market reward는 job creator가 제공하는 선택적 premium이다. 이는 지역적 시장 수요를 표현하며 KOIN 발행과는 구별된다.

### 10.3 Provider Income

Accepted job에 대해:

`ProviderIncome = ProtocolReward + MarketReward`

이 규칙은 프로토콜을 최소 상태로 유지하면서도 시장 주도형 업사이드를 허용한다.

## 11. 토크노믹스

### 11.1 토큰 속성

- Name: `Koinara`
- Symbol: `KOIN`
- Maximum supply: `2,100,000,000 KOIN`

### 11.2 Fair Launch

Koinara는 fair launch 모델을 따른다.

- pre-mine 없음
- founder allocation 없음
- admin mint 없음
- 숨겨진 treasury mint 없음
- accepted inference 밖의 발행 경로 없음

### 11.3 발행 규칙

모든 KOIN은 오직 accepted Proof of Inference reward distribution을 통해서만 유통에 들어간다.

### 11.4 Epoch Emission

v1 참조 모델은 epoch-based halving을 사용한다.

`E_t = E_0 * (1/2)^(floor(t / H))`

여기서:

- `E_0`는 초기 epoch emission
- `t`는 epoch index
- `H`는 halving interval in epochs

특정 job에 대해:

`JobReward = epochEmission(submissionEpoch) * jobWeight`

### 11.5 Reward Split

프로토콜 발행은 다음과 같이 분배된다.

- provider: `70%`
- verifiers: `30%`

v1에서 verifier reward는 승인한 verifier 집합에 균등 분배된다. 정수 반올림으로 생기는 나머지는 stranded unit을 피하기 위해 provider에게 귀속된다.

## 12. 아키텍처

Koinara v1은 네 개의 주요 컨트랙트로 구현된다.

### 12.1 InferenceJobRegistry

Registry는 job과 canonical submission의 lifecycle source of truth다. 또한 premium reward를 escrow하고, premium의 지급 또는 환불을 관리한다.

### 12.2 ProofOfInferenceVerifier

Verifier contract는 MAI condition flag, 중복 없는 verifier approval, rejection, PoI finalization을 추적한다.

### 12.3 RewardDistributor

Distributor는 epoch-based issuance를 계산하고, job weight를 적용하고, protocol reward를 분배하며, premium release를 트리거하고, accepted job을 settle한다.

### 12.4 KOINToken

Token contract는 의도적으로 단순하다. supply cap을 강제하고, minting을 reward distributor로 제한한다.

이러한 분리는 premium reward accounting과 protocol issuance accounting을 명확히 구분한다.

## 13. Ownerless Direction

Koinara는 owner-light 혹은 ownerless에 가까운 프로토콜 성격을 지향한다. v1 참조 구현에서 privileged setup은 시스템 wiring에만 존재한다.

- verifier address 설정
- reward distributor address 설정
- token minter 설정

배포 wiring 이후에는 admin control을 renounce할 수 있다. 이것이 모든 의미에서 완전한 거버넌스 최소화를 뜻하는 것은 아니지만, 신뢰가 필요한 설정 표면을 의도적으로 작게 유지한다.

## 14. 보안과 신뢰 가정

Koinara v1은 무엇을 보장하는지에 대해 의도적으로 절제되어 있다.

v1이 보장하는 것:

- 명시적 job state transition
- 제한된 mint authority
- supply cap enforcement
- duplicate settlement prevention
- duplicate verifier participation prevention
- premium reward와 protocol issuance의 분리

v1이 완전히 해결하지 않는 것:

- verifier sybil resistance
- semantic correctness
- off-chain data availability
- collusion resistance
- universal truth evaluation
- cross-chain settlement

이것들은 v1의 실수가 아니라 의도적 제외다. 최소 프로토콜을 단순하고 조합 가능하게 유지하기 위해서다.

## 15. v1 범위와 제외 항목

Koinara v1은 `Minimum Viable Protocol`이다.

포함:

- on-chain registry
- on-chain verifier flow
- on-chain reward distribution
- capped token issuance
- fair launch token path
- market reward escrow

제외:

- bridge logic
- cross-chain settlement
- zkML
- advanced oracle systems
- DAO governance
- subjective answer ranking
- advanced reputation systems
- autonomous agent mesh coordination

최소 레이어의 유용성이 증명되기 전까지, 프로토콜은 이러한 관심사를 흡수해서는 안 된다.

## 16. 왜 이 최소주의가 중요한가

프로토콜은 종종 가격, 랭킹, 거버넌스, 해석을 한꺼번에 모두 다루려다가 실패한다. 추론 시장에서는 정답성과 가치가 맥락 의존적이기 때문에 이런 유혹이 더 강하다.

Koinara는 반대 방향을 택한다. 천장을 정의하는 대신 바닥을 정의한다. 개방적 참여를 허용하면서도, 프로토콜이 품질에 대한 모든 논쟁을 해결할 수 있다고 가장하지 않는다. 이런 의미에서 Koinara는 지능 시장의 완전한 이론이 아니다. 그것은 그 시장을 위한 최소 조정 레이어다.

이 점이 중요한 이유는 유연성을 보존하기 때문이다.

- 애플리케이션은 quality model로 경쟁할 수 있다
- 시장은 premium pricing으로 경쟁할 수 있다
- 생태계는 최소 프로토콜을 바꾸지 않고 reputation layer를 얹을 수 있다
- 미래의 다른 체인도 동일한 개념 규칙을 채택할 수 있다

## 17. 결론

Koinara는 집단 추론을 위한 가장 작은 유용한 프로토콜을 정의하려는 시도다. 프로토콜을 Minimum Acceptable Inference와 Minimum Reward로 제한함으로써, 베이스 레이어가 지능 품질의 중앙 판정자가 되는 것을 피한다. 대신 인간, AI 에이전트, 애플리케이션이 개방형 추론 시장을 조정할 수 있는 중립적 기반을 제공한다.

v1 참조 구현은 의도적으로 좁다. 이것이 집단 추론 인프라의 최종 형태는 아니다. 그러나 그것은 신뢰 가능한 첫 번째 최소형이다.
