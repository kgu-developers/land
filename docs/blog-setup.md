# GitHub Discussions 블로그 운영

## 사용자가 설정할 항목

1. [저장소 Settings](https://github.com/kgu-developers/land/settings)의 General → Features에서 **Discussions**를 활성화합니다. 저장소 관리 권한이 필요합니다.
2. Discussions의 카테고리 관리에서 **Blog** 카테고리를 만듭니다. slug는 `blog`로 맞춥니다. 다른 slug를 사용하면 `GITHUB_DISCUSSIONS_CATEGORY`도 변경합니다. 운영진만 글을 생성하도록 하려면 Announcements 형식을 선택합니다. 일반 팀원도 작성해야 한다면 Open-ended discussion 형식을 선택하고 게시 승인은 운영진이 담당합니다.
3. 저장소 Labels에서 `blog:published`와 `blog:featured` 라벨을 만듭니다. 게시 라벨은 템플릿에 자동 부여하지 않습니다.
4. 이 브랜치의 `.github/DISCUSSION_TEMPLATE/blog.yml`을 기본 브랜치 `main`에 병합합니다. **기본 브랜치에 있어야 작성 폼이 적용됩니다.** Blog 카테고리에서 새 Discussion을 열어 폼을 확인합니다.
5. 아래 절차대로 서버 전용 토큰을 발급하고 로컬과 배포 환경에 설정합니다.
6. 실제 글 하나로 목록 → 상세 → 수정 → 게시 라벨 제거를 확인합니다. 공개 GitHub 데이터에 대한 라이브 연동 검증은 이 설정 이후 가능합니다.

## 토큰 발급

권장: [Fine-grained personal access token 생성](https://github.com/settings/personal-access-tokens/new?name=kgu-land-blog&target_name=kgu-developers&expires_in=90&discussions=read).

1. GitHub 개인 Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token으로 이동합니다.
2. Resource owner는 `kgu-developers`, Repository access는 **Only select repositories → land**로 선택합니다.
3. Repository permissions의 **Discussions: Read-only**를 선택합니다. Metadata 읽기 권한은 자동 포함됩니다. 쓰기·관리 권한은 필요하지 않습니다.
4. 만료일과 교체 담당자를 정합니다. 조직이 승인을 요구하면 조직 관리자에게 승인을 요청합니다. 조직이 목록에 없다면 조직 멤버십과 토큰 정책을 확인합니다. 외부 협업자 등 fine-grained 토큰 제한에 해당하면 조직 관리자가 승인된 자격 증명 방식을 정해야 합니다.
5. 발급한 값을 `apps/land/.env.local`의 `GITHUB_DISCUSSIONS_TOKEN`에 저장합니다. 토큰을 채팅, Discussion, 커밋 또는 `NEXT_PUBLIC_*` 변수에 넣지 않습니다.
6. 배포 서비스에도 같은 이름의 **서버 환경변수**로 등록하고 앱을 재시작/재배포합니다. Preview에서 글을 조회하려면 해당 환경에도 설정합니다. CI 품질 검사에는 토큰이 필요하지 않습니다.

```dotenv
SITE_URL=https://실제-공개-도메인
GITHUB_DISCUSSIONS_TOKEN=발급한-토큰
GITHUB_DISCUSSIONS_OWNER=kgu-developers
GITHUB_DISCUSSIONS_REPO=land
GITHUB_DISCUSSIONS_CATEGORY=blog
```

`SITE_URL`은 실제 운영 origin으로 설정합니다. 토큰 미설정 시에는 블로그 준비 중 화면을 표시합니다. 읽기 오류 시에는 오류 안내와 재시도 버튼을 표시하며 인증 정보는 화면이나 로그에 출력하지 않습니다. 토큰 만료·권한 변경·조직 승인 여부도 오류 원인이 될 수 있습니다. App Router 페이지는 이 준비/오류 상태를 HTTP 200으로 렌더링하되 목록과 상세 메타데이터에 `noindex, nofollow`를 적용한다는 정책을 사용합니다. 정상 조회 중에만 없는 번호는 404로 처리합니다.

## 글 작성과 게시

1. Discussions → Blog → New discussion에서 폼을 작성합니다.
2. 제목, 유형(소식/개발/팀 이야기), 요약(240자 이내), 본문은 필수입니다. 대표 이미지가 있으면 HTTPS 주소와 이미지 설명을 함께 입력합니다. 미입력 시 공통 커버를 사용합니다. 태그는 쉼표로 구분하고 최대 8개, 각 30자 이내로 작성합니다.
3. 작성자는 자신의 글과 작성자 계정명이 사이트에도 공개됨을 확인합니다. 이미지 권리·출처, 개인정보·비공개 정보 포함 여부를 검토합니다.
4. 운영진이 `blog:published` 라벨을 추가하면 사이트에 노출됩니다. 대표 글에는 `blog:featured`도 추가합니다. 첫 페이지의 글 중 대표 라벨이 있는 글 하나를 큰 카드로 표시하며, 없으면 최신 글을 표시합니다.
5. 수정 시 GitHub가 만든 `### 글 유형`, `### 요약`, `### 대표 이미지`, `### 이미지 설명`, `### 태그`, `### 본문` 제목과 순서를 유지합니다. 코드 블록은 정상 지원합니다. 필수 항목이나 형식이 잘못된 글은 사이트에서 제외됩니다.
6. 승인 취소는 `blog:published` 라벨을 제거합니다. Blog 카테고리에서 옮기거나 원문을 삭제해도 노출 대상에서 제외됩니다. 글 주소는 제목이 바뀌어도 `/blog/Discussion번호`로 유지됩니다.

목록·상세·sitemap은 같은 읽기 데이터를 사용합니다. 정상 조회 결과는 5분 캐시하며 만료 후 첫 요청에서 갱신합니다. 동일 저장소·카테고리의 동시 갱신은 한 건으로 합치고, 실패하면 10초 동안 중복 요청을 억제한 뒤 다시 회복을 시도합니다. API 장애 시 Next.js가 마지막 정상 캐시를 제공할 수 있으므로 게시 취소가 즉시 반영된다고 보장하지 않습니다. 긴급 삭제는 원문과 첨부 파일을 처리하고 배포 플랫폼의 데이터 캐시도 무효화한 뒤 목록·직접 주소·sitemap을 각각 확인합니다. 정적 내보내기 대신 Next.js 서버 런타임이 필요합니다.

현재는 카테고리 내 최대 1,000개 Discussion을 순회합니다. 이를 초과하면 일부 글만 표시하지 않고 조회 오류로 처리합니다. 규모가 커지면 인덱싱과 서버 페이지네이션으로 전환합니다.

## 직접 편집할 때의 본문 예시

다음은 작성 형식 예시이며 실제 팀 활동 사실을 주장하는 게시물이 아닙니다. 폼은 위와 같은 Markdown을 생성합니다.

```markdown
### 글 유형

개발

### 요약

프로젝트에서 해결한 문제와 그 과정에서 배운 점을 정리합니다.

### 대표 이미지

_No response_

### 이미지 설명

_No response_

### 태그

협업, 회고

### 본문

## 어떤 문제를 해결했나요?

실제 프로젝트의 배경을 작성합니다.

## 어떻게 해결했나요?

접근 방법, 코드와 결과를 작성합니다.

## 무엇을 배웠나요?

배운 점과 다음 시도를 작성합니다.
```

## 검증과 참고

로컬: `pnpm check`, `pnpm test:e2e`. 자동 테스트에서는 토큰 없이 GitHub 응답을 모의합니다.

2026-11-18 첫 글을 실제 Blog 카테고리에 게시하고 등록된 서버 읽기 토큰으로 목록·개발 유형 필터·상세 화면을 확인했습니다. 표와 코드 블록, 모바일 가로 넘침 및 브라우저 오류도 확인했습니다. 운영 사이트 배포 확인은 포함하지 않습니다.

- [GitHub Discussions 카테고리 폼](https://docs.github.com/en/discussions/managing-discussions-for-your-community/syntax-for-discussion-category-forms)
- [카테고리 폼을 기본 브랜치에 추가하기](https://docs.github.com/en/discussions/managing-discussions-for-your-community/creating-discussion-category-forms)
- [Discussions GraphQL API](https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions)
- [토큰 권한과 조직 승인·제한](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

## 실제 게시 예제

[kgu developers 블로그 시작하기: 글 작성부터 사이트 반영까지](https://github.com/kgu-developers/land/discussions/2)는 작성 방법, 템플릿 항목과 간단한 데이터 처리 흐름을 설명하는 첫 글입니다. 로컬 템플릿이 만드는 Markdown 형식으로 API 등록했으며, `blog:published` 라벨로 게시했습니다. 사이트 상세 주소는 `/blog/2`입니다. GitHub 작성 폼 자체의 적용은 템플릿 파일을 기본 브랜치에 병합한 뒤 확인합니다.

저장소의 현재 공식 이름은 `kgu-developers/land`입니다. 모든 신규 설정에 `GITHUB_DISCUSSIONS_REPO=land`을 사용합니다.
