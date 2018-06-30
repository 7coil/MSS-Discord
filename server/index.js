console.log('Welcome to Moustacheminer Server Services');

require('./discord');

process.on('unhandledRejection', (reason) => {
	console.dir(reason);
});
