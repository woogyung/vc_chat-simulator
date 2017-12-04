/* JS는 이 파일내에서만 작업해주세요. */
// 수정하지 마세요.
import CHAT_DATA from './lib/chatHistory.json';

var chat_data = CHAT_DATA;
var chatContainerView = document.querySelector('#chat-container');

(function () {
  const appController = {
    init: function () {
        var that = this;

        for (var i = 0 ; i < CHAT_DATA.length; i++) {
            (function (time, x) {
                setTimeout(function () {
                    var chat_payload = chat_data[x].payload;
                    var divEl = chatContainerView.appendChild(document.createElement('div'));
                    var chatEl = document.querySelectorAll('#chat-container > div');

                    if (chat_payload.type === 'connect') {
                        chatEl[x].classList.add('connection');
                        var userName = chat_data[x].payload.user.display_name;
                        var connectEl = document.querySelector('.connection');
                        connectEl.innerHTML = '<span class="info"><span class="name">' + userName + '</span> is connected.</span>';
                    } 
                    if (chat_payload.type === 'disconnect') {
                        chatEl[x].classList.add('disconnection');
                        var userName = chat_data[x].payload.user.display_name;
                        var disconnectEl = document.querySelector('.disconnection');
                        disconnectEl.innerHTML = '<span class="info"><span class="name">' + userName + '</span> is disconnection.</span>';
                    }
                    if (chat_payload.type === 'message' && chat_payload.message !== undefined) {
                        var userName = chat_data[x].payload.user.display_name;

                        chatEl[x].innerHTML = '<p class="text"><span class"name">' + userName + '</span>:' + chat_payload.message.text + '</p>';
                    }
                    if (chat_payload.type === 'update' && chat_payload.message !== undefined) {
                        chatEl[x].innerHTML = '<p class="text">' + chat_payload.message.text + '</p>';
                    }
                    if (chat_payload.type === 'delete') {
                        chatEl[x].classList.add('delete');

                        chatEl[x].innerHTML = '<p class="text">DELETE_ELEMENT</p>';
                    }
                }, time);
            })(chat_data[i].delta, i);
        };
    }
  };
  appController.init();
})();
