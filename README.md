# 99%(99퍼센트) - Perfect Game Friend Match

> 여성 게이머 전용 1:1 매칭 서비스
> 
> Female Gamer Exclusive 1:1 Matching Service
> 
<br/>
   
## 프로젝트 소개 (Project Overview)

- 게임을 함께 플레이할 게임 친구를 찾을 수 있는 웹 사이트입니다.<br/>
- 플레이하는 게임, 플레이 스타일, 관심사 등의 필터링을 통해 나와 딱 맞는 게임 친구, 파티, 길드를 찾을 수 있습니다.
-  A website where you can find gaming friends to play games together.
-  Use filters such as game preferences, play style, and interests to find the perfect gaming friend, party, or guild for you.

  ![99%_설명](https://github.com/creamy-ocean/99per-ver.2/assets/93719660/a4dad48f-8403-4e47-a983-3a8c8c1818c4)
<br/>
<br/>

## 실행 화면 (Preview)

![Honeycam 2024-03-18 02-49-25](https://github.com/creamy-ocean/99per-ver.2/assets/93719660/013ef8c7-a2ff-487b-bdc7-38cf18e9e1b0)
<br/>
<br/>

## 배포 링크 (Live Demo)

- 배포 링크 (Deployment Link) : [https://99per.site](https://99per.site)
  <br/>
<br/>

## 구현 기능 (Features)

### 프로필 생성 (Profile Creation)
- React Hook Form과 yup을 이용해 리렌더링이 적은 프로필 생성 form 구현
    - React Hook Form의 경우 register 함수를 이용해 ref를 캡처링 하고 Controller를 통해 제어 컴포넌트의 리렌더링 범위를 제한하기 때문에 input에 값을 입력하는 등의 상황에서 전체 form의 리렌더링이 발생하지 않음 
- 프로필 이미지 업로드 및 미리보기 기능 구현
- Built a profile creation form with React Hook Form and Yup to minimize re-renders.
    - React Hook Form captures refs using the register function, and controllers restrict the scope of re-renders for controlled components, preventing unnecessary re-renders of the entire form when input changes occur.
- Implemented a profile image upload and preview feature.
  
  ![캡처7](https://github.com/creamy-ocean/99per-ver.2/assets/93719660/842edb55-16b4-4a6b-a38e-dff135e2f246)
<br/>

### 프로필 목록 (Profile List)
- Firebase DB에서 프로필 목록을 불러와 컴포넌트로 매핑하는 기능 구현
- Implemented functionality to fetch profile data from Firebase DB and map it into components.
  
  ![캡처1](https://github.com/creamy-ocean/99per-prod/assets/93719660/40b71473-2a25-4e4a-9356-849e2604fd22)
  <br/>
<br/>

### 프로필 필터링 (Profile Filtering)
- 배열로 구성된 객체 state를 활용해 프로필 필터링 기능 구현
- Enabled profile filtering using a state managed as an array of objects.
  
  ![캡처4](https://github.com/creamy-ocean/99per-ver.2/assets/93719660/0d19d881-c425-4e3a-ab11-b8e0e3e8de83)
<br/>

### 실시간 알림 (Real-Time Notifications)
- Firebase Firestore의 onSnapshot을 이용해 실시간 알림 구현
  - 친구 추가, 파티 참여, 길드 가입 요청 시 해당 유저에게 알림 표시
- Built real-time notifications using Firebase Firestore's onSnapshot.
  - Notifications are displayed to users for friend requests, party invitations, and guild join requests.
  
  ![캡처5](https://github.com/creamy-ocean/99per-ver.2/assets/93719660/06e88489-912c-46f8-9e85-2e2da669007b)
<br/>

### 내 요청 (My Requests)
- 전체 요청 중 나에게 온 요청만 표시되는 내 요청 페이지 구현
  - 해당 페이지에서 친구 추가, 파티 참여, 길드 가입 요청을 수락하거나 거절할 수 있음
- Created a "My Requests" page that displays only requests sent to the user.
  - Users can accept or decline friend, party, and guild join requests directly from this page (accept/decline functionality still in progress).

  ![캡처6](https://github.com/creamy-ocean/99per-ver.2/assets/93719660/7a73b332-b16b-4f3f-8e06-93ee64964c65)
<br/>

### 내 프로필 (My Profiles)
- 전체 프로필 중 내가 작성한 프로필만 표시되는 내 프로필 페이지 구현 Built a "My Profile" page that displays only profiles created by the user
  - 해당 페이지에서 내가 작성한 프로필을 수정, 삭제할 수 있음 Users can edit or delete their profiles on this page
- Built a "My Profiles" page that displays only profiles created by the user.
  - Users can edit or delete their profiles on this page.
    
  ![캡처8](https://github.com/creamy-ocean/99per-ver.2/assets/93719660/314de120-b9c3-4c6e-a4ce-50a2df21b75b)
<br/>

### 프로필 수정 (Profile Editing)
- 프로필 수정 form 구현 Developed a profile editing form
  - Firebase DB에서 내가 작성한 내용을 불러와 보여주는 form 구현
- Developed a profile editing form.
  - Loaded and displayed existing profile data from Firebase DB.

  ![캡처9](https://github.com/creamy-ocean/99per-ver.2/assets/93719660/06603318-e923-4d12-b040-7ff5acbdbc68)
<br/>

### ProtectedRoutes (Protected Routes)
- 조건에 맞지 않는 유저가 특정 페이지에 접근하는 경우 리다이렉트 하는 ProtectedRoutes 구현
  - 유저의 상태를 체크한 뒤 React-router-dom의 Navigate을 사용해 리다이렉트
  - 로그인 되어 있지 않거나 인증을 받지 않은 상태의 경우 특정 페이지에 접근 불가
- Implemented Protected Routes to redirect users who do not meet access conditions.
  - Checked user state and used React Router's Navigate to handle redirection.
  - Prevented access to certain pages for users who are not logged in or verified.
<br/>

### 무한 스크롤 (Infinite Scroll)
- React Query의 useInfiniteScroll을 사용하여 프로필 목록에 무한 스크롤 적용 및 캐싱 적용
- 필터 변경 시 프로필 목록 데이터를 다시 가져오지 않고 필터링 되도록 구현
- Applied React Query's useInfiniteScroll to implement infinite scrolling and caching for the profile list.
- Enabled filtering functionality to apply changes without refetching profile list data.

## 개선해야 하는 점 (Areas for Improvement)
- 접근성 관련 UI, UX 개선 필요(색상 대비율, 버튼 이름 등)
- Improve accessibility-related UI/UX features (e.g., color contrast, button labels).
<br/>

## 기술 스택 (Tech Stack)

<div>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Chakra UI-319795?style=flat&logo=chakraui&logoColor=white">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=white">
   <img src="https://img.shields.io/badge/React Hook Form-EC5990?style=flat&logo=reacthookform&logoColor=white">
   <img src="https://img.shields.io/badge/React Query-FF4154?style=flat&logo=reactquery&logoColor=white">
</div>
<br/>
