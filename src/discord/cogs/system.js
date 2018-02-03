module.exports = [{
	aliases: [
		'ping'
	],
	name: 'ping',
	permission: Number.MAX_SAFE_INTEGER,
	command: (m) => {
		let s = 0;

		if (m.channel.guild) {
			s = m._client.guildShardMap[m.channel.guild.id];
		}

		m.channel.createMessage(`\`\`\`\n${m._client.shards.map(shard => `${s === shard.id ? '>' : ' '} ${m.__('system.ping.shard')} ${shard.id} | ${shard.latency}ms`).join('\n')}\n\`\`\``);
	}
}, {
	aliases: [
		'ping'
	],
	name: 'ping',
	permission: Number.MAX_SAFE_INTEGER,
	command: (m) => {
		let s = 0;

		if (m.channel.guild) {
			s = m._client.guildShardMap[m.channel.guild.id];
		}

		m.channel.createMessage(`\`\`\`\n${m._client.shards.map(shard => `${s === shard.id ? '>' : ' '} ${m.__('system.ping.shard')} ${shard.id} | ${shard.latency}ms`).join('\n')}\n\`\`\``);
	}
}];
