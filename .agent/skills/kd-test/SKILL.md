---
name: kd-test
description: Next.js 공개 페이지 검증
---

루트에서 pnpm check를 실행한다. 화면이나 콘텐츠가 바뀌면 pnpm start로 프로덕션 빌드를 열어 첫 HTML의 제목, 설명, h1과 링크를 확인한다. SITE_URL로 운영 도메인을 지정한 빌드에서는 canonical, Organization JSON-LD, /robots.txt와 /sitemap.xml이 같은 주소를 가리키는지 확인한다.

환경 제약으로 확인하지 못한 항목은 검증 결과에 구분해 기록한다.
