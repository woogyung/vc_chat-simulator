/* JS는 이 파일내에서만 작업해주세요. */
// 수정하지 마세요.
import CHAT_DATA from './lib/chatHistory.json';

(function () {
  const chatData = CHAT_DATA.map((data) => {
    return new ChatData(data);
  });

  const emojiData = {
    facepalm: '🤦',
    scream_cat: '🙀',
    ghost: '👻'
  };

  const chatDataType = {
    connect: 'connect',
    disconnect: 'disconnect',
    update: 'update',
    delete: 'delete',
    message: 'message',
  };

  function ChatData(data) {
    this.data = data;
  }

  ChatData.prototype.getDelta = function getDelta() {
    return this.data.delta;
  };

  ChatData.prototype.getType = function getType() {
    return this.data.payload.type;
  };

  ChatData.prototype.getUser = function getUser() {
    return this.data.payload.user;
  };

  ChatData.prototype.getMessage = function getMessage() {
    return this.data.payload.message;
  };

  ChatData.prototype.setMessageText = function setMessageText(text) {
    this.data.payload.message.text = text;
  };

  ChatData.prototype.isMessageAndMatchedById = function isMessageAndMatchedById(id) {
    return this.getType() === chatDataType.message && this.getMessage().id === id;
  };

  function View() {
    this.element = null;
  }

  function ChatContainerView(selector) {
    View.call(this);

    this.chatItemViews = [];

    this.element = document.querySelector(selector);
  }

  ChatContainerView.prototype = Object.create(View.prototype);
  ChatContainerView.prototype.constructor = ChatContainerView;

  ChatContainerView.prototype.add = function add(chatItemView) {
    this.chatItemViews.push(chatItemView);
    this.element.appendChild(chatItemView.element);
  };

  ChatContainerView.prototype.remove = function remove(id) {
    for (let i = 0; i < this.chatItemViews.length; i++) {
      const view = this.chatItemViews[i];

      if (!view.data.isMessageAndMatchedById(id)) {
        continue;
      }

      view.element.remove();
      this.chatItemViews.splice(i, 1);
      break;
    }
  };

  ChatContainerView.prototype.update = function update(chatData) {
    if (chatData.getMessage()) {
      this.updateMessage(chatData);
    } else {
      this.updateUser(chatData);
    }
  };

  ChatContainerView.prototype.updateMessage = function updateMessage(chatData) {
    const message = chatData.getMessage();

    for (let i = 0; i < this.chatItemViews.length; i++) {
      const view = this.chatItemViews[i];

      if (!view.data.isMessageAndMatchedById(message.id)) {
        continue;
      }

      view.data.setMessageText(message.text);
      view.createBody();
      break;
    }
  };

  ChatContainerView.prototype.updateUser = function updateUser(chatData) {
    const updatedUser = chatData.getUser();

    this.chatItemViews.forEach((view) => {
      const user = view.data.getUser();

      if (user.id !== updatedUser.id) {
        return;
      }

      user.user_name = updatedUser.user_name;
      user.display_name = updatedUser.display_name;
      view.createBody();
    });
  };

  function ChatItemView(chatData) {
    View.call(this);

    this.data = chatData;

    this.element = document.createElement('div');
    this.element.className = 'chat';

    this.createBody();
  }

  ChatItemView.prototype = Object.create(View.prototype);
  ChatItemView.prototype.constructor = ChatItemView;

  ChatItemView.prototype.createBody = function createBody() {
  };

  function MessageChatItemView(chatData) {
    ChatItemView.call(this, chatData);
  }

  MessageChatItemView.prototype.createBody = function createBody() {
    let text = this.data.getMessage().text;
    text = text.replace(/(\*)(.*)(\*)/g, `<i>$2</i>`);
    text = text.replace(/(_)(.*)(_)/g, `<i>$2</i>`);
    text = text.replace(/(:)(.*)(:)/g, (match, p1, p2) => {
      return emojiData[p2];
    });

    this.element.innerHTML = `<span>${this.data.getUser().display_name} : ${text}</span>`;
  };

  function InfoChatItemView(chatData) {
    ChatItemView.call(this, chatData);
  }

  InfoChatItemView.prototype = Object.create(MessageChatItemView);
  InfoChatItemView.prototype.constructor = InfoChatItemView;

  InfoChatItemView.prototype.createBody = function createBody() {
    const dataType = this.data.getType();

    if (dataType === chatDataType.connect) {
      this.element.innerHTML = `<span class="info">${this.data.getUser().display_name} is connected.</span>`;
    } else if (dataType === chatDataType.disconnect) {
      this.element.innerHTML = `<span class="info">${this.data.getUser().display_name} is disconnected.</span>`;
    }
  };

  const appController = {
    init: function init() {
      this.chatData = chatData;

      this.chatContainerView = new ChatContainerView('#chat-container');

      this.chatData.forEach((data) => {
        setTimeout(() => {
          const dataType = data.getType();

          switch (dataType) {
            case chatDataType.message:
              this.chatContainerView.add(new MessageChatItemView(data));
              break;
            case chatDataType.connect:
            case chatDataType.disconnect:
              this.chatContainerView.add(new InfoChatItemView(data));
              break;
            case chatDataType.update:
              this.chatContainerView.update(data);
              break;
            case chatDataType.delete:
              this.chatContainerView.remove(data.getMessage().id);
              break;
          }
        }, data.getDelta());
      });
    }
  };

  appController.init();
})();
