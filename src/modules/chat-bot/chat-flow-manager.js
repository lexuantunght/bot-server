const { createBot } = require('../../utils/bot');
const AppConfig = require('../../config/app');
const { GoogleGenAI } = require('@google/genai');

class ChatFlowManager {
	static get shared() {
		if (!this._instance) {
			this._instance = new ChatFlowManager();
		}
		return this._instance;
	}

	constructor() {
		this.bot = createBot(AppConfig.zaloBotToken);
		this.client = new GoogleGenAI({ apiKey: AppConfig.aiApiKey });
	}

	start() {
		this.bot.on('message', (msg) => {
			const chatId = msg.chat.id;
			const text = msg.text.split(`@${AppConfig.zaloBotName} `)[1];
			if (text && text.trim().length > 1) {
				this.client.models
					.generateContent({
						model: 'gemini-2.5-flash',
						contents: text,
					})
					.then((resp) => {
						this.bot.sendMessage(chatId, resp.text);
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
}

module.exports = { ChatFlowManager };
