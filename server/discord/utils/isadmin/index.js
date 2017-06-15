function isadmin(member) {
	return member.permission.has('kickMembers') || member.permission.has('banMembers') || member.permission.has('administrator');
}

module.exports = isadmin;
