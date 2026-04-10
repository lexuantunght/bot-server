const { verifyToken } = require('../middleware/authorize');
const { ChatFlowManager } = require('../modules/chat-bot/chat-flow-manager');

function registerChatAPIs(app) {
	app.post('/chat/message', verifyToken, (req, res) => {
		ChatFlowManager.processAction(req.body);
		res.status(200).send({ error_code: 0, data: null, error_message: null });
	});
}

module.exports = { registerChatAPIs };
