# 🎵 Rhythm Multiplayer

HTML5 Canvas와 Vanilla JavaScript로 구현된 웹 기반 리듬 게임입니다.
향후 Node.js와 Socket.io를 활용하여 동일 네트워크(로컬) 상의 유저 간 멀티플레이(배틀 모드)를 지원하는 것을 목표로 합니다.

## 🚀 기술 스택 (Tech Stack)

- Frontend: HTML5 (Canvas API), CSS3, Vanilla JavaScript
- Backend (예정): Node.js, Express
- Network (예정): Socket.io

## 📁 폴더 구조 (Directory Structure)

```RhythmGame_Multi/
 ┣ 📂 assets/          # 음원(mp3), 이미지 등 정적 리소스
 ┣ 📂 css/
 ┃ ┗ 📜 style.css      # UI 및 레이아웃 스타일
 ┣ 📂 js/
 ┃ ┣ 📜 notes.js       # 노트 패턴 데이터 (JSON 형태)
 ┃ ┗ 📜 game.js        # Canvas 렌더링 및 게임 핵심 로직
 ┣ 📜 index.html       # 메인 화면 및 스크립트 로드
 ┗ 📜 README.md        # 프로젝트 설명서
```

## 🕹️ 조작 방법 (Controls)

- 3키 모드 (현재): A, S, D
- 5키 모드 (확장): A, S, D, F, G

## 🗓️ 개발 마일스톤

- [x] 싱글플레이어 베이스 로직 구현 (Canvas 렌더링, 판정 시스템)
- [ ] 멀티플레이어 서버 기초 세팅 (Socket.io)
- [ ] 실시간 점수 동기화 및 상대방 UI 연동
- [ ] 게임 리소스(노트 스킨, 이펙트) 및 오디오 동기화 고도화
