/* JS는 이 파일내에서만 작업해주세요. */

// 수정하지 마세요.
import CHAT_DATA from './lib/chatHistory.json';
import Messenger from './messenger.js';
// `CHAT_DATA`라는 변수에 채팅 히스토리가 담겨있습니다. 이 데이터를 이용하시면 됩니다.

(function(){

	var USER_MESSAGE_WRITE = 'USER_MESSAGE_WRITE';
	var USER_CONNECT = 'USER_CONNECT';
	var USER_DISCONNECT = 'USER_DISCONNECT';
	var USER_NAME_UPDATE = 'USER_NAME_UPDATE';
	var USER_MESSAGE_UPDATE = 'USER_MESSAGE_UPDATE';	
	var USER_MESSAGE_DELETE = 'USER_MESSAGE_DELETE';

	var chatDataLen = CHAT_DATA.length ;
	var prevUserName;
	var chatData;
	var chatUserName;
	var chatDatIndex = 0;
	var chatDataModel = (function () {
		return{
			chatIndexSum: function(){
				chatDatIndex++;
			},
			messageData: function(){
				chatData = CHAT_DATA[chatDatIndex].payload;
			},
			userNameData: function(){
				var userName = [];
				for(var i = 0 ; i < chatDataLen ; i++ ){
					if( CHAT_DATA[i].payload.user !== undefined ){
						userName.push(CHAT_DATA[i].payload.user.user_name);
					}
				}
				chatUserName = userName.reduce(function(a,b){
					if (a.indexOf(b) < 0 ) a.push(b);
					return a.reverse();
				},[]);	
			}
		}
	})();

	function View (selector) {
		this.element = document.querySelector(selector);
	};
	View.prototype.msgDelOrUpdate = function (msg) {
		this.element.innerHTML = msg;
	};
	View.prototype.scrollDown = function () {
		this.element.scrollTop = this.element.scrollHeight;
	};
	function ViewAllSelector (selector) {
		this.element = document.querySelectorAll(selector);
	};
	ViewAllSelector.prototype = Object.create(View.prototype);
	ViewAllSelector.prototype.constructor = ViewAllSelector;

	function TargetSelect (selector) {
		View.call(this, selector);
		this.element = this.element.querySelectorAll("div");
	};
	TargetSelect.prototype = Object.create(View.prototype);
	TargetSelect.prototype.constructor = TargetSelect;
	TargetSelect.prototype.innerMessage = function ( selector, msg ) {
		this.element[chatDatIndex].querySelector(selector).innerHTML = msg;
	};
	
	function MessageWriteView(selector,msgType){
		View.call(this, selector);
		var msgBox = document.createElement('div');
		var UserMessage = document.createElement('p');
		if( msgType === "message" ){
			var userName = document.createElement('span');
			userName.dataset.userid = chatData.user.id;
			userName.classList.add('userName');
			msgBox.appendChild(userName);
			UserMessage.dataset.msgid = chatData.message.id;
			UserMessage.classList.add('message');
		}
        msgBox.appendChild(UserMessage);
        this.element.appendChild(msgBox);
	};
	MessageWriteView.prototype = Object.create(View.prototype);
	MessageWriteView.prototype.constructor = MessageWriteView;
	MessageWriteView.prototype.userEmojiConversion = function (chatType, dataIndex , cb) {
		if( chatData.message !== undefined && chatData.message.text ){
			var emojiStr;
			var emojiClass;
			var emoji;
			if( chatData.message.text.match("https://") ){
				var pos = chatData.message.text.indexOf("https://");
				var strarr = chatData.message.text.split("https://");
				emojiStr = "https://" + strarr[1];
				emoji = "<a href='https://"+strarr[1]+"' target='_blank'>https://"+strarr[1]+"</a> ";
			}
			if( chatData.message.text.indexOf("@") > -1 ){
				var emojiPos = [];
				var emojiPosArr = [];
				for( var i=0 ; i < chatUserName.length; i++ ){
					if( chatData.message.text.match( "@"+chatUserName[i]) ){
						emojiPos.push("@"+chatUserName[i]);
					}
				}
				for( var i=0; i < emojiPos.length ; i++ ){
					emojiPosArr.push("<span class='userName'>"+emojiPos[i]+"</span>");
					chatData.message.text = chatData.message.text.replaceAll(emojiPos[i],emojiPosArr[i]);
				}
			}
			if( chatData.message.text.match(":") ){
				var emojiPos = [];
				var pos = chatData.message.text.indexOf(":");
				while(pos > -1){
				    emojiPos.push(pos);
				    pos =  chatData.message.text.indexOf(":", pos + 1);
				}
				if( emojiPos.length > 1 ){
					emojiStr = chatData.message.text.slice(emojiPos[0],emojiPos[1]+1);
					emojiClass = chatData.message.text.slice(emojiPos[0]+1,emojiPos[1]);
					emoji = "<span class='"+emojiClass+"'></span>";
				}
			}
			if( chatData.message.text.indexOf("*") > -1 ){
				var emojiPos = [];
				var pos = chatData.message.text.indexOf("*");
				while(pos > -1){
				    emojiPos.push(pos);
				    pos =  chatData.message.text.indexOf("*", pos + 1);
				}
				if( emojiPos.length > 1 ){
					emojiStr = chatData.message.text.slice(emojiPos[0],emojiPos[1]+1);
					emojiClass = chatData.message.text.slice(emojiPos[0]+1,emojiPos[1]);
					emoji = "<span class='boldText'>"+emojiClass+"</span>";
				}
			}
			String.prototype.replaceAll = function(emojiStr, emoji) {
		   		return this.split(emojiStr).join(emoji);
			}
			chatData.message.text = chatData.message.text.replaceAll(emojiStr,emoji);
		}
		cb(dataIndex);
	};
	var appController = {
		userTalkMessage: function (dataIndex) {
			if( chatData.type === "message" ){
				messenger.publish(USER_MESSAGE_WRITE);
			}else if( chatData.type === "connect" ){
				messenger.publish(USER_CONNECT);
			}else if( chatData.type === "disconnect" ){
				messenger.publish(USER_DISCONNECT);
			}else if( chatData.type === "update" ){
				if( chatData.user ){
					this.dpNameUpdateView = new ViewAllSelector('[data-userid="' + chatData.user.id + '"]');
					prevUserName = this.dpNameUpdateView.element[0].textContent;
					messenger.publish(USER_NAME_UPDATE);
				}else{
					messenger.publish(USER_MESSAGE_UPDATE);
				};
			}else if( chatData.type === "delete" ){
				messenger.publish(USER_MESSAGE_DELETE);
			};
		},
		userMessageWrite: function () {
			this.targetSelect.innerMessage('span',chatData.user.display_name);
			this.targetSelect.innerMessage('p',chatData.message.text);
		},
		userConnect: function () {
			this.targetSelect.innerMessage('p',chatData.user.display_name + "님이 접속 하셨습니다.");
		},
		userDisconnect: function () {
			this.targetSelect.innerMessage('p',chatData.user.display_name + "님이 나가셨습니다.");
		},
		userNameUpdate: function () {
			this.targetSelect.innerMessage('p', prevUserName + " 님이 대화명을" + chatData.user.display_name + " 로 변경 하였습니다.");
			for( var i = 0 ; i < this.dpNameUpdateView.element.length ; i++ ){
				this.dpNameUpdateView.element[i].textContent = chatData.user.display_name;
			}
		},
		userMessageUpdate: function () {
			this.allSelectMsgId = new View('[data-msgid="' + chatData.message.id + '"]');
			this.allSelectMsgId.msgDelOrUpdate(chatData.message.text + "(메시지 수정)");
		},
		userMessageDelete: function () {
			this.allSelectMsgId = new View('[data-msgid="' + chatData.message.id + '"]');
			this.allSelectMsgId.msgDelOrUpdate("(메시지를 삭제 하였습니다.)");
		},

		init: function () {
			this.chatBoxView = new View('.chatBox');
			var that = this;
			var messageStart = setInterval(function(){

				chatDataModel.messageData();
				messenger.subscribe(USER_MESSAGE_WRITE, that.userMessageWrite.bind(this));
				messenger.subscribe(USER_CONNECT, that.userConnect.bind(this));
				messenger.subscribe(USER_DISCONNECT, that.userDisconnect.bind(this));
				messenger.subscribe(USER_NAME_UPDATE, that.userNameUpdate.bind(this));
				messenger.subscribe(USER_MESSAGE_UPDATE, that.userMessageUpdate.bind(this));
				messenger.subscribe(USER_MESSAGE_DELETE, that.userMessageDelete.bind(this));

				this.messageWriteView = new MessageWriteView('.chatBox',chatData.type);
				this.targetSelect = new TargetSelect('.chatBox');
				this.messageWriteView.userEmojiConversion(chatData.type, chatDatIndex,that.userTalkMessage.bind(this));

				if(chatDatIndex === chatDataLen-1 ){
					clearInterval(messageStart);
				}
				chatDataModel.chatIndexSum();
				that.chatBoxView.scrollDown();
			}, CHAT_DATA[chatDatIndex].delta );
		}
	};
	chatDataModel.userNameData();
 	appController.init();
})();