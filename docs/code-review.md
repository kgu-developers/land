# CodeRabbit PR 리뷰

CodeRabbit GitHub App을 기존 GitHub Actions CI와 함께 사용한다. 별도 Actions Job, CodeRabbit API 토큰 또는 OpenAI 키는 필요하지 않다.

## 저장소 설정

루트 `.coderabbit.yaml`에서 한국어 리뷰, balanced 피드백(`chill`), PR 생성과 추가 push의 자동 리뷰를 활성화한다. Draft PR은 자동 리뷰하지 않는다. 자동 리뷰를 검토 커밋 수 때문에 중단하지 않도록 설정했다.

루트 AGENTS.md, README와 `.agent`의 구현·테스트·PR·디자인 지침을 리뷰 기준으로 제공한다. 기존 Vercel 배포와 CI 검사 명령은 그대로 사용한다.

## GitHub 앱 연결

2026-11-18 사용자 승인 후 조직 `kgu-developers`의 기존 `coderabbitai` GitHub App 접근 대상에 `land`를 추가했다. 저장 후 설치 화면을 다시 열어 `kgu-developers/land`가 포함된 선택 저장소 5개와 저장 버튼 비활성화를 확인했다. 기존 저장소 4개와 앱의 기존 권한은 유지했으며 별도로 요청 중인 권한 업데이트는 승인하지 않았다.

1. [조직의 GitHub App 설정](https://github.com/organizations/kgu-developers/settings/installations)에서 CodeRabbit → Configure를 연다.
2. Repository access에 **kgu-developers/land**가 포함되는지 확인한다. 필요한 접근은 이 저장소로 한정한다.
3. CodeRabbit의 저장소 설정에서 해당 저장소 리뷰가 활성화되어 있는지 확인한다.
4. 이 설정 파일이 포함된 Ready for review PR을 생성하거나 기존 PR을 Ready로 전환하고 리뷰와 `CodeRabbit` 체크가 생성되는지 확인한다. 설정 파일 검증과 실제 PR 리뷰 실행 검증은 구분한다.

이미 열린 PR에서 수동 재검토가 필요하면 PR 댓글에 `@coderabbitai full review`를 사용한다. 이 문서의 댓글은 운영자가 직접 실행하는 안내이며 이번 작업에서 댓글을 게시하지는 않았다.

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
