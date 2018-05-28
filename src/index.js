let config;
try {
	config = require('./config');
} catch (err) {
	throw new Error('NO CONFIG MADE! Refer to ./src/config.js');
}

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const path = require('path');

const { Browser } = require('./lib/browser');

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'virtual-page.html'));
});

io.on('connection', async socket => {
	console.log('a user connected');

	const browser = new Browser(socket);
	await browser.initialize();

	socket.on('disconnect', () => {
		console.log('user disconnected');
		browser.kill();
	});
});

server.listen(config.port, () => console.log(`Server listening on *:${config.port}`));
