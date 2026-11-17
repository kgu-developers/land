---
name: kd-work
description: KD 랜딩 페이지 구현 및 파일 배치
---

공개 팀 랜딩 페이지를 대상으로 작업한다. URL, 레이아웃, 메타데이터는 apps/land/src/app, 서버 데이터 접근은 apps/land/src/lib에 둔다. 기능 전용 UI는 해당 라우트 가까이에 둔다.

브라우저 API나 상호작용이 필요한 가장 작은 컴포넌트에만 'use client'를 붙인다. UI 작업에는 .agent/rules/design-system.md를 적용한다. 검증은 kd-test를 따른다.
