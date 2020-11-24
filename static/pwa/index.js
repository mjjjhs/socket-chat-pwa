const doc = document;
const defaultRoomId = 'general';
let doubleSubmitChecked = false;
window.addEventListener('load', async () => {
  doc.getElementById('send').focus();
  const proxyTarget = {};
  const proxyHandler = {
    get: (target, name) => target[name],
    set: (obj, prop, value) => {
      switch (prop) {
        case 'msg': {
          const fragment = new DocumentFragment();
          const liEl = doc.createElement('li');
          liEl.classList.add('your-message');
          const strongEl = doc.createElement('strong');
          const senderTextNode = doc.createTextNode(value.sender || 'Guest');
          const spanEl = doc.createElement('span');
          const msgTextNode = doc.createTextNode(value.messages || '');
          const dateEl = doc.createElement('p');
          dateEl.classList.add('datetime');
          const dateTextNode = doc.createTextNode(getFormatDate(new Date()));
          dateEl.appendChild(dateTextNode);
          spanEl.appendChild(msgTextNode);
          strongEl.appendChild(senderTextNode);
          liEl.appendChild(strongEl);
          liEl.appendChild(spanEl);
          liEl.appendChild(dateEl);
          fragment.appendChild(liEl);
          const target = doc.getElementById('chat-list');
          if (target) {
            target.appendChild(fragment);
          }
          break;
        }
        case 'roomId': {
          console.log('prop::', obj[prop]);
          socket.emit('leaveRoom', obj[prop] || defaultRoomId);
          socket.emit('joinRoom', value);
          doc.getElementById('chat-list').innerHTML = `<li class="joined-text">${value} 방에 입장하셨습니다.</li>`;
        }
        default:
      }
      obj[prop] = value;
      return true;
    },
  };
  const proxy = new Proxy(proxyTarget, proxyHandler);

  setEvent();

  let permission, registration;
  if ('Notification' in window) {
    permission = await Notification.requestPermission();
  }
  if ('serviceWorker' in navigator) {
    try {
      registration = await navigator.serviceWorker.register(
        '/serviceWorker.js',
      );
      if (!registration) {
        throw new Error('undefined registration!');
      }
      console.log('Service Worker Registered');
    } catch (error) {
      console.log('Service Worker Registration Failed');
    }
  }
  function setEvent() {
    const buttonEl = doc.querySelectorAll('.room-list button');
    for (let button of buttonEl) {
      button.addEventListener('click', function () {
        buttonEl.forEach((node) => {
          node.classList.remove('joined');
        });
        button.classList.add('joined');
        const curActiveRoomId = this.dataset.activeId;
        proxy['roomId'] = curActiveRoomId;
      });
    }
    const sendEl = doc.getElementById('send');
    if (!sendEl.getAttribute('useEvent')) {
      sendEl.setAttribute('useEvent', true);
      sendEl.addEventListener('keydown', function (e) {
        e.stopPropagation();
        if (e.key === 'Enter') {
          if (doubleSubmitChecked) {
            this.value = '';
            return;
          }
          doubleSubmitChecked = true;
          setTimeout(() => {
            if (doubleSubmitChecked) {
              doubleSubmitChecked = false;
            }
          }, 300);

          const msg = e.target.value;
          onMessageSend(msg);
          this.value = '';
          const fragment = new DocumentFragment();
          const liEl = doc.createElement('li');
          liEl.classList.add('me-message');
          const spanEl = doc.createElement('span');
          const msgTextNode = doc.createTextNode(msg || '');
          const dateEl = doc.createElement('p');
          dateEl.classList.add('datetime');
          const dateTextNode = doc.createTextNode(getFormatDate(new Date()));
          dateEl.appendChild(dateTextNode);
          spanEl.appendChild(msgTextNode);
          liEl.appendChild(spanEl);
          liEl.appendChild(dateEl);
          fragment.appendChild(liEl);
          const target = doc.getElementById('chat-list');
          if (target) {
            target.appendChild(fragment);
          }
        }
      });
    }
  }
  function getFormatDate(date) {
    const year = date.getFullYear();
    let month = (1 + date.getMonth());
    month = month >= 10 ? month : '0' + month;
    let day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    let hour = date.getHours();
    hour = hour >= 10 ? hour : '0' + hour;
    let min = date.getMinutes();
    min = min >= 10 ? min : '0' + min;
    let sec = date.getSeconds();
    sec = sec >= 10 ? sec : '0' + sec;
    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
  }
  function requestNotification(data) {
    const notifTitle = 'LQT-CS CLIENT APP';
    const notifBody = `"${data && data.room ? data.room : '임의'}"방에서 "${data && data.sender ? data.sender : 'Guest'}"님이 메시지를 보냈습니다. ${getFormatDate(new Date())}`;
    const options = {
      body: notifBody,
      badge: './images/icons/lqtfe_512x512.png',
      icon: './images/icons/lqtfe_512x512.png',
      image: './images/icons/lqtfe_512x512.png',
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      requireInteraction: true,
      renotify: true,
      data: {url: location.href},
      tag: `lqt-cs`,
    };
    registration.showNotification(notifTitle, options);
  }


  // Socket.io connection
  const socket = io('https://lqt-cs.dev.yanolja.in/chat', {
    transports: ['websocket'],
  });

  socket.on('connect', function () {
    console.log('connect');
    socket.emit('joinRoom', defaultRoomId);
  });
  socket.on('event', function () {
    console.log('event');
  });
  socket.on('disconnect', function () {
    console.log('disconnect');
  });
  socket.on('connect_error', function () {
    console.log('connect_error');
  });
  const receiveChatMessage = (msg) => {
    console.log('recieve msg::', msg);
    if (permission === 'granted') {
      requestNotification(msg);
    }
    proxy['msg'] = msg;
  };
  socket.on('chatToClient', (msg) => {
    if (msg.sender === 'jihoon.moon') {
      return;
    }
    receiveChatMessage(msg);
  });
  const onMessageSend = (msg) => {
    socket.emit('chatToServer', {sender: 'jihoon.moon', messages: msg, room: proxy['roomId'] || defaultRoomId});
  };
});
