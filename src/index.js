import CHAT_DATA from './lib/chatHistory.json';
import emoji from './emoji.js';

var el = document.querySelector('.console'); //var의 위치?

//Promise를 이용하여 다음 메세지 표시

for (var i = 0; i < CHAT_DATA.length; i++) {
	(function showMessage (j) {
		setTimeout(function () {
			var divEl = document.createElement('div');

			el.appendChild(divEl);

			var chatEl = document.querySelectorAll('.console div');
			var displayNameEl = document.createElement('strong');
			var messageEl = document.createElement('span');

			chatEl[j].appendChild(displayNameEl);
			chatEl[j].appendChild(messageEl);

			if (CHAT_DATA[j].payload.type === 'connect') {
				chatEl[j].classList.add('connection');
				messageEl.textContent =  CHAT_DATA[j].payload.user.display_name + "님이 입장하셨습니다.";
			}

			if (CHAT_DATA[j].payload.type === 'disconnect') {
				chatEl[j].classList.add('connection');
				messageEl.textContent =  CHAT_DATA[j].payload.user.display_name + "님이 퇴장하셨습니다.";
			}

			if (CHAT_DATA[j].payload.type === 'message') {
				emoji(CHAT_DATA[j]);

				displayNameEl.textContent = CHAT_DATA[j].payload.user.display_name + ':';

				messageEl.innerHTML = CHAT_DATA[j].payload.message.text;
				messageEl.dataset.id = CHAT_DATA[j].payload.message.id;
			}

			if (CHAT_DATA[j].payload.type === 'update' && CHAT_DATA[j].payload.user !== undefined) {

				var userId = CHAT_DATA[j].payload.user.id;

				for (var k = 1; k < j; k++) {
					if (CHAT_DATA[j - k].payload.user && CHAT_DATA[j - k].payload.user.id === userId) {
						var oldDisplyName = CHAT_DATA[j - k].payload.user.display_name;
						break;
					}
				}

				messageEl.textContent = oldDisplyName + '님이 ' + CHAT_DATA[j].payload.user.display_name + '로 ID를 변경하였습니다.';
				chatEl[j].classList.add('connection');
			} else if (CHAT_DATA[j].payload.type === 'update' && CHAT_DATA[j].payload.message !== undefined) {
				var updateMsg = CHAT_DATA[j].payload.message.id;
				var updateMsgEl = document.querySelector('[data-id="' + updateMsg + '"]');

				emoji(CHAT_DATA[j]);

				updateMsgEl.innerHTML = CHAT_DATA[j].payload.message.text + " (edited)";
			}

			if (CHAT_DATA[j].payload.type === 'delete') {
				var delMsg = CHAT_DATA[j].payload.message.id;
				var delEl = document.querySelector('[data-id="' + delMsg + '"]');

				delEl.textContent = "메세지가 삭제되었습니다.";
			}
		}, CHAT_DATA[j].delta);
	})(i);
}
