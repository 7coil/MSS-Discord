const config = require('config');
const request = require('request');
const validator = require('validator');

const link = 'http://www.think-maths.co.uk/spreadsheet';

module.exports = [{
	aliases: [
		'spreadsheets'
	],
	name: 'spreadsheets',
	uses: 3,
	admin: 0,
	command: (message) => {
		// Query for obtaining a form_build_id
		const query1 = {
			method: 'GET',
			url: link,
			headers: {
				'User-Agent': config.get('useragent')
			}
		};

		// Get URL of an image
		const image = (message.mentions[0] && message.mentions[0].staticAvatarURL) || message.mss.input || message.author.staticAvatarURL;

		if (image && validator.isURL(image)) {
			request(query1, (err1, res1, body1) => {
				if (err1 || res1.statusCode !== 200) {
					message.channel.createMessage(message.h('err_generic'));
				} else {
					const regex = /name="form_build_id" value="(.+)"/g;
					const form = regex.exec(body1);

					// Query for uploading the Discord Avatar
					const query2 = {
						method: 'POST',
						url: link,
						encoding: null,
						headers: {
							'User-Agent': config.get('useragent'),
							Referer: link,
							'Content-Type': 'multipart/form-data'
						},
						formData: {
							'files[file]': {
								value: request(image),
								options: {
									filename: 'image.jpg',
									contentType: 'image/jpeg'
								}
							},
							op: 'Download Excel',
							form_build_id: form[1],
							form_id: 'tm_mosaic_form'
						}
					};

					request(query2, (err2, res2, body2) => {
						if (err2 || res2.statusCode !== 200 || res2.headers['content-type'] !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
							message.channel.createMessage(message.h('err_generic'));
						} else {
							message.channel.createMessage('', {
								file: body2,
								name: message.h('spreadsheets_filename')
							});
						}
					});
				}
			});
		} else {
			message.channel.createMessage(message.h('spreadsheets_url'));
		}
	}
}];
