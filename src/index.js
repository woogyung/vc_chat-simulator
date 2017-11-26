/* JS는 이 파일내에서만 작업해주세요. */
// 수정하지 마세요.
import CHAT_DATA from './lib/chatHistory.json';

(function () {
  const emojiData = {
    facepalm: '🤦',
    scream_cat: '🙀',
    sob: '😭',
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

      const dataset = view.getDataset();

      if (dataset.type === 'message' && dataset.messageId === String(id)) {
        view.element.remove();
        this.chatItemViews.splice(i, 1);
        break;
      }
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

      const dataset = view.getDataset();
      if (dataset.type === 'message' && dataset.messageId === String(message.id)) {
        view.updateMessage(message.text);
        break;
      }
    }
  };

  ChatContainerView.prototype.updateUser = function updateUser(chatData) {
    const updatedUser = chatData.getUser();

    this.chatItemViews.forEach((view) => {
      const userId = view.getDataset().userId;

      if (userId !== String(updatedUser.id)) {
        return;
      }

      view.updateDisplayName(chatData.getUser().display_name);
    });
  };

  function ChatItemView(chatData) {
    View.call(this);

    this.element = document.createElement('div');
    this.element.className = 'chat';
    this.element.dataset.type = chatData.getType();
    this.element.dataset.userId = chatData.getUser().id;
  }

  ChatItemView.prototype = Object.create(View.prototype);
  ChatItemView.prototype.constructor = ChatItemView;

  ChatItemView.prototype.getDataset = function getDataset() {
    return this.element.dataset;
  };

  function MessageChatItemView(chatData) {
    ChatItemView.call(this, chatData);

    this.element.dataset.messageId = chatData.getMessage().id;

    this.createBody(chatData)
  }

  MessageChatItemView.prototype = Object.create(ChatItemView.prototype);
  MessageChatItemView.prototype.constructor = MessageChatItemView;

  MessageChatItemView.prototype.createBody = function createBody(chatData) {
    let text = chatData.getMessage().text;
    text = text.replace(/(\*)(.*)(\*)/g, `<i>$2</i>`);
    text = text.replace(/(_)(.*)(_)/g, `<i>$2</i>`);
    text = text.replace(/(:)(.*)(:)/g, (match, p1, p2) => {
      return emojiData[p2];
    });

    this.element.innerHTML = `<span><span class="name">${chatData.getUser().display_name}</span> : <span class="message">${text}</span></span>`;
  };

  MessageChatItemView.prototype.updateDisplayName = function updateDisplayName(displayName) {
    this.element.querySelector('.name').innerText = displayName;
  };

  MessageChatItemView.prototype.updateMessage = function updateMessage(text) {
    text = text.replace(/(\*)(.*)(\*)/g, `<i>$2</i>`);
    text = text.replace(/(_)(.*)(_)/g, `<i>$2</i>`);
    text = text.replace(/(:)(.*)(:)/g, (match, p1, p2) => {
      return emojiData[p2];
    });

    this.element.querySelector('.message').innerHTML = text;
  };

  function InfoChatItemView(chatData) {
    ChatItemView.call(this, chatData);

    this.createBody(chatData)
  }

  InfoChatItemView.prototype = Object.create(ChatItemView.prototype);
  InfoChatItemView.prototype.constructor = InfoChatItemView;

  InfoChatItemView.prototype.createBody = function createBody(chatData) {
    const dataType = chatData.getType();

    if (dataType === chatDataType.connect) {
      this.element.innerHTML = `<span class="info"><span class="name">${chatData.getUser().display_name}</span> is connected.</span>`;
    } else if (dataType === chatDataType.disconnect) {
      this.element.innerHTML = `<span class="info"><span class="name">${chatData.getUser().display_name}</span> is disconnected.</span>`;
    }
  };

  MessageChatItemView.prototype.updateDisplayName = function updateDisplayName(displayName) {
    this.element.querySelector('.name').innerText = displayName;
  };

  const chatData = CHAT_DATA.map((data) => {
    return new ChatData(data);
  });

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
