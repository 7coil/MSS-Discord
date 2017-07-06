const client = require('./../../');

module.exports.info = {
	name: 'Ping',
	category: 'info',
	aliases: [
		'ping',
		'pong'
	]
};

module.exports.command = message =>
	message.channel.createMessage(`\`\`\`\n${client.shards.map(shard => `Shard ${shard.id} | ${shard.latency}ms`).join('\n')}\n\`\`\``);
