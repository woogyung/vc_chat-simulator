export default function emoji (value) {
	if (value.payload.message && value.payload.message.text) {
		var content = value.payload.message.text;

		if (content.includes('*')) {
			var arr = content.split(' ');

			for (var j = 0; j < arr.length; j ++) {
				if (arr[j].includes('*')) {
					var str = arr[j].replace('*', '<b>');
					arr[j] = str.replace('*', '</b>');
				}
			}

			value.payload.message.text = arr.join(' ');
		}
	}
}
