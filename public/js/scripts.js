// io(namespace)
// namespace는 http end-point의 socket 버전이라고 생각하면 된다.

const socket = io('/chattings'); // namespace가 root로 연결

const getElementById = (id) => document.getElementById(id) || null;

const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

/** global socket handler **/
socket.on('connected_user', (username) => {
  drawNewChat(`${username} 님이 입장하셨습니다.`);
});

socket.on('disconnect_user', (username) => {
  drawNewChat(`${username} 님이 퇴장하셨습니다.`);
});

socket.on('new_chat', (data) => {
  const { message, username } = data;
  drawNewChat(`${username}: ${message}`);
});

/** event callback function **/
const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;

  if (inputValue !== '') {
    socket.emit('submit_chat', inputValue);
    drawNewChat(`me: ${inputValue}`, true);
    event.target.elements[0].value = '';
  }
};

const drawHelloStranger = (username) => {
  helloStrangerElement.innerText = `Hello!  ${username} Stranger :)`;
};

const drawNewChat = (message, isMe = false) => {
  const wrapperChatBox = document.createElement('div');
  wrapperChatBox.className = 'clearfix';
  let chatBox;
  if (!isMe)
    chatBox = `
    <div class='bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;
  else
    chatBox = `
    <div class='bg-white w-3/4 ml-auto mr-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

function helloUser() {
  const username = prompt('닉네임을 입력해주세요.');

  socket.emit('new_user', username, (data) => {
    drawHelloStranger(data);
  });
}

function init() {
  helloUser();
  formElement.addEventListener('submit', handleSubmit);
}

init();
