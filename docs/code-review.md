# CodeRabbit PR 리뷰

CodeRabbit GitHub App을 기존 GitHub Actions CI와 함께 사용한다. 별도 Actions Job, CodeRabbit API 토큰 또는 OpenAI 키는 필요하지 않다.

## 저장소 설정

루트 `.coderabbit.yaml`에서 한국어 리뷰, balanced 피드백(`chill`), PR 생성과 추가 push의 자동 리뷰를 요청하도록 설정한다. 다만 실제 실행에는 서비스의 저장소·요금제 조건이 적용된다. Draft PR은 자동 리뷰 대상에서 제외하며, 검토 커밋 수 때문에 자동 중단하지 않도록 설정했다.

**공개 저장소의 별이 10개 미만이면 자동 리뷰가 시작되지 않는다.** 현재 `land`는 이 조건에 해당하므로 PR 생성 및 검토할 추가 push마다 상태 댓글의 **Trigger review** 버튼이나 `@coderabbitai review` 댓글로 수동 요청한다. 전체 변경을 다시 검토하려면 `@coderabbitai full review`를 사용한다. 요청 후 실제 리뷰 결과와 대상 커밋을 확인하며, Skipped·Neutral·사용량 제한 등으로 체크가 통과한 것만으로 리뷰가 실행됐다고 판단하지 않는다. 별 수나 서비스 정책이 바뀌면 자동 리뷰 조건을 다시 확인한다.

루트 AGENTS.md, README와 `.agent`의 구현·테스트·PR·디자인 지침을 리뷰 기준으로 제공한다. 기존 Vercel 배포와 CI 검사 명령은 그대로 사용한다.

## GitHub 앱 연결

2026-11-18 사용자 승인 후 조직 `kgu-developers`의 기존 `coderabbitai` GitHub App 접근 대상에 `land`를 추가했다. 저장 후 설치 화면을 다시 열어 `kgu-developers/land`가 포함된 선택 저장소 5개와 저장 버튼 비활성화를 확인했다. 기존 저장소 4개와 앱의 기존 권한은 유지했으며 별도로 요청 중인 권한 업데이트는 승인하지 않았다.

1. [조직의 GitHub App 설정](https://github.com/organizations/kgu-developers/settings/installations)에서 CodeRabbit → Configure를 연다.
2. Repository access에 **kgu-developers/land**가 포함되는지 확인한다. 필요한 접근은 이 저장소로 한정한다.
3. CodeRabbit의 저장소 설정에서 해당 저장소 리뷰가 활성화되어 있는지 확인한다.
4. 이 설정 파일이 포함된 Ready for review PR을 생성하거나 기존 PR을 Ready로 전환하고 리뷰와 `CodeRabbit` 체크가 생성되는지 확인한다. 설정 파일 검증과 실제 PR 리뷰 실행 검증은 구분한다.

PR에서 설정 파일이 처음 추가되거나 신뢰 정책에 의해 변경된 설정을 사용할 수 없으면 대상 브랜치의 설정 또는 기본값으로 리뷰할 수 있다. 실제 리뷰 댓글의 **Run configuration**에서 적용 소스와 언어를 확인한다. 이 경우 현재 PR에도 한국어를 적용하려면 CodeRabbit 웹의 해당 저장소 기본 언어를 `ko-KR`로 설정한다.

## CI·병합 조건

GitHub Actions의 format·lint·typecheck·Vitest·build·E2E와 별개로 `CodeRabbit` 체크가 표시된다. GitHub에서는 `review_progress: true`를 통해 check run을 사용한다. `review_status`는 리뷰 요약의 상태 메시지이며 체크 자체를 제어하는 옵션이 아니다.

설정의 `fail_commit_status: true`로 리뷰 도중 시스템 오류가 발생하면 체크를 실패시킨다. **발견한 지적이 있다는 이유만으로 체크가 실패하는 것은 아니다.** 체크 완료를 코드 승인으로 간주하지 않고 실제 리뷰 내용과 사람의 승인을 확인한다. 건너뛰거나 사용량 제한에 걸린 리뷰도 GitHub 병합 조건상 통과할 수 있으므로 상태 설명을 읽는다.

필수 검사로 만들려면 첫 실제 리뷰가 생성된 뒤 GitHub의 main Ruleset/브랜치 보호 → Require status checks to pass before merging에서 `CodeRabbit`을 추가하고 expected source는 CodeRabbit 앱으로 선택한다. 설치·체크 생성을 확인하기 전에 필수로 추가하면 체크가 영원히 나타나지 않아 병합이 막힐 수 있다. 이번 작업에서 브랜치 보호 규칙은 변경하지 않는다.

## 검증

공식 V2 JSON Schema로 설정 문법과 옵션을 확인한다. YAML·문서 변경이므로 애플리케이션 테스트는 반복 실행하지 않는다. 실제 리뷰 실행과 체크 생성 검증은 저장소 연결 및 PR 반영 이후에 진행한다.

## 참고

- [CodeRabbit 시작하기](https://docs.coderabbit.ai/getting-started/quickstart)
- [공식 V2 설정](https://docs.coderabbit.ai/reference/configuration)
- [체크 상태와 병합 조건](https://docs.coderabbit.ai/pr-reviews/status-check)

- [공개 저장소의 자동 리뷰 및 수동 실행 조건](https://kb.coderabbit.ai/articles/8856795235-how-do-i-activate-coderabbit-pro-for-my-open-source-project)
