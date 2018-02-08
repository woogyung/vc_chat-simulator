/* JS는 이 파일내에서만 작업해주세요. */

// 수정하지 마세요.
import CHAT_DATA from './lib/chatHistory.json';

// `CHAT_DATA`라는 변수에 채팅 히스토리가 담겨있습니다. 이 데이터를 이용하시면 됩니다.

(function(){
  var _CHAT_DATA = CHAT_DATA;
  var chatWrapEl = document.querySelector('.chat-wrap');

  var MESSAGE   = 'message';
  var CONNECT   = 'connect';
  var DISCONECT = 'disconnect';
  var UPDATE    = 'update';
  var DELETE    = 'delete';

  var chat = {
    createEl : function (els, data) {
      var chatEl = document.createElement('div');

      if(data.type === MESSAGE){
        chatEl.className = `msg-${data.message.id}`;
      }

      if(data.type === UPDATE){
        if(data.message !== undefined){
          return;
        }
      }

      chatEl.classList.add('chat');
      chatEl.innerHTML = els;
      chatWrapEl.appendChild(chatEl);
    },
    messageView : function (data){
      var messageEl = `<div class="user-wrap">
                    <div class="user-nic"> ${data.user.display_name} </div>
                    <div class="user-id"> ${data.user.user_name} </div>
                  </div>
                  <div class="message-wrap">
                    <div class="message"> ${data.message.text} </div>
                  </div>`;
      return messageEl;
    },
    connectView : function(data){
      return `<div class="status"> ${data.user.display_name} (${data.user.user_name})님이 입장하셨습니다.</div>`;
    },
    disconnectView : function (data){
      return `<div class="chat">
                  <div class="status ${data.type}"> ${data.user.display_name} (${data.user.user_name})님이 퇴장
                  하셨습니다.</div>
                </div>`;
    },
    updateView : function (data) {
      var updateData;

      if(data.user !== undefined){
        updateData = `${data.user.user_name}(${data.user.display_name})으로 변경하였습니다.`
        return `<div class="chat">
                    <div class="status ${data.type}">${updateData}</div>
                  </div>`;
      }

      if(data.message !== undefined){
        var updateEl = document.querySelector(`.msg-${data.message.id}`);
        var messageEl = updateEl.querySelector('.message');

        messageEl.innerHTML = data.message.text + '<span class="edited">(edited)</span>';
      }

    },
    deleteView : function (data){
      var target = document.querySelector(`.msg-${data.message.id}`);

      chatWrapEl.removeChild(target);
      console.error('delete');
    },
    scrollMove : function () {
      var currentUIPosition = document.body.scrollHeight;
      document.body.scrollTop = currentUIPosition;
    },
    init : function(){
      for(let i = 0; i < _CHAT_DATA.length; i++){

        setTimeout(function () {
          if(_CHAT_DATA[i].payload.type === MESSAGE){
            chat.createEl(chat.messageView(_CHAT_DATA[i].payload), _CHAT_DATA[i].payload);

          }else if(_CHAT_DATA[i].payload.type === CONNECT){
            chat.createEl(chat.connectView(_CHAT_DATA[i].payload), _CHAT_DATA[i].payload);

          }else if(_CHAT_DATA[i].payload.type === DISCONECT){
            chat.createEl(chat.disconnectView(_CHAT_DATA[i].payload), _CHAT_DATA[i].payload);

          }else if (_CHAT_DATA[i].payload.type === UPDATE){
            chat.createEl(chat.updateView(_CHAT_DATA[i].payload), _CHAT_DATA[i].payload);

          }else if (_CHAT_DATA[i].payload.type=== DELETE){
            chat.deleteView(CHAT_DATA[i].payload);

          }
          chat.scrollMove();
        }, _CHAT_DATA[i].delta);
      }
    }
  }
  chat.init();
})();
