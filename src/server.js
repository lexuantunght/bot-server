const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const path = require('path');
require('express-async-errors');
const { requestHandler } = require('./utils/request-handler');
const { registerAPIs } = require('./apis');
const AppConfig = require('./config/app');

const { ChatFlowManager } = require('./modules/chat-bot/chat-flow-manager');

function main() {
	const app = express();

	app.use(
		cors({
			credentials: true,
			origin: AppConfig.allowOrigins,
		})
	);

	// parse requests of content-type - application/json
	app.use(bodyParser.text()).use(bodyParser.json());

	app.use(cookieParser());

	// parse requests of content-type - application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: true }));

	//public folder
	app.use('/static', express.static(path.join(process.cwd(), 'uploads'), { maxAge: '30d' }));
	app.use('/', express.static(path.join(process.cwd(), 'public')));

	// apis
	app.use(requestHandler);
	registerAPIs(app);
	//app.use(errorHandler);

	const server = http.createServer(app);

	// set port, listen for requests
	const port = AppConfig.port;
	server.listen(port, () => {
		console.log(`Server is running on port ${port}.`);

		ChatFlowManager.shared.start();
	});
}

module.exports = { main };
