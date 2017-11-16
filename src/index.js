/* JS는 이 파일내에서만 작업해주세요. */

// 수정하지 마세요.
import CHAT_DATA from './lib/chatHistory.json';

// `CHAT_DATA`라는 변수에 채팅 히스토리가 담겨있습니다. 이 데이터를 이용하시면 됩니다.
console.log(CHAT_DATA);

function View() {
    this.element = null;
}

function ChatContainerView(selector) {
    View.call(this);

    this.element = document.querySelector(selector);
}

ChatContainerView.prototype = Object.create(View.prototype);
ChatContainerView.prototype.constructor = ChatContainerView;

ChatContainerView.prototype.addMessage = function addMessage(messageView) {
    this.element.appendChild(messageView.element);
};

debugger;
