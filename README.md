# KD Developers 랜딩 페이지

경기대학교 KD Developers의 공개 랜딩 페이지를 위한 Next.js App Router 프로젝트다.

## 로컬 실행

Node.js 22와 pnpm 10.9.0 환경에서 저장소 루트에서 실행한다.

```sh
pnpm install
pnpm dev
```

localhost:3000에서 팀 소개를 확인한다. 루트에서 `pnpm check`로 하네스 검사, ESLint, 타입 검사, 프로덕션 빌드를 실행한다. 빌드 후 `pnpm start`로 결과를 확인한다.

## 구성

| 위치                   | 용도                                               |
| ---------------------- | -------------------------------------------------- |
| apps/land/src/app      | 공개 페이지, 레이아웃, 메타데이터, robots, sitemap |
| packages/design-system | OTP에서 복사한 @aics/design-system과 Astryx 스타일 |
| configs/typescript     | 디자인 패키지와 앱이 사용하는 OTP TypeScript 설정  |
| .agent                 | 구현·검증·PR 지침, 로컬 작업 파일 검사             |

## 배포 환경

운영 배포에서만 `SITE_URL`을 실제 공개 origin으로 지정한다. 이 값으로 canonical, Open Graph URL, sitemap과 robots를 만든다. 미설정 환경에는 noindex를 적용한다. 첫 HTML에 팀 설명과 Organization 구조화 데이터를 함께 제공한다.

## 페이지 구조

| URL    | 파일                             | 역할               |
| ------ | -------------------------------- | ------------------ |
| /      | apps/land/src/app/page.tsx       | 팀 홈              |
| /apply | apps/land/src/app/apply/page.tsx | 지원 페이지 진입점 |
| /blog  | apps/land/src/app/blog/page.tsx  | 팀 블로그 진입점   |

## 팀 컨벤션

OTP와 같이 브랜치는 `<type>/<ticket-id>`, 커밋은 `<type>(<scope>): <ticket-id> <summary>`, PR 제목은 `[<ticket-id>] <summary>` 형식을 쓴다. 이번 초기 세팅은 지정된 `KD3-336` 브랜치에서 진행한다.
주 컴포넌트는 PascalCase와 default function, 유틸리티는 lowerCamelCase와 named export를 사용한다. App Router 파일은 Next.js 예약 이름을 따른다.
루트에서 `pnpm format:write`로 OTP Prettier 설정을 적용한다. Lefthook의 commit-msg 훅은 Conventional Commits 형식을 확인한다.

## CI 및 테스트

OTP 프로젝트와 동일하게 GitHub Actions에서 각 검증 단계를 독립적으로 표시한다.

| Job | 명령 | 목적 |
| --- | --- | --- |
| quality | `agent:check-local`, `format`, `lint`, `typecheck` | 하네스, 코드 스타일, 정적 분석 |
| vitest | `test:logic`, `test:ui` | 유틸리티 및 React 컴포넌트 |
| build | `build` | Next.js 프로덕션 빌드 |
| e2e | `test:e2e` | 실제 Chromium에서 라우트 및 SEO 엔드포인트 확인 |

로컬에서 다음 명령으로 확인한다.

```sh
pnpm install
pnpm check
pnpm exec playwright --version
pnpm --filter @kd/land exec playwright install chromium
pnpm build
pnpm test:e2e
```

`pnpm test`는 Vitest 전체를, `pnpm test:logic`과 `pnpm test:ui`는 각각의 테스트 프로젝트를 실행한다. `pnpm check`는 빠른 검증을 위해 브라우저 E2E를 실행하지 않는다. E2E는 별도로 실행해야 한다.

**설치 재현성 후속 작업:** 초기 브랜치에는 `pnpm-lock.yaml`이 없다. 의존성을 설치해 lockfile을 생성·커밋한 뒤 CI의 `--no-frozen-lockfile`을 `--frozen-lockfile`로 바꾸고 pnpm 캐시를 활성화해야 한다. 현재 CI 테스트 통과 여부는 별도 확인이 필요하다.
