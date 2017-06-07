module.exports = function(message) {
	let n = message.content.lastIndexOf('/');
	let id = message.content.substring(n+1);
	return message.client.mss.functions.kahoot.add(message, id);
}
