/* JS는 이 파일내에서만 작업해주세요. */

// 수정하지 마세요.
import CHAT_DATA from './lib/chatHistory.json';

// `CHAT_DATA`라는 변수에 채팅 히스토리가 담겨있습니다. 이 데이터를 이용하시면 됩니다.
console.log(CHAT_DATA);


var chat = document.querySelector('.chat');


for (var i = 0; i < CHAT_DATA.length; i++) {
    setTimeout(function(x) {
        return function() {

            if (CHAT_DATA[x].payload.type === 'connect') {
                var para = document.createElement("P");
                var text = document.createTextNode('************* ' + CHAT_DATA[x].payload.user.display_name + '님이 접속 하였습니다 *************');
                para.appendChild(text);
                chat.appendChild(para);

            } else if (CHAT_DATA[x].payload.type === 'disconnect') {
                var para = document.createElement("P");
                var text = document.createTextNode('************* ' + CHAT_DATA[x].payload.user.display_name + '님이 퇴장 하였습니다 *************');
                para.appendChild(text);
                chat.appendChild(para);

            } else if (CHAT_DATA[x].payload.type === 'message' && CHAT_DATA[x].payload.message !== undefined) { 
                var h3 = document.createElement("h3"); 
                var userName = document.createTextNode(CHAT_DATA[x].payload.user.display_name); 
                h3.appendChild(userName);
                chat.appendChild(h3); 

                var para = document.createElement("P"); 
                var text = document.createTextNode(CHAT_DATA[x].payload.message.text);
                para.appendChild(text); 
                chat.appendChild(para); 

            } else if (CHAT_DATA[x].payload.type === 'update' && CHAT_DATA[x].payload.message !== undefined) {
                var para = document.createElement("P");  
                var text = document.createTextNode(CHAT_DATA[x].payload.message.text); 
                para.appendChild(text); 
                chat.appendChild(para); 

            } else {
                var para = document.createElement("P");
                var text = document.createTextNode('************* 메시지 삭제하였습니다  *************');
                para.appendChild(text);
                chat.appendChild(para);
            }
            window.scrollTo(0, document.body.scrollHeight);
        };
    }(i), CHAT_DATA[i].delta);
} //loop end

