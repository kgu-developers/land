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
