# Koinara Whitepaper Appendices

이 문서는 Koinara 메인 백서의 companion appendix다.

영문 버전은 [`whitepaper-appendices.md`](./whitepaper-appendices.md)를 참고하라.

메인 백서가 프로토콜의 논지와 최소 메커니즘을 제시한다면, 이 appendix는 배포 프로파일, 이식성 메모, 컨트랙트 매핑, 파라미터 참조를 모아두는 문서다.

## Appendix A. Deployment Profiles

Koinara는 여러 배포 profile을 가질 수 있는 체인 독립 프로토콜로 설계된다.

권장 profile category는 다음과 같다.

- local development profile
- EVM-compatible production profile
- Worldland-oriented profile
- future non-EVM compatibility profiles

배포 가정이 달라져도 프로토콜 이론은 안정적으로 유지되어야 한다.

## Appendix B. Reference Deployment: Worldland

Worldland는 Koinara v1 배포를 위한 자연스러운 참조 환경이다. EVM 친화적 조건을 유지하면서도 최소 프로토콜 모델을 바꾸지 않기 때문이다.

이 profile에서는:

- KOIN 발행이 계속 PoI에 연결되고
- job, verification, settlement가 온체인에 유지되며
- premium reward는 native asset 기반으로 남을 수 있다

이 appendix에서 Worldland는 프로토콜 의존성이 아니라 reference deployment profile이다.

## Appendix C. EVM-Compatible Deployment

어떤 EVM-compatible 환경이든 다음을 지원하면 v1 참조 컨트랙트를 호스팅할 수 있다.

- 표준 contract deployment
- premium reward를 위한 native-asset escrow
- hash commitment
- deterministic state transition

참조 구현은 EVM-compatible chain 전반에서 프로토콜 개념이 읽히도록 의도적으로 작성되었다.

## Appendix D. Solana Deployment Model

Solana 지향 배포는 동일한 개념 모델을 유지하면서, job, receipt, reward logic를 Solana-native account와 program 구조로 사상하게 될 것이다.

이 appendix는 v1에서 비규범적이다. 완성된 구현이 아니라 이식 가능성을 보여준다.

## Appendix E. Bitcoin Anchoring Model

Bitcoin anchoring은 향후 timestamping, commitment finality, cross-system auditability를 위해 사용될 수 있다. 그러나 Koinara settlement 자체를 Bitcoin-native로 강제하지는 않는다.

이 appendix 역시 v1에서 비규범적이다. 구현 기능이라기보다 가능한 anchoring 방향을 설명한다.

## Appendix F. Reference Contracts and Code Notes

v1 참조 구현은 네 개의 주요 컨트랙트로 구성된다.

- `InferenceJobRegistry`
- `ProofOfInferenceVerifier`
- `RewardDistributor`
- `KOINToken`

### F.1 논리 아키텍처

Koinara는 네 개의 논리 계층으로 구성된다.

1. Job Layer
2. Provider Layer
3. Verification Layer
4. Settlement Layer

### F.2 Contract Mapping Note

주요 아키텍처 도식은 메인 백서의 Section 6에 실려 있다. 이 appendix는 그 계층을 v1 참조 컨트랙트에 대응시킨다.

- `Job Layer` -> `InferenceJobRegistry`
- `Verification Layer` -> `ProofOfInferenceVerifier`
- `Settlement Layer` -> `RewardDistributor`
- `Issuance Asset` -> `KOINToken`

이 매핑은 메인 백서를 읽기 쉬운 형태로 유지하면서도, 추상적인 프로토콜 계층을 구체적인 참조 코드베이스와 연결해 준다.

## Appendix G. Parameters

### G.1 기본 v1 파라미터

- token cap: `2,100,000,000 KOIN`
- provider share: `70%`
- verifier share: `30%`
- job weights: `Simple = 1`, `General = 3`, `Collective = 7`
- verifier quorum: `Simple = 1`, `General = 3`, `Collective = 5`

### G.2 발행 곡선

KOIN 발행은 감소하는 epoch schedule을 따른다.

```text
E_t = E_0 * (1/2)^(floor(t / H))
```

이 곡선의 특징은 다음과 같다.

- 초기 참여자는 더 강한 기본 인센티브를 받는다
- 시간이 지날수록 발행량은 감소한다
- 고정 공급량을 통해 장기 희소성이 유지된다
- 시장 보상이 점차 프로토콜 보상을 대체할 수 있다

### G.3 경제적 해석

초기 단계에서는 프로토콜 발행이 주요 인센티브다. 네트워크가 성숙해질수록:

- job demand가 증가하고
- premium reward가 증가하고
- 경쟁이 심화되며
- market-based income의 중요성이 커진다

### G.4 Figure Reference

주요 발행 시각화는 메인 백서 Section 7의 Figure 4에 실려 있다. 이 appendix는 경제 규칙과 파라미터 해석에 집중하고, 시각적 발행 곡선은 메인 백서 본문에 남겨둔다.
