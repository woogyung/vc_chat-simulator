/* JS는 이 파일내에서만 작업해주세요. */

// 수정하지 마세요.
import CHAT_DATA from './lib/chatHistory.json';

// `CHAT_DATA`라는 변수에 채팅 히스토리가 담겨있습니다. 이 데이터를 이용하시면 됩니다.
console.log(CHAT_DATA);

// delta is time interval from start chat simulator
// payload-type = [message, connect, update, delete, disconnect]
// payload-user = { id, user_name, display_name }
// payload-message = { id, text }

function ChatSimulator(CHAT_DATA) {
  this.chatData = CHAT_DATA;
  this.mainUser = new User(
      {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'});
  this.users = {
    1: this.mainUser,
    2: new User({id: 2, user_name: 'chorizo', display_name: 'Chorizo'}),
  };
  this.messages = {};
  this.chatView = document.querySelector('.chat-view');
  this.time = 0;
}

ChatSimulator.prototype.startChat = function() {
  var self = this;

  this.chatData.forEach(function(packet) {
    self.time += packet.delta;
    self.packetHandler(packet);
  });

};

ChatSimulator.prototype.connectClient = function(user) {
  this.users[user.id] = new User(user);
  this.send(
      this.createSystemMessage('\'' + user.display_name +
          '\' connected!'),
      this.time);
};

ChatSimulator.prototype.disconnectClient = function(user) {
  delete this.users[user.id];
  this.send(this.createSystemMessage('\'' + user.display_name +
      '\' disconnected TT'),
      this.time);
};

ChatSimulator.prototype.sendMessage = function(user, message) {
  this.messages[message.id] = message.text;

  var container = document.createElement('div');
  container.className = 'container';
  container.id = message.id;

  var nickname = document.createElement('p');
  nickname.className = 'nickName';
  nickname.innerHTML = user.display_name;

  var text = document.createElement('p');
  text.innerHTML = message.text;

  var time = document.createElement('span');
  time.innerHTML = this.time;
  time.className = 'time-right';

  if (user.user_name === this.mainUser.user_name) container.classList.add(
      'darker');

  container.appendChild(nickname);
  container.appendChild(text);
  container.appendChild(time);

  this.send(container, this.time);
};

ChatSimulator.prototype.deleteMessage = function(id) {
  var self = this;
  setTimeout(function() {
    self.updateMessage({id : id, text: 'message deleted'});
  }, this.time);

  this.send(this.createSystemMessage('message id_' + id +
      ' deleted!'), this.time);
};

ChatSimulator.prototype.createSystemMessage = function(message) {
  var systemMessage = document.createElement('div');
  systemMessage.className = 'system-message';
  systemMessage.innerHTML = message;

  return systemMessage;
};

ChatSimulator.prototype.send = function(element, delta) {
  var self = this;
  setTimeout(function() {
    self.chatView.appendChild(element);
  }, delta);
};

ChatSimulator.prototype.update = function(data) {
  var message = '';
  var cb, param;

  if (data.user) {
    var target = this.users[data.user.id];
    var pastName = target.display_name;

    cb = this.updateUserData;
    param = target;
    message = pastName + ' updates name - ' + data.user.display_name;

  } else if (data.message) {

    cb = this.updateMessage;
    data.message.text += ' (edited)';
    param = data.message;
    message = 'update message id : ' + data.message.id;
  }

  setTimeout(cb.bind(this, param), this.time);
  this.send(this.createSystemMessage(message), this.time);
};

ChatSimulator.prototype.updateMessage = function(message) {
  var container = document.getElementById(message.id.toString());
  container.children[1].innerHTML = message.text;
};

ChatSimulator.prototype.updateUserData = function(target) {
  target.updateInfo(
      {user_name: target.user_name, display_name: target.display_name});
};

ChatSimulator.prototype.packetHandler = function(packet) {
  var payload = packet.payload;

  switch (payload.type) {
    case 'message':
      this.sendMessage(payload.user, payload.message);
      break;
    case 'connect':
      this.connectClient(payload.user);
      break;
    case 'disconnect':
      this.disconnectClient(payload.user);
      break;
    case 'update':
      this.update(payload);
      break;
    case 'delete':
      this.deleteMessage(payload.message.id);
      break;
  }
};

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

(new ChatSimulator(CHAT_DATA)).startChat();
