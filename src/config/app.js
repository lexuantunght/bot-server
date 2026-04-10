const AppConfig = new (class AppConfig {
	get port() {
		return process.env.PORT || 8080;
	}

	get allowOrigins() {
		return process.env.CORS_ORIGIN?.split(',') || ['*'];
	}

	get zaloBotToken() {
		return process.env.ZALO_BOT_TOKEN || '';
	}

	get zaloBotApiKey() {
		return process.env.ZALO_BOT_API_KEY || '';
	}

	get zaloBotName() {
		return process.env.ZALO_BOT_NAME || '';
	}

	get aiApiKey() {
		return process.env.AI_API_KEY;
	}
})();

module.exports = AppConfig;
