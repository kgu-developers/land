---
name: kd-test
description: Next.js 공개 페이지 검증
---

루트에서 `pnpm check`를 실행하여 하네스, 형식, 린트, 타입, Vitest, 빌드를 검사한다.

- `pnpm test:logic`: Node 환경의 유틸/메타데이터 단위 테스트
- `pnpm test:ui`: jsdom 및 Testing Library로 컴포넌트 렌더링 검증
- `pnpm build && pnpm test:e2e`: 프로덕션 Next 서버에서 Playwright Chromium 검증
- `pnpm --filter @kd/land exec playwright install chromium`: 최초 로컬 브라우저 설치

화면이나 콘텐츠가 바뀌면 E2E 테스트로 첫 HTML의 제목, 설명, h1, 내비게이션을 확인한다. SITE_URL로 운영 도메인을 지정한 빌드에서는 canonical, Organization JSON-LD, /robots.txt와 /sitemap.xml이 같은 주소를 가리키는지 확인한다.

CI는 품질 체크, Vitest logic/UI, 빌드, E2E로 분리한다. 브라우저 테스트는 빌드 이후 별도 Job에서 실행한다. 변경 시 적절한 테스트를 함께 작성한다.

현재 pnpm-lock.yaml이 없어 CI는 임시로 `pnpm install --no-frozen-lockfile`을 사용한다. lockfile을 생성하고 커밋한 뒤 `--frozen-lockfile` 및 pnpm 캐시를 활성화해야 설치 재현성이 확보된다.

환경 제약으로 확인하지 못한 항목은 검증 결과에 구분해 기록한다.
