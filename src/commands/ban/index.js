const fs = require('fs');
const API = require('./../../api.json');
const command = [];
const mysql = require('mysql');
const connection = mysql.createConnection(API.mysql);
const MSS = require("./../../functions/");

fs.readdir('./commands/ban/types/', (err, items) => {
	console.log("Ban Commands >>>");
	items.forEach((item) => {
		const file = item.replace(/['"]+/g, '');
		console.log(file);
		command[file] = require(`./types/${file}/`);
	});
	console.log("<<< Ban Commands")
});

module.exports = function(message) {
	/*
     * An anatomy of a valid input, by 7coil:
     *
     *    0       1      2         3
     * @mention  ban  command  extra crap
     *
     */
	const input = message.content.replace(/\n/g, '').split(' ');

	connection.query(`SELECT * FROM administrators WHERE administrator_ID=${message.author.id}`, (error, results, fields) => {
		if(error) return false;
		if(results.length < 1) {
			MSS.msg.react(message, false, "X");
		} else {
			// If the command exists, run the command
			if (command[input[2]]) {
				command[input[2]](message, connection);
			}
		}
	});
}
