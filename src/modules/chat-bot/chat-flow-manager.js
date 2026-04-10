const { createBot } = require('../../utils/bot');
const AppConfig = require('../../config/app');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const ChatFlowManager = new (class ChatFlowManager {
	constructor() {
		this.bot = createBot(AppConfig.zaloBotToken);
		this.client = new GoogleGenerativeAI(AppConfig.aiApiKey);
		this.model = this.client.getGenerativeModel({
			model: 'gemini-pro',
			geminiConfig: {
				temperature: 0.9,
				topP: 1,
				topK: 1,
				maxOutputTokens: 4096,
			},
		});
	}

	start() {
		this.bot.on('message', (msg) => {
			const chatId = msg.chat.id;
			const text = msg.text.split(`@${AppConfig.zaloBotName} `)[1];
			if (text && text.trim().length > 1) {
				this.model
					.generateContent(text)
					.then((resp) => {
						this.bot.sendMessage(chatId, resp.response.text());
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
