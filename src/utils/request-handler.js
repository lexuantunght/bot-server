function requestHandler(req, res, next) {
	res.header('Access-Control-Allow-Headers', 'X-Bot-Api-Secret-Token, Origin, Content-Type, Accept');
	let body;
	try {
		body = JSON.parse(req.body);
	} catch (err) {
		body = req.body;
	}
	req.body = body;
	next();
}

module.exports = { requestHandler };
