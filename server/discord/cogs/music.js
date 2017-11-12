const config = require('config');
const request = require('request');
const music = require('./../music');
const YT = require('youtube-node');

const searchYTClient = new YT();
searchYTClient.setKey(config.get('api').youtube);

const resolve = (search, callback) => {
	const query = encodeURIComponent(search);
	request({
		uri: `http://${config.get('resolver').host}:${config.get('resolver').port}/loadtracks?identifier=${query}`,
		headers: {
			'User-Agent': config.get('useragent'),
			Authorization: config.get('resolver').password
		},
		json: true
	}, (err, res, body) => callback(body));
};

const radio = {
	1: { name: 'BBC Radio 1', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p' },
	'6 music': { name: 'BBC Radio 6 Music', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_6music_mf_p' },
	'asian network': { name: 'BBC Asian Network', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_asianet_mf_p' },
	cymru: { name: 'Radio Cymru', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_cymru_mf_p' },
	foyle: { name: 'BBC Radio Foyle', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_foyle_mf_p' },
	'three counties': { name: 'BBC Three Counties Radio', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lr3cr_mf_p' },
	berkshire: { name: 'BBC Radio Berkshire', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrberk_mf_p' },
	bristol: { name: 'BBC Radio Bristol', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrbris_mf_p' },
	cambridgeshire: { name: 'BBC Radio Cambridgeshire', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrcambs_mf_p' },
	cornwall: { name: 'BBC Radio Cornwall', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrcorn_mf_p' },
	cumbria: { name: 'BBC Radio Cumbria', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrcumbria_mf_p' },
	derby: { name: 'BBC Radio Derby', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrderby_mf_p' },
	devon: { name: 'BBC Radio Devon', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrdevon_mf_p' },
	essex: { name: 'BBC Essex', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lressex_mf_p' },
	gloucestershire: { name: 'BBC Radio Gloucestershire', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrgloucs_mf_p' },
	guernsey: { name: 'BBC Radio Guernsey', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrguern_mf_p' },
	'hereford and worcester': { name: 'BBC Hereford & Worcester', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrhandw_mf_p' },
	humberside: { name: 'BBC Radio Humberside', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrhumber_mf_p' },
	jersey: { name: 'BBC Radio Jersey', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrjersey_mf_p' },
	kent: { name: 'BBC Radio Kent', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrkent_mf_p' },
	lancashire: { name: 'BBC Radio Lancashire', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrlancs_mf_p' },
	london: { name: 'BBC Radio London', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrldn_mf_p' },
	leeds: { name: 'BBC Radio Leeds', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrleeds_mf_p' },
	leicester: { name: 'BBC Radio Leicester', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrleics_mf_p' },
	lincolnshire: { name: 'BBC Radio Lincolnshire', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrlincs_mf_p' },
	manchester: { name: 'BBC Radio Manchester', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrmanc_mf_p' },
	merseyside: { name: 'BBC Radio Merseyside', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrmersey_mf_p' },
	newcastle: { name: 'BBC Newcastle', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrnewc_mf_p' },
	norfolk: { name: 'BBC Radio Norfolk', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrnorfolk_mf_p' },
	nottingham: { name: 'BBC Radio Nottingham', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrnotts_mf_p' },
	northampton: { name: 'BBC Radio Northampton', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrnthhnts_mf_p' },
	oxford: { name: 'BBC Radio Oxford', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lroxford_mf_p' },
	sheffield: { name: 'BBC Radio Sheffield', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrsheff_mf_p' },
	shropshire: { name: 'BBC Radio Shropshire', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrshrops_mf_p' },
	solent: { name: 'BBC Radio Solent', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrsolent_mf_p' },
	somerset: { name: 'BBC Somerset', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrsomer_mf_p' },
	stoke: { name: 'BBC Radio Stoke', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrsomer_mf_p' },
	suffolk: { name: 'BBC Radio Suffolk', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrsuffolk_mf_p' },
	surrey: { name: 'BBC Surrey', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrsurrey_mf_p' },
	sussex: { name: 'BBC Sussex', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrsussex_mf_p' },
	tees: { name: 'BBC Tees', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrtees_mf_p' },
	wiltshire: { name: 'BBC Wiltshire', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrwilts_mf_p' },
	'wm 95.6': { name: 'BBC WM 95.6', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrwm_mf_p' },
	'coventry & warwickshire': { name: 'BBC Coventry & Warwickshire', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrwmcandw_mf_p' },
	york: { name: 'BBC Radio York', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lryork_mf_p' },
	'nan gàidheal': { name: 'BBC Radio nan Gàidheal', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_nangaidheal_mf_p' },
	'1xtra': { name: 'BBC Radio 1xtra', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1xtra_mf_p' },
	2: { name: 'BBC Radio 2', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio2_mf_p' },
	3: { name: 'BBC Radio 3', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio3_mf_p' },
	'4 extra': { name: 'BBC Radio 4 Extra', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio4extra_mf_p' },
	'4fm': { name: 'BBC Radio 4FM', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio4fm_mf_p' },
	'4lw': { name: 'BBC Radio 4LW', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio4lw_mf_p' },
	'5 live sportsball extra': { name: 'BBC Radio 5 Live Sportsball Extra', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio5extra_mf_p' },
	'5 live': { name: 'BBC Radio 5 Live', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio5live_mf_p' },
	scotland: { name: 'BBC Radio Scotland', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_scotlandfm_mf_p' },
	ulster: { name: 'BBC Radio Ulster', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_ulster_mf_p' },
	wales: { name: 'BBC Radio Wales', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_walesmw_mf_p' },
	'world service uk': { name: 'BBC World Service UK stream', url: 'http://bbcwssc.ic.llnwd.net/stream/bbcwssc_mp1_ws-eieuk' },
	'world service news': { name: 'BBC World Service News stream', url: 'http://bbcwssc.ic.llnwd.net/stream/bbcwssc_mp1_ws-einws' },
	'rthk 1': { name: 'RTHK Radio 1 / 香港電台網站: 第一台', url: 'http://rthk.hk/live1.m3u' },
	'rthk 2': { name: 'RTHK Radio 2 / 香港電台網站: 第二台', url: 'http://rthk.hk/live2.m3u' },
	'rthk 3': { name: 'RTHK Radio 3 / 香港電台網站: 第三台', url: 'http://rthk.hk/live3.m3u' },
	'rthk 4': { name: 'RTHK Radio 4 / 香港電台網站: 第四台', url: 'http://rthk.hk/live4.m3u' },
	'rthk 5': { name: 'RTHK Radio 5 / 香港電台網站: 第五台', url: 'http://rthk.hk/live5.m3u' },
	'rthk p': { name: 'RTHK Putonghua / 香港電台網站: 普通話台', url: 'http://rthk.hk/livepth.m3u' },
	'rthk dab 31': { name: 'RTHK DAB 31', url: 'http://rthk.hk/live31.m3u' },
	'rthk dab 32': { name: 'RTHK DAB 32', url: 'http://rthk.hk/live32.m3u' },
	'rthk dab 33': { name: 'RTHK DAB 33', url: 'http://rthk.hk/live33.m3u' },
	kiss: { name: 'Kiss', url: 'http://live-kiss.sharp-stream.com/kissnational.mp3' },
	tdm: { name: 'Teledifusão de Macau / 澳門電台', url: 'http://127.0.0.1:4000' },
	moe: { name: 'listen.moe', url: 'https://listen.moe/stream' }
};

module.exports = [
	{
		aliases: [
			'twitch',
			'ttv'
		],
		name: 'twitch',
		uses: 1,
		admin: 0,
		command: (message) => {
			if (!message.mss.input) {
				message.channel.createMessage(message.__('twitch_none'));
			} else {
				const username = encodeURI(message.mss.input.substring(message.mss.input.lastIndexOf('/') + 1));

				if (!username) {
					message.channel.createMessage(message.__('twitch_invalid'));
				} else {
					const query = {
						method: 'GET',
						json: true,
						uri: `https://api.twitch.tv/kraken/streams/${username}`,
						headers: {
							'User-Agent': config.get('useragent'),
							'Client-ID': config.get('api').twitch
						}
					};

					request(query, (err, res, body1) => {
						if (body1.error) {
							message.channel.createMessage(message.__('err_generic'));
						} else if (!body1.stream) {
							message.channel.createMessage(message.__('twitch_notlive'));
						} else {
							resolve(`https://twitch.tv/${username}`, (body2) => {
								if (body2.length === 0) {
									message.channel.createMessage('No results');
								} else {
									music.add(message, body2[0]);
								}
							});
						}
					});
				}
			}
		}
	},
	{
		aliases: [
			'youtube',
			'yt'
		],
		name: 'youtube',
		uses: 1,
		admin: 0,
		command: (message) => {
			resolve(`ytsearch:${message.mss.input}`, (body) => {
				if (body.length === 0) {
					message.channel.createMessage('No results');
				} else {
					music.add(message, body[0]);
				}
			});
		}
	},
	{
		aliases: [
			'tts',
			'dictate',
			'dectalk'
		],
		name: 'tts',
		uses: 1,
		admin: 0,
		command: (message) => {
			resolve(`https://talk.moustacheminer.com/api/gen?dectalk=${encodeURIComponent(message.mss.input)}`, (body) => {
				if (body.length === 0) {
					message.channel.createMessage('Could not resolve media');
				} else {
					music.add(message, body[0]);
				}
			});
		}
	},
	{
		aliases: [
			'skip'
		],
		name: 'skip',
		uses: 1,
		admin: 1,
		command: (message) => {
			music.skip(message);
		}
	},
	{
		aliases: [
			'stop'
		],
		name: 'stop',
		uses: 1,
		admin: 1,
		command: (message) => {
			music.stop(message);
		}
	},
	{
		aliases: [
			'list'
		],
		name: 'list',
		uses: 1,
		admin: 0,
		command: (message) => {
			music.list(message, (info) => {
				if (info.playlist.length === 0) {
					message.channel.createMessage(message.__('list_empty'));
				} else {
					let reply = '```\n';
					info.playlist.forEach((element, index) => {
						reply += `[${index || message.__('list_current')}] ${element.info.title}\n`;
					});
					reply += '```';

					if (reply && reply.length > 1900) {
						message.channel.createMessage(message.__('list_length'));
					} else {
						message.channel.createMessage(reply);
					}
				}
			});
		}
	},
	{
		aliases: [
			'radio',
		],
		name: 'radio',
		uses: 2,
		admin: 0,
		command: (message) => {
			if (!message.mss.input) {
				message.channel.createMessage(Object.keys(radio).map(station => `\`${station}\``).join(', '));
			} else if (radio[message.mss.input]) {
				resolve(radio[message.mss.input].url, (body) => {
					if (body.length === 0) {
						message.channel.createMessage('No results');
					} else {
						const station = body[0];
						station.info.title = radio[message.mss.input].name;
						music.add(message, station);
					}
				});
			} else {
				message.channel.createMessage(message.__('radio_incorrect', { prefix: message.mss.prefix, command: message.mss.command }));
			}
		}
	},
	{
		aliases: [
			'play'
		],
		name: 'play',
		uses: 0,
		admin: 3,
		command: (message) => {
			resolve(message.mss.input, (body) => {
				if (body.length === 0) {
					message.channel.createMessage('No results');
				} else {
					music.add(message, body[0]);
				}
			});
		}
	}
];
