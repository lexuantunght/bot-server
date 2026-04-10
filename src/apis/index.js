const { registerChatAPIs } = require('./chat.api');

function registerAPIs(app) {
	registerChatAPIs(app);
}

module.exports = { registerAPIs };
