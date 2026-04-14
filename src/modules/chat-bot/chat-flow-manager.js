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
		this.queue = [];
		this.isProcessing = false;
	}

	_processMessageIfNeeded() {
		if (this.isProcessing) {
			return;
		}
		const msg = this.queue.shift();
		if (msg) {
			this.isProcessing = true;
			const chatId = msg.chat.id;
			const text = msg.text.split(`@${AppConfig.zaloBotName} `)[1];
			if (text && text.trim().length > 1) {
				console.log('From bot', text);
				this.client.models
					.generateContent({
						model: 'gemini-2.5-flash-lite',
						contents: text,
						config: {
							httpOptions: {
								retryOptions: {
									attempts: 3,
								},
							},
						},
					})
					.then((resp) => this.sendMessage(chatId, resp.text))
					.catch((err) =>
						this.sendMessage(
							chatId,
							`Chào bạn ${msg.from.display_name}, đã có lỗi xảy ra với bot :((\n${JSON.stringify(err)}`
						)
					)
					.finally(() => {
						setTimeout(() => {
							this.isProcessing = false;
							this._processMessageIfNeeded();
						}, 3000);
					});
			} else {
				this.isProcessing = false;
				this._processMessageIfNeeded();
			}
		} else {
			this.isProcessing = false;
		}
	}

	start() {
		this.bot.on('message', (msg) => {
			this.queue.push(msg);
			this._processMessageIfNeeded();
		});
	}

	processAction(data) {
		this.bot.processUpdate(data);
	}

	sendMessage(chatId, message) {
		return new Promise((resolve) => {
			if (message.length <= 1500) {
				this.bot.sendMessage(chatId, message);
				resolve();
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
				setTimeout(() => {
					this.sendMessage(chatId, remain).then(resolve);
				}, 500);
			}
		});
	}
}

module.exports = { ChatFlowManager };
