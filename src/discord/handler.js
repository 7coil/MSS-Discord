const config = require('config');
const { commands } = require('./cogs');
const client = require('./');
const r = require('./../db');
const i18n = require('i18n');

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

	return cleanContent;
	// .replace(/@everyone/g, '@\u200beveryone').replace(/@here/g, '@\u200bhere');
};

module.exports = message => new Promise(async (resolve, reject) => {
	const h = {};

	// Message shit
	h.input = null;
	h.prefix = null;
	h.command = null;
	h.cleanInput = null;
	h.cleanPrefix = null;
	h.cleanCommand = null;
	h.args = null;
	h.cleanArgs = null;

	let text = message.content.trim();
	h.prefix = [`<@${message._client.user.id}>`, ...prefixes].find(prefix => text.toLowerCase().startsWith(prefix)) || null;
	h.cleanPrefix = clean(message, h.prefix);
	if (h.prefix) {
		text = text.substr(h.prefix.length).trim();
		h.command = Object.keys(commands).find(command => text.toLowerCase().startsWith(command)) || null;
		h.cleanCommand = clean(message, h.command);
		if (h.command) {
			h.input = text.substr(h.command.length).trim();
			h.cleanInput = clean(message, h.input);
		}
	}

	// Higher is lower.
	h.permission = Number.MAX_SAFE_INTEGER;
	h.banned = null;
	h.ratelimit = null;
	h.locale = 'en-gb';

	if (h.command) {
		// Get permission level
		if (typeof config.get('discord.admins')[message.author.id] !== 'undefined') {
			h.permission = config.get('discord.admins')[message.author.id];
		} else if (message.member && message.channel.guild.ownerID === message.author.id) {
			h.permission = 5;
		} else if (message.member && message.member.permission.has('administrator')) {
			h.permission = 6;
		} else if (message.member && message.member.permission.has('kickMembers')) {
			h.permission = 7;
		} else if (message.member && message.member.permission.has('banMembers')) {
			h.permission = 8;
		}

		const userConfig = await r.table('config')
			.get(message.author.id);

		i18n.init(message);

		if (userConfig) {
			// Get ratelimits
			h.ratelimit = userConfig.ratelimit;
			h.locale = userConfig.locale;
			message.setLocale(userConfig.locale);
		} else {
			await r.table('config')
				.insert({
					id: message.author.id,
					locale: 'en-gb',
					ratelimit: new Date()
				});
		}
	}

	message.h = h;
	resolve(message);
});
