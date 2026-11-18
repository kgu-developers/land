# Vercel 배포 운영

Next.js 앱을 Vercel에 직접 배포한다. GitHub Actions는 검증을, Vercel Git 연동은 Preview·Production 자동 배포를 담당한다. Hosting.kr DNS와 기존 OTP·API 레코드는 유지한다.

## 프로젝트 설정

[Vercel KD / land 설정](https://vercel.com/kd-45a7/land/settings/build-and-deployment)

| 항목                                     | 설정                                            |
| ---------------------------------------- | ----------------------------------------------- |
| Git 저장소                               | `kgu-developers/land`                           |
| Framework                                | `Next.js`                                       |
| Root Directory                           | `apps/land`                                     |
| Include files outside the root directory | Enabled                                         |
| Build Command                            | `pnpm build`                                    |
| Install Command                          | 자동 감지, pnpm workspace 및 루트 lockfile 사용 |
| Output Directory                         | Next.js 기본값                                  |
| Node.js                                  | `22.x`                                          |
| Production Branch                        | `main`                                          |

`apps/land/vercel.json`으로 framework와 build command를 관리한다. 루트와 앱 `package.json`의 engines도 Node 22로 맞춘다. pnpm은 루트 packageManager의 `10.9.0`을 사용한다. 별도 정적 내보내기나 서버 어댑터 없이 Next.js 서버 렌더링·캐시 재검증을 사용한다.

`packages/design-system`과 `configs/typescript`를 읽어야 하므로 루트 밖 파일 접근을 유지한다. CLI를 쓰더라도 저장소 루트에서 프로젝트를 연결하며 Root Directory를 이중으로 지정하지 않는다.

## 환경변수

[Vercel 프로젝트 환경변수](https://vercel.com/kd-45a7/land/settings/environment-variables)에 아래 값을 등록한다. 로컬 `.env.local`이나 GitHub Environment의 값이 Vercel로 자동 복사되지는 않는다.

| 이름                          | Production                           | Preview·Development               |
| ----------------------------- | ------------------------------------ | --------------------------------- |
| `SITE_URL`                    | `https://land.kgudevelopers.monster` | 미설정                            |
| `GITHUB_DISCUSSIONS_TOKEN`    | 서버 전용 Discussions 읽기 토큰      | 글 조회가 필요할 때만 별도로 등록 |
| `GITHUB_DISCUSSIONS_OWNER`    | `kgu-developers`                     | 같은 값                           |
| `GITHUB_DISCUSSIONS_REPO`     | `land`                               | 같은 값                           |
| `GITHUB_DISCUSSIONS_CATEGORY` | `blog`                               | 같은 값                           |

서버 토큰에는 `NEXT_PUBLIC_` 접두사를 붙이지 않고 값은 커밋·문서·채팅에 남기지 않는다. 발급과 권한은 [블로그 가이드](blog-setup.md)를 따른다. Preview에는 토큰 없이 블로그 준비 중 화면을 제공할 수 있다. 운영 토큰을 불필요하게 Preview에 공유하지 않는다.

`SITE_URL`은 Production에만 설정하고 끝에 `/`를 붙이지 않는다. 미설정 빌드는 noindex를 사용한다. canonical·Open Graph·Organization JSON-LD·robots·sitemap 중 일부가 빌드 시 생성되므로 환경변수 변경 후에는 재배포한다. 토큰 미설정·API 오류 시에도 블로그 화면은 HTTP 200일 수 있으므로 글이 실제로 표시되는지 확인한다.

## CI와 자동 배포

1. 기능 브랜치의 PR에서 GitHub Actions가 format·lint·typecheck·Vitest·Next 빌드·Playwright를 실행한다.
2. Vercel Git 연동은 브랜치 변경에 대해 별도 Preview를 배포한다.
3. `main`에 반영되면 Vercel이 Production 배포를 시작한다.

Vercel Git 배포는 GitHub Actions의 완료를 자동으로 기다리는 구조가 아니다. 운영 전 검사를 강제하려면 GitHub의 main Ruleset/브랜치 보호에서 PR 병합 및 필수 상태 검사를 설정하고 직접 push를 제한한다. 필수 검사는 `format`, `lint`, `typecheck`, `test:logic`, `test:ui`, `build`, `e2e:chromium`이다. Vercel Preview까지 필수로 둘 경우 실제 표시되는 체크 이름을 확인해 추가한다.

현재 작업에서 브랜치 보호 규칙을 생성하거나 수정하지는 않았다. main의 CI 완료까지 엄격히 기다리는 CD가 필요하면 GitHub Actions의 마지막 deploy Job에서 Vercel CLI를 실행하는 별도 방식으로 전환해야 한다. 이때 Git 자동 배포와 중복 실행하지 않는다.

현재 공개 저장소에는 Hobby의 비공개 조직 저장소 제한은 해당하지 않는다. 다만 Hobby Git 배포에는 커밋 작성자와 Hobby 소유자 관련 제한이 있으므로 여러 팀원이 배포할 때 Vercel의 작성자 오류 및 팀 플랜 조건을 확인한다.

## Hosting.kr 도메인 연결

공개 주소는 `https://land.kgudevelopers.monster`다. Vercel 프로젝트 Domains에 해당 주소를 추가하고 안내된 레코드를 Hosting.kr에 등록한다.

| 항목        | 값                                    |
| ----------- | ------------------------------------- |
| 유형        | `CNAME`                               |
| 호스트 이름 | `land`                                |
| 대상        | `861ed7d48a60673c.vercel-dns-017.com` |
| TTL         | `180`                                 |

대상은 이 프로젝트 화면에서 확인한 값이며, 재등록 등으로 안내가 바뀌면 최신 Vercel 표시값을 따른다. `land-three-swart.vercel.app`은 기본 배포 주소이며 DNS 대상값 대신 넣지 않는다. 값에는 `https://`나 경로를 붙이지 않는다. 끝의 점은 DNS의 완전한 도메인 표기다.

네임서버와 OTP의 `team-project → aics-oop.pages.dev`, 기존 API A 레코드는 그대로 둔다. 도메인 추가는 앱 배포와 별개이므로 앱이 vercel.app에서 열려도 사용자 도메인의 DNS 검증·인증서는 아직 완료되지 않았을 수 있다.

`Invalid Configuration`이면 먼저 Vercel의 안내값과 권한 DNS 응답을 비교한다. 일치하는 레코드를 추측으로 다른 값으로 바꾸지 않는다. DNS가 맞는데도 HTTPS가 실패하면 도메인 검증·인증서 발급 상태를 확인한다. 2026-11-18 진단 당시에는 CNAME이 일치했지만 Vercel이 Invalid Configuration과 인증서 미발급을 표시했다. 배포 설정 정리 작업과 도메인 장애 해결 완료를 구분한다.

## 검증과 롤백

로컬에서 Node 22와 pnpm 10.9.0으로 다음을 실행한다.

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test:e2e
```

Production 배포 후 아래 항목을 확인한다.

- 배포 상태 Ready, 도메인 Valid Configuration 및 HTTPS 연결
- 홈·Apply·블로그·실제 게시글·없는 주소 404와 정적 자산
- canonical·JSON-LD·robots·sitemap의 운영 origin
- 게시글 수정이 캐시 재검증 이후 반영되는지
- 기존 OTP와 API의 정상 동작

장애 시 Vercel의 이전 정상 Production 배포로 롤백하고 원인 커밋을 수정한다. 환경변수·도메인 설정은 코드 버전 롤백과 별도로 확인한다. `.vercel`의 로컬 프로젝트 연결 정보와 빌드 결과는 Git에서 제외한다.

## 참고

- [Git 자동 배포와 Hobby 조건](https://vercel.com/docs/git)
- [모노레포 빌드 설정](https://vercel.com/docs/builds/configure-a-build)
- [도메인 연결](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- [도메인·인증서 진단](https://vercel.com/docs/domains/troubleshooting)
- [GitHub Actions에서 Vercel 배포](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel)
