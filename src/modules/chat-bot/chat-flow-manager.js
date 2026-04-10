const { createBot } = require('../../utils/bot');
const AppConfig = require('../../config/app');

const ChatFlowManager = new (class ChatFlowManager {
	constructor() {
		this.bot = createBot(AppConfig.zaloBotToken);
	}

	start() {
		this.bot.on('message', (msg) => {
			const chatId = msg.chat.id;
			this.bot.sendMessage(chatId, `Chào bạn ${msg.from.display_name}, bạn vừa gửi: ${msg.text}`);
		});
	}

	processAction(data) {
		this.bot.processUpdate(data);
	}

	sendMessage(chatId, message) {
		this.bot.sendMessage(chatId, message);
	}
})();

module.exports = { ChatFlowManager };
