const { createBot } = require('../../utils/bot');
const AppConfig = require('../../config/app');
const { OpenAI } = require('openai');

const ChatFlowManager = new (class ChatFlowManager {
	constructor() {
		this.bot = createBot(AppConfig.zaloBotToken);
		this.client = new OpenAI({
			apiKey: AppConfig.openAIApiKey,
		});
	}

	start() {
		this.bot.on('message', (msg) => {
			const chatId = msg.chat.id;
			const text = msg.text.split(`@${AppConfig.zaloBotName} `)[1];
			if (text && text.trim().length > 1) {
				this.client.responses
					.create({
						model: 'gpt-5.4',
						input: text,
					})
					.then((resp) => {
						this.bot.sendMessage(chatId, resp.output_text);
					})
					.catch((err) => {
						this.bot.sendMessage(
							chatId,
							`Chào bạn ${msg.from.display_name}, đã có lỗi xảy ra với bot :((\n${JSON.stringify(err)}`
						);
					});
			}
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
