/* JS는 이 파일내에서만 작업해주세요. */

// 수정하지 마세요.
import CHAT_DATA from './lib/chatHistory.json';
var emojis = require('emojis-list');
var emojisKeyword = require('emojis-keywords');

// `CHAT_DATA`라는 변수에 채팅 히스토리가 담겨있습니다. 이 데이터를 이용하시면 됩니다.
// console.log(CHAT_DATA);

var chat_box = document.querySelector('.chat-box');

for(var i = 0; i < CHAT_DATA.length; i++) {
  var data = CHAT_DATA[i];
  (function(data) {
    var dataType = data.payload.type;

    if (dataType === 'message') {   
      delay(data.delta).then(function(){
        showMessage(data);
      });
    } else if (dataType === 'connect' || dataType === 'disconnect') {
      delay(data.delta).then(function(){
        showConnect(data);
      });
    } else if (dataType === 'delete') {
      delay(data.delta).then(function(){
        deleteMessage(data);
      });
    } else if (dataType === 'update') {
      delay(data.delta).then(function(){
        updateMessage(data);
      });
    }
  })(data); 
}

function delay (t) {
  return new Promise(function(resolve) {
    setTimeout(resolve, t)
  });
}

function showConnect (data) {
  var divEl = document.createElement('div');
  var connectUserEl = document.createElement('p');
  connectUserEl.classList.add('user-connect');

  if (data.payload.type === 'connect') {
    connectUserEl.textContent = `${data.payload.user.display_name}님이 접속하셨습니다.`;  
  } else if (data.payload.type === 'disconnect') {
    connectUserEl.textContent = `${data.payload.user.display_name}님이 퇴장하셨습니다.`;
  }

  divEl.appendChild(connectUserEl);

  chat_box.appendChild(divEl);
}

function showMessage (data) {
  var divEl = document.createElement('div');
  divEl.dataset.messageId = data.payload.message.id;

  var userNameEl = document.createElement('p');
  userNameEl.classList.add("user-name");
  divEl.dataset.userId = data.payload.user.id;

  var messageEl = document.createElement('p');
  messageEl.classList.add('message');

  userNameEl.textContent = data.payload.user.display_name;
  var text = emojiChanger(data.payload.message.text)
  messageEl.innerHTML = atIdentifier(text);

  divEl.appendChild(userNameEl);
  divEl.appendChild(messageEl);

  chat_box.appendChild(divEl);
}

function deleteMessage (data) {
  var deleteId = '[data-message-id=' + '"' + data.payload.message.id + '"' + ']';
  var deleteTarget = document.querySelector(deleteId);

  deleteTarget.parentNode.removeChild(deleteTarget);
} 


function updateMessage (data) {
  if (data.payload.message) {
    var updateMessageId = '[data-message-id=' + '"' + data.payload.message.id + '"' + ']';
    var updateMessageTarget = document.querySelector(updateMessageId).childNodes[1];

    updateMessageTarget.textContent = data.payload.message.text;
  } else if (data.payload.user) {
    var updateUserNameId = '[data-user-id=' + '"' + data.payload.user.id + '"' + ']';
    var updateUserNameTarget = document.querySelectorAll(updateUserNameId);

    var prevName = updateUserNameTarget[0].querySelector('.user-name').textContent;

    var divEl = document.createElement('div');
    var changeUserNameEl = document.createElement('p');
    changeUserNameEl.classList.add('user-connect');

    changeUserNameEl.textContent = `${prevName}님이 ${data.payload.user.display_name}으로 바꾸었습니다.`; 

    chat_box.appendChild(changeUserNameEl);

    updateUserNameTarget.forEach(function (element, index, array) {
      var targetEl = element.querySelector('.user-name');
      targetEl.textContent = data.payload.user.display_name; 
    });
  }
}

function atIdentifier (text) {

  var result;
  var checkWord = false;

  if(text.indexOf('@') === -1) {
    return text;
  } 

  for(var i = 0; i < text.length; i++) {
    var letterRegex = /[a-zA-Z]/;

    if (text[i] === '@') {
      result += '<span class="atName">' + text[i];
      checkWord = true;
    } else if (checkWord && !text[i].match(letterRegex)) {
      result += '</span>' + text[i];
      checkWord = false;
    } else {
      result += text[i];
    }
  }

  return result;
}

function emojiChanger (text) {

  var result;
  var checkWord = false;
  var emojiIndex = [];
  var emojiText = '';
  var emojiNum;

  if(text.indexOf(':') === -1) {
    return text;
  }

  for(var i = 0; i < text.length; i++) {
    if(!checkWord && text[i] === ':') {
      emojiIndex.push(i);
      checkWord = true;
    } else if (checkWord && text[i] === ':') {
      emojiIndex.push(i);
      checkWord = false;
    }
  }

  if(emojiIndex.length === 2) {
    emojiText = text.slice(emojiIndex[0], emojiIndex[1] + 1);
    console.log(emojiText)

    for(var k = 0; k < emojisKeyword.length; k++) {
      if(emojisKeyword[k] === emojiText) {
        emojiNum = (k);
        break;
      } 
    }

    if(emojiNum !== undefined) {
      text = text.slice(0, emojiIndex[0] - 1) + `${emojis[emojiNum]}` + text.slice(emojiIndex[1] + 1);
      emojiNum = undefined;
    }
      
  } 

  return text;
}


// data-type
// 1. connect : completed
// 2. message : completed
// 3. update 
//    - display-name: completed
//    - message : completed
// 4. delete  : completed
// 5. disconnect : completed

