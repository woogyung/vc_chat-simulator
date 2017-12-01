window.messenger = {};

(function (m) {
  var topics = {};

  function publish (topic, data) {
    if (!topics[topic]) {
      console.warn('Unregistered topic.');
      return;
    }
    var listeners = topics[topic];
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](data);
    }
  }

  function subscribe (topic, cb) {
    topics[topic] = topics[topic] || [];
    topics[topic].push(cb); 
  }
  m.publish = publish;
  m.subscribe = subscribe;
  
})(window.messenger);
