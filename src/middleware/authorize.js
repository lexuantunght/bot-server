const AppConfig = require('../config/app');

const verifyToken = async (req, res, next) => {
	const authHeader =
		req.headers['Authorization'] || req.headers['X-Bot-Api-Secret-Token'] || req.headers['x-bot-api-secret-token'];

	if (!authHeader || !authHeader.startsWith('bot_')) {
		return res.status(401).json({ error_code: 401, error_message: 'Unauthorized - No token provided' });
	}

	const idToken = authHeader.split('bot_')[1];

	try {
		switch (idToken) {
			case AppConfig.zaloBotApiKey:
				req.user = { uid: 'zalobot', displayName: 'Zalo Bot' };
				break;
			default:
				throw Error('Unauthorized - Invalid token');
		}
		next();
	} catch (error) {
		return res.status(401).json({ error_code: 401, error_message: 'Unauthorized - Invalid token' });
	}
};

module.exports = {
	verifyToken,
};
