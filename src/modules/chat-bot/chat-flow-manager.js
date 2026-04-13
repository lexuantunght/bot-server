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
				console.log('From bot', text);
				this.client.models
					.generateContent({
						model: 'gemini-2.5-flash',
						contents: text,
						config: {
							httpOptions: {
								retryOptions: {
									attempts: 3,
								},
							},
						},
					})
					.then((resp) => {
						this.sendMessage(chatId, resp.text);
					})
					.catch((err) => {
						this.sendMessage(
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
		if (message.length <= 1500) {
			this.bot.sendMessage(chatId, message);
		} else {
			let end = 1500;
			for (let i = 1499; i >= 0; i--) {
				if (message[i] === '.') {
					end = i + 1;
					break;
				}
			}
			const text = message.substring(0, end);
			const remain = message.substring(end);
			this.bot.sendMessage(chatId, text);
			this.sendMessage(chatId, remain);
		}
	}
}

module.exports = { ChatFlowManager };
