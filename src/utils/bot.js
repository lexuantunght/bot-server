const ZaloBot = require('node-zalo-bot');

function createBot(token) {
	const bot = new ZaloBot(token, { polling: false });
	return bot;
}

module.exports = { createBot };
