# 랜딩 UI

OTP에서 가져온 packages/design-system의 공개 진입점은 @aics/design-system 및 @aics/design-system/styles.css다. 전체 스타일은 루트 레이아웃에서 한 번 불러온다. 컴포넌트를 추가할 때는 astryx-inventory.md와 패키지의 src/index.ts를 확인한다. React 훅이나 컨텍스트를 사용하는 Astryx UI는 작은 클라이언트 컴포넌트로 감싼다. 랜딩 섹션과 편집 디자인은 앱에서 조합한다.
