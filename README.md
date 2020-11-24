#실행
* npm i
* local 실행
    * npm start
* build
    * npm run build
    * dist 폴더에 빌드된 파일 생

#환경 구성
* 서버
    * nest 기반
    * typescript
    * url {domain}/ 으로 static 폴더의 index.html로 기능 인 가능
    
* PWA 클라이언트
    * vanilla javascript 기반
    * url {domain}/pwa 로 static/pwa 폴더의 index.html로 기능 확인 가능
    * url 접속시 알림 허용시 알림을 받을 수 있음
    * 주소창의 + 버튼을 클릭시 APP으로 바탕화면에 추가 가능
#설명
Socket.io를 이용한 채팅 ROOM 생성   
클라이언트에서 해당 채팅 ROOM에 접속   
서버와 채팅 메시지 주고 받음   
메시지가 왔을 경우 크롬 알림 기능   
알림을 클릭시 브라우저의 탭일 경우 탭에 포커스 앱 화면으로 실행했을 경우 앱에 포커스 되도록 서비스워커 이벤트 리스너 등록


![socket-chat-pwa](https://user-images.githubusercontent.com/4207593/100057663-44779c80-2e6b-11eb-9605-045e8077b565.png)   
![socket-chat-pwa](https://user-images.githubusercontent.com/4207593/100057712-578a6c80-2e6b-11eb-8d24-3856af733f55.png)   
![socket-chat-pwa](https://user-images.githubusercontent.com/4207593/100057720-5b1df380-2e6b-11eb-9896-e86b127494ea.png)   
![socket-chat-pwa](https://user-images.githubusercontent.com/4207593/100057688-4ccfd780-2e6b-11eb-8d87-8523ecff035b.png)   
