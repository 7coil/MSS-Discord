const request = require('request');

module.exports = function manpages(message) {
	let input = message.content.replace("#", "-").replace(/\n/g, " ").split(" ");
	var owUrl = "http://127.0.0.1:3000/profile/" + input[1] + "/" + input[2] + "/" + input[3];
	request(owUrl, function (error, response, body) {
		if (response.statusCode === 404) {
			return sendMessage("No player tag was found.");
		} else if (response.statusCode === 200){
			var owData = JSON.parse(body);
			return sendMessage(owData["username"] + " Ranked #" + owData["competitive"]["rank"] + " W/L " + owData["games"]["competitive"]["wins"] + "/" + owData["games"]["competitive"]["lost"]);
		}
	});
}
