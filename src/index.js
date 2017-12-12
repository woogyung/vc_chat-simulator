/* JS는 이 파일내에서만 작업해주세요. */

// 수정하지 마세요.
import CHAT_DATA from './lib/chatHistory.json';

// `CHAT_DATA`라는 변수에 채팅 히스토리가 담겨있습니다. 이 데이터를 이용하시면 됩니다.
console.log(CHAT_DATA);

// delta is chatTime interval from start chat simulator
// payload-type = { message, connect, update, delete, disconnect }
// payload-user = { id, user_name, display_name }
// payload-message = { id, text }

var users = {};
var messages = {};
var chatView = document.querySelector('.chat-view');

function startChat(data) {
  var chatTime = 0;
  connectClient({id: 1, user_name: 'taco', display_name: 'Taco Spolsky'});
  connectClient({id: 2, user_name: 'chorizo', display_name: 'Chorizo'});

  data.forEach(function(packet) {
    chatTime += packet.delta;
    setTimeout(packetHandler.bind(null, packet.payload, chatTime), chatTime);
  });
}

function packetHandler(data, chatTime) {

  switch (data.type) {
    case 'message':
      sendMessage(data.user, data.message, chatTime);
      break;
    case 'connect':
      connectClient(data.user);
      break;
    case 'disconnect':
      disconnectClient(data.user);
      break;
    case 'update':
      update(data);
      break;
    case 'delete':
      deleteMessage(data.message.id);
      break;
  }
}

function sendMessage(user, message, chatTime) {
  messages[message.id] = message.text;

  var container = document.createElement('div');
  container.className = 'container';
  container.dataset.id = message.id;

  var nickname = document.createElement('p');
  nickname.className = 'nickName';
  nickname.innerHTML = user.display_name;

  var text = document.createElement('p');
  text.innerHTML = message.text;

  var timeText = document.createElement('span');
  timeText.innerHTML = chatTime;
  timeText.className = 'time-right';

  if (users[1] &&
      user.user_name === users[1].user_name) container.classList.add(
      'darker');

  container.appendChild(nickname);
  container.appendChild(text);
  container.appendChild(timeText);

  send(container);
}

function send(element) {
  chatView.appendChild(element);
}

function connectClient(user) {
  users[user.id] = new User(user);
  send(createSystemMessage('\'' + user.display_name + '\' connected!'));
}

function createSystemMessage(message) {
  var systemMessage = document.createElement('div');
  systemMessage.className = 'system-message';
  systemMessage.innerHTML = message;

  return systemMessage;
}

function disconnectClient(user) {
  delete users[user.id];
  send(createSystemMessage('\'' + user.display_name + '\' disconnected TT'));
}

function update(data) {
  var message = '';
  var cb, param;

  if (data.user) {
    var target = users[data.user.id];
    var pastName = target.display_name;

    cb = updateUserData;
    param = target;
    message = pastName + ' updates name - ' + data.user.display_name;

  } else if (data.message) {

    cb = updateMessage;
    data.message.text += ' (edited)';
    param = data.message;
    message = 'update message id : ' + data.message.id;
  }

  cb(param);
  send(createSystemMessage(message));
}

function updateUserData(target) {
  target.updateInfo(
      {user_name: target.user_name, display_name: target.display_name});
}

function updateMessage(message) {
  var container = document.querySelector('[data-id="' + message.id.toString() +
      '"]');
  container.children[1].innerHTML = message.text;
}

function deleteMessage(id) {

  updateMessage({id: id, text: 'message deleted'});
  send(createSystemMessage('message id_' + id + ' deleted!'));
}

// for connected-friend list
function User(options) {
  this.user_name = options.user_name;
  this.display_name = options.display_name;
  this.id = options.id;
}

User.prototype.updateInfo = function(options) {
  this.user_name = options.user_name;
  this.display_name = options.display_name;
};

startChat(CHAT_DATA);
