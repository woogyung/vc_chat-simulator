/* JS는 이 파일내에서만 작업해주세요. */

// 수정하지 마세요.
import CHAT_DATA from './lib/chatHistory.json';

// `CHAT_DATA`라는 변수에 채팅 히스토리가 담겨있습니다. 이 데이터를 이용하시면 됩니다.
(function (){
    var chatContainer = document.getElementById('chatContainer');
    var chatListParent = document.createElement('ul');
        chatContainer.appendChild(chatListParent);
    
    var appController = {
        createMessageListElement : function (data) {
            var messageList = document.createElement('li');
            var box = document.createElement('div');

            var userInfoElement = document.createElement('span');
                userInfoElement.setAttribute('class', 'user_name');
                userInfoElement.setAttribute('data-user-id', data.user.id);
                userInfoElement.textContent = data.user.display_name +' ('+ data.user.user_name +')';

            var messageElement = document.createElement('span');
                messageElement.setAttribute('class', 'message');
                messageElement.setAttribute('data-message-id', data.message.id);
                messageElement.textContent = data.message.text;
            
            box.setAttribute('class', 'user_' + data.user.id);
            box.appendChild(userInfoElement);
            box.appendChild(messageElement);

            messageList.appendChild(box);

            return messageList;
        },
        createConnectingListElement : function (data) {
            var connectingList = document.createElement('li');
                connectingList.setAttribute('class', 'connecting');
            
            var userInfoElement = document.createElement('span');
                userInfoElement.setAttribute('class', data.type);
                userInfoElement.textContent = data.user.display_name +' ('+ data.user.user_name +') * - '+ data.type +' - *';
            
            connectingList.appendChild(userInfoElement);

            return connectingList;
        },
        upDateAndDeleteElement : function (data) {
            for (var key in data) {
                if(key === 'user') {
                    var updateUserNameElement = chatContainer.querySelectorAll('.user_name');
                    for (var i = 0; i < updateUserNameElement.length; i++) {
                        if (Number(updateUserNameElement[i].dataset.userId) === data[key].id) {
                            updateUserNameElement[i].textContent = data[key].display_name +'('+ data[key].user_name +') (edited)';
                        }
                    }
                }
                
                if (key === 'message') {
                    var updateMessageElement = chatContainer.querySelectorAll('.message');
                    for (var i = 0; i < updateMessageElement.length; i++) {
                        if (Number(updateMessageElement[i].dataset.messageId) === data[key].id) {
                            updateMessageElement[i].parentElement.parentElement.classList.add('delete');
                        }
                    }
                }
            }
        },
        DataTypeValidation : function (chat_data) {
            for (var i = 0; i < chat_data.length; i++) {
                var time = chat_data[i].delta;
                var type = chat_data[i].payload.type;
                var data = chat_data[i].payload;
                
                if (type === 'message') {
                    this.timer(data, this.createMessageListElement, time, true);
                }
                
                if (type === 'connect' || type === 'disconnect') {
                    this.timer(data, this.createConnectingListElement, time, true);
                }
                
                if (type === 'update' || type === 'delete') {
                    this.timer(data, this.upDateAndDeleteElement, time, false);
                }
            }
        },
        timer : function (data, cb, time, boolean) {
            setTimeout(function () {
                if (boolean) {
                    var result = cb(data);
                    chatListParent.appendChild(result);
                    chatListParent.scrollTo(0, result.offsetTop);    
                } else {
                    cb(data);
                }
            }, time);
        },
        init : function () {
            this.DataTypeValidation(CHAT_DATA);
        }
    }

    appController.init();

})();
