	function View (selector) {
		this.element = document.querySelector(selector);
	}

	function ViewAllSelector (selector) {
		this.element = document.querySelectorAll(selector);
	}

	View.prototype.messageWrite = function (msgType) {
		var msgBox = document.createElement('div');
		var UserMessage = document.createElement('p');
		if( msgType === "message" ){
			var userName = document.createElement('span');
			userName.classList.add('userName');
			msgBox.appendChild(userName);
			UserMessage.classList.add('message');
		}
        msgBox.appendChild(UserMessage);
        this.element.appendChild(msgBox);
	};
	//this.element.appendChild(msgBox).innerHTML= "<p class='name' userId='" + userIndex_id + "'>" + userIndex_dpName + "</p> <p class='message' messageId='"+ userIndex_messageId +"'>" + userIndex_messageText + "</p>";
	
	View.prototype.selectMsgType = function (selector) {
		this.element = document.querySelectorAll(selector);
	};


	View.prototype.userConnetMsg = function (elements) {
		userIndex_dpName = CHAT_DATA[chatDatIndex].payload.user.display_name;
		this.element.appendChild(elements).innerHTML = "<p>" + userIndex_dpName + "님이 접속 하셨습니다. </p>";
	};

	View.prototype.userDisConnetMsg = function (elements) {
		userIndex_dpName = CHAT_DATA[chatDatIndex].payload.user.display_name;
		this.element.appendChild(elements).innerHTML = userIndex_dpName + "님이 나가셨습니다.";
	};

	View.prototype.dpNameUpdate = function (elements) {
		var nameUpdate = document.querySelectorAll('[userId="' + userIndex_id + '"]');
		var prevUserName = nameUpdate[0].textContent;
		userIndex_dpName = CHAT_DATA[chatDatIndex].payload.user.display_name;
		this.element.appendChild(elements).innerHTML = "<p>" + prevUserName + " 님이 대화명을" + userIndex_dpName + " 로 변경 하였습니다.</p>";
		for( var i = 0 ; i < nameUpdate.length ; i++ ){
			nameUpdate[i].textContent = CHAT_DATA[chatDatIndex].payload.user.user_name;
		}
	};

	View.prototype.scrollDown = function () {
		this.element.scrollTop = this.element.scrollHeight;
	};

	window.View = View;