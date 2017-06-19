module.exports.alias = [
	'check',
	'ping'
];

module.exports.command = message =>
	message.channel.createMessage(`\`\`\`
PING discordapp.com (104.16.59.5) 56(84) bytes of data,

--- 104.16.59.5 ping statistics ---
4 packets transmitted, 0 recieved, 100% packet loss, time: 3001ms
\`\`\`
MSS has detected that Discord is offline.
While you wait for Discord, give the MSN (Microsoft Network) a try.
`);
