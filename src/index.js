/* JS는 이 파일내에서만 작업해주세요. */

// 수정하지 마세요.
import CHAT_DATA from './lib/chatHistory.json';

// `CHAT_DATA`라는 변수에 채팅 히스토리가 담겨있습니다. 이 데이터를 이용하시면 됩니다.

(function(){
	var chatDataLen = CHAT_DATA.length ;
	var data;
	var chatDatIndex = 0;
	var userIndex_id;
	var userIndex_dpName;
	var userIndex_messageId;
	var userIndex_messageText;
	var userIndex_messageId;

	var chatDataModel = (function () {

		return{
			chatIndexSum: function(){
				chatDatIndex++;
			},
			messageData: function(){
				userIndex_id = CHAT_DATA[chatDatIndex].payload.user.id;
				userIndex_dpName = CHAT_DATA[chatDatIndex].payload.user.display_name;
				userIndex_messageId = CHAT_DATA[chatDatIndex].payload.message.id;
				userIndex_messageText = CHAT_DATA[chatDatIndex].payload.message.text;
			},
			connect: function(){
				userIndex_id = CHAT_DATA[chatDatIndex].payload.user.id;
				userIndex_dpName = CHAT_DATA[chatDatIndex].payload.user.display_name;
			},
			msgUpdate: function(){
				userIndex_messageText = CHAT_DATA[chatDatIndex].payload.message.text;
				userIndex_messageId = CHAT_DATA[chatDatIndex].payload.message.id;
			},
			msgDelete: function(){
				userIndex_messageId = CHAT_DATA[chatDatIndex].payload.message.id;
			}
		}
	})();

	function View (selector) {
		this.element = document.querySelector(selector);
	};
	View.prototype.scrollDown = function () {
		this.element.scrollTop = this.element.scrollHeight;
	};
	function ViewAllSelector (selector) {
		this.element = document.querySelectorAll(selector);
	};
	ViewAllSelector.prototype = Object.create(View.prototype);
	ViewAllSelector.prototype.constructor = ViewAllSelector;

	function MessageWriteView(selector,msgType){
		View.call(this, selector);
		var msgBox = document.createElement('div');
		var UserMessage = document.createElement('p');
		if( msgType === "message" ){
			chatDataModel.messageData();
			var userName = document.createElement('span');
			userName.dataset.userid = userIndex_id;
			userName.classList.add('userName');
			msgBox.appendChild(userName);
			UserMessage.dataset.msgid = userIndex_messageId;
			UserMessage.classList.add('message');
		}
        msgBox.appendChild(UserMessage);
        this.element.appendChild(msgBox);
	};
	MessageWriteView.prototype = Object.create(View.prototype);
	MessageWriteView.prototype.constructor = MessageWriteView;

	MessageWriteView.prototype.userMessagePrint = function (chatType, dataIndex , cb) {
		var allELSelect = this.element.querySelectorAll("div");
		if( chatType === "message" ){
			allELSelect[dataIndex].querySelector('span').innerHTML = userIndex_dpName;
			allELSelect[dataIndex].querySelector('p').innerHTML = userIndex_messageText;
			cb(userIndex_messageText);
		}else if( chatType === "connect" ){
			chatDataModel.connect();
			allELSelect[dataIndex].querySelector('p').innerHTML = userIndex_dpName + "님이 접속 하셨습니다.";
		}else if( chatType === "disconnect" ){
			chatDataModel.connect();
			allELSelect[dataIndex].querySelector('p').innerHTML = userIndex_dpName + "님이 나가셨습니다.";
		}else if( chatType === "update" ){
			if( CHAT_DATA[dataIndex].payload.user ){
				chatDataModel.connect();
				appController.dpNameUpdateView = new ViewAllSelector('[data-userid="' + userIndex_id + '"]');
				var prevUserName = appController.dpNameUpdateView.element[0].textContent;
				allELSelect[dataIndex].querySelector('p').innerHTML = prevUserName + " 님이 대화명을" + userIndex_dpName + " 로 변경 하였습니다.";
				for( var i = 0 ; i < appController.dpNameUpdateView.length ; i++ ){
					appController.dpNameUpdateView.element[i].textContent = userIndex_dpName;
				}
			}else{
				chatDataModel.msgUpdate();
				var allELSelectmsgid = document.querySelectorAll('[data-msgid="' + userIndex_messageId + '"]');
				allELSelectmsgid[0].textContent = userIndex_messageText + "(메시지 수정)";
			}
		}else if( chatType === "delete" ){
			chatDataModel.msgDelete();
			var allELSelectmsgid = document.querySelectorAll('[data-msgid="' + userIndex_messageId + '"]');
			allELSelectmsgid[0].textContent = "(메시지를 삭제 하였습니다.)";
		}
	};

	var appController = {
		userTalkMessage: function (el , chatType) {
			console.log("111");
		},
		init: function () {
			var chatBoxView = new View('.chatBox');
			var messageStart = setInterval(function(){
				var chatType = CHAT_DATA[chatDatIndex].payload.type;
				var messageWriteView = new MessageWriteView('.chatBox',chatType);
				messageWriteView.userMessagePrint(chatType, chatDatIndex , appController.userTalkMessage.bind(this));
				if(chatDatIndex === chatDataLen-1 ){
					clearInterval(messageStart);
				}
				chatDataModel.chatIndexSum();
				chatBoxView.scrollDown();
			}, CHAT_DATA[chatDatIndex].delta );
		}
	};
 	appController.init();
})();