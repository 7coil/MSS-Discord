/* eslint-env browser */
/* globals io SmoothieChart TimeSeries timestamp */

const id = [
	'users',
	'guilds',
	'uptime'
];

const graphs = [
	'user',
	'guild',
	'voice',
	'ram'
];

const canvas = {};
const html = {};

const chartconfig = {
	responsive: true,
	grid: {
		fillStyle: '#ffffff',
		strokeStyle: '#aaaaaa',
		millisPerLine: 6000,
	},
	labels: {
		fillStyle: '#000000'
	},
	millisPerPixel: 100,
	verticalSections: 0,
	timestampFormatter: SmoothieChart.timeFormatter
};

const lineconfig = {
	lineWidth: 2,
	strokeStyle: '#0000ff',
	fillStyle: 'rgba(0,0,255,0.28)'
};

id.forEach((element) => {
	html[element] = document.getElementById(element);
});

graphs.forEach((graph) => {
	console.log(graph);
	const chart = new SmoothieChart(chartconfig);
	canvas[graph] = new TimeSeries();
	chart.addTimeSeries(canvas[graph], lineconfig);
	chart.streamTo(document.getElementById(`${graph}chart`), 500);
});

const socket = io('http://127.0.0.1:8080/');

socket.on('connect', () => {
	socket.on('info', (msg) => {
		console.log(msg);
		canvas.user.append(msg.time, msg.user);
		canvas.guild.append(msg.time, msg.guild);
		canvas.voice.append(msg.time, msg.voice);
		// canvas.ram.append(msg.time, msg.ram.external);
		html.uptime.innerHTML = timestamp(msg.uptime);
	});
});
