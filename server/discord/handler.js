const config = require('config');
const commands = require('./cogs');
const client = require('./');

const prefixes = config.get('discord').prefix;

/*
 * Modified Eris Code - https://github.com/abalabahaha/eris
 * Allows me to clean any message content
 */
const clean = (message, content) => {
	let cleanContent = content;

	if (message.mentions) {
		message.mentions.forEach((mention) => {
			if (message.channel.guild) {
				const member = message.channel.guild.members.get(mention.id);
				if (member) {
					cleanContent = cleanContent.replace(new RegExp(`<@!${mention.id}>`, 'g'), `@${member.nick}` || mention.username);
				}
			}
			cleanContent = cleanContent.replace(new RegExp(`<@!?${mention.id}>`, 'g'), `@${mention.username}`);
		});
	}

	if (message.channel.guild && message.roleMentions) {
		message.roleMentions.forEach((roleID) => {
			const role = message.channel.guild.roles.get(roleID);
			const roleName = role ? role.name : 'deleted-role';
			cleanContent = cleanContent.replace(new RegExp(`<@&${roleID}>`, 'g'), `@${roleName}`);
		});
	}

	message.channelMentions.forEach((id) => {
		const channel = client.getChannel(id);
		if (channel && channel.name && channel.mention) {
			cleanContent = cleanContent.replace(channel.mention, `#${channel.name}`);
		}
	});

	return cleanContent.replace(/@everyone/g, '@\u200beveryone').replace(/@here/g, '@\u200bhere');
};

module.exports = (message) => {
	const mss = {};

	mss.content = message.content.trim();

	// Check for any prefixes
	mss.prefix = prefixes.find(prefix => mss.content.toLowerCase().startsWith(prefix));

	// If there's a prefix, get rid of the prefix and check for any command
	if (mss.prefix && !message.author.bot) {
		const noprefix = mss.content.replace(mss.prefix, '').trim();
		mss.command = Object.keys(commands).find(command => noprefix.toLowerCase().startsWith(command));
		if (mss.command) {
			mss.input = noprefix.replace(mss.command, '').trim();
			mss.cleanInput = clean(message, mss.input);
		}
	}

	// Set default values of empty string
	mss.content = mss.content || '';
	mss.prefix = mss.prefix || '';
	mss.command = mss.command || '';
	mss.content = mss.content || '';
	mss.input = mss.input || '';

	message.mss = mss;
};
