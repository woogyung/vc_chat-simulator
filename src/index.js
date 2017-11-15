/* JS는 이 파일내에서만 작업해주세요. */

// 수정하지 마세요.
import CHAT_DATA from './lib/chatHistory.json';

// `CHAT_DATA`라는 변수에 채팅 히스토리가 담겨있습니다. 이 데이터를 이용하시면 됩니다.

(function(){
	var chatDataLen = CHAT_DATA.length ;
	var chatDatIndex = 0;
	var chatBox = document.querySelector(".chatBox");
	var userIndex_id;
	var userIndex_dpName;
	var userIndex_messageId;
	var userIndex_messageText;
	var userIndex_messageId;
	var messageStart = setInterval(function(){
		
		var msgBox = document.createElement("div");

		if(CHAT_DATA[chatDatIndex].payload.type === "message"){
			userIndex_id = CHAT_DATA[chatDatIndex].payload.user.id;
			userIndex_dpName = CHAT_DATA[chatDatIndex].payload.user.display_name;
			userIndex_messageId = CHAT_DATA[chatDatIndex].payload.message.id;
			userIndex_messageText = CHAT_DATA[chatDatIndex].payload.message.text;
			chatBox.appendChild(msgBox).innerHTML = "<p class='name' userId='" + userIndex_id + "'>" + userIndex_dpName + "</p> <p class='message' messageId='"+ userIndex_messageId +"'>" + userIndex_messageText + "</p>"
		}

		if(CHAT_DATA[chatDatIndex].payload.type === "connect"){
			userIndex_dpName = CHAT_DATA[chatDatIndex].payload.user.display_name;
			chatBox.appendChild(msgBox).innerHTML = "<p>" + userIndex_dpName + "님이 접속 하셨습니다. </p>";
		}

		if(CHAT_DATA[chatDatIndex].payload.type === "update"){

			if( CHAT_DATA[chatDatIndex].payload.user ){
				var nameUpdate = document.querySelectorAll('[userId="' + userIndex_id + '"]');
				var prevUserName = nameUpdate[0].textContent;
				userIndex_dpName = CHAT_DATA[chatDatIndex].payload.user.display_name;
				chatBox.appendChild(msgBox).innerHTML = "<p>" + prevUserName + " 님이 대화명을" + userIndex_dpName + " 로 변경 하였습니다.</p>";
				for( var i = 0 ; i < nameUpdate.length ; i++ ){
					nameUpdate[i].textContent = CHAT_DATA[chatDatIndex].payload.user.user_name;
				}
			}

			if( CHAT_DATA[chatDatIndex].payload.message ){
				userIndex_messageId = CHAT_DATA[chatDatIndex].payload.message.id;
				var messageUpdate = document.querySelector('[messageId="' + userIndex_messageId + '"]');				
				messageUpdate.textContent = CHAT_DATA[chatDatIndex].payload.message.text + "(메시지 수정)";
			}
		}

		if(CHAT_DATA[chatDatIndex].payload.type === "delete"){
			userIndex_messageId = CHAT_DATA[chatDatIndex].payload.message.id;
			var messageDelete = document.querySelector('[messageId="' + userIndex_messageId + '"]');
			messageDelete.textContent = "(메시지를 삭제 하였습니다.)";
		}

		if(CHAT_DATA[chatDatIndex].payload.type === "disconnect"){
			userIndex_dpName = CHAT_DATA[chatDatIndex].payload.user.display_name;
			chatBox.appendChild(msgBox).innerHTML = userIndex_dpName + "님이 나가셨습니다.";
		}

		chatBox.scrollTop = chatBox.scrollHeight;
		chatDatIndex++

		if(chatDatIndex === chatDataLen ){
			clearInterval(messageStart);
		}

	}, CHAT_DATA[chatDatIndex].delta );


})();