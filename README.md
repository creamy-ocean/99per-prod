# 99%(99퍼센트) - 작업 중(미완성)

> 나와 딱 맞는 게임 친구 찾기
> 
<br/>
   
## 프로젝트 소개

- 게임을 함께 플레이할 게임 친구를 찾을 수 있는 웹 사이트입니다<br/>
- 플레이하는 게임, 플레이 스타일, 관심사 등의 필터링을 통해 나와 딱 맞는 게임 친구를 찾을 수 있습니다
<br/>

## 실행 화면

![Honeycam 2023-11-29 14-15-38](https://github.com/creamy-ocean/99per-ver.2/assets/93719660/211abfe1-28c9-4c33-a889-85dcd74099f1)
<br/>
<br/>

## 배포 링크 및 서버 주소

- 배포 링크: [https://99per-prod.netlify.app/](https://99per-prod.netlify.app/)
  <br/>
<br/>

## 구현 기능

### 프로필 생성
- React Hook Form과 yup을 이용해 리렌더링이 적은 프로필 생성 form 구현
    - React Hook Form의 경우 register 함수를 이용해 ref를 캡처링 하고 Controller를 통해 제어 컴포넌트의 리렌더링 범위를 제한하기 때문에 input에 값을 입력하는 등의 상황에서 전체 form의 리렌더링이 발생하지 않음
      
- 프로필 이미지 업로드 및 미리보기 기능 구현
  
  ![캡처7](https://github.com/creamy-ocean/99per-ver.2/assets/93719660/842edb55-16b4-4a6b-a38e-dff135e2f246)
<br/>

### 프로필 목록
- Firebase DB에서 프로필 목록을 불러와 컴포넌트로 매핑하는 기능 구현
  
  ![캡처1](https://github.com/creamy-ocean/99per-prod/assets/93719660/40b71473-2a25-4e4a-9356-849e2604fd22)
  <br/>
<br/>

### 프로필 필터링
- 배열로 구성된 객체 state를 활용해 프로필 필터링 기능 구현
  
  ![캡처4](https://github.com/creamy-ocean/99per-ver.2/assets/93719660/0d19d881-c425-4e3a-ab11-b8e0e3e8de83)
<br/>

### 실시간 알림
- Firebase Firestore의 onSnapshot을 이용해 실시간 알림 구현
  - 친구 추가, 파티 참여, 길드 가입 요청 시 해당 유저에게 알림 표시

  ![캡처5](https://github.com/creamy-ocean/99per-ver.2/assets/93719660/06e88489-912c-46f8-9e85-2e2da669007b)
<br/>

### 내 요청
- 전체 요청 중 나에게 온 요청만 표시되는 내 요청 페이지 구현
  - 해당 페이지에서 친구 추가, 파티 참여, 길드 가입 요청을 수락하거나 거절할 수 있음(수락 및 거절 기능은 아직 미구현)

  ![캡처6](https://github.com/creamy-ocean/99per-ver.2/assets/93719660/7a73b332-b16b-4f3f-8e06-93ee64964c65)
<br/>

### 내 프로필
- 전체 프로필 중 내가 작성한 프로필만 표시되는 내 프로필 페이지 구현
  - 해당 페이지에서 내가 작성한 프로필을 수정, 삭제할 수 있음
    
  ![캡처8](https://github.com/creamy-ocean/99per-ver.2/assets/93719660/314de120-b9c3-4c6e-a4ce-50a2df21b75b)
<br/>

### 프로필 수정
- 프로필 수정 form 구현
  - Firebase DB에서 내가 작성한 내용을 불러와 보여주는 form 구현

  ![캡처9](https://github.com/creamy-ocean/99per-ver.2/assets/93719660/06603318-e923-4d12-b040-7ff5acbdbc68)
<br/>

### ProtectedRoutes
- 조건에 맞지 않는 유저가 특정 페이지에 접근하는 경우 리다이렉트 하는 ProtectedRoutes 구현
  - 유저의 상태를 체크한 뒤 React-router-dom의 Navigate을 사용해 리다이렉트
  - 로그인 되어 있지 않거나 인증을 받지 않은 상태의 경우 특정 페이지에 접근 불가
<br/>

## 개선해야 하는 점
- 현재 친구, 파티, 길드 탭 이동 시 프로필 목록 데이터를 다시 불러오는데, 부하가 발생할 수 있는 부분이므로 React Query를 사용해 캐싱 하는 방향으로 개선 필요
- Profiles state이 이미 존재하면 프로필 목록 데이터를 다시 불러오지 않고 filter 함수를 사용해 필터링 되도록 개선 필요
- 접근성 관련 UI, UX 개선 필요(색상 대비율, 버튼 이름 등)
- 프로필 목록에서 게임 이름이 표시되도록 개선 필요
<br/>

## 기술 스택

<div>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Chakra UI-319795?style=flat&logo=chakraui&logoColor=white">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=white">
   <img src="https://img.shields.io/badge/React Hook Form-EC5990?style=flat&logo=reacthookform&logoColor=white">
</div>
<br/>
