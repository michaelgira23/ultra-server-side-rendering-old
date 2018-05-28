const path = require('path');
const puppeteer = require('puppeteer');

class Browser {

	constructor(socket) {
		console.log('Create browser');
		this.socket = socket;
		this.puppet = null;
		this.page = null;
		this.dimensions = null;
		this.view = null;

		this.renderCycle = true;
	}

	async initialize() {
		console.log('Initialize');
		this.puppet = await puppeteer.launch();
		this.page = await this.puppet.newPage();
		await this.navigate(`file://${__dirname}/../pages/page1.html`);

		while (this.renderCycle) {
			await this.render();
		}
	}

	async kill() {
		console.log('Die');
		await this.puppet.close();
	}

	async navigate(url) {
		await this.page.goto(url);
	}

	async render() {
		this.view = await this.page.screenshot({ encoding: 'base64' });
		this.socket.emit('render', this.view);
	}
}

module.exports = { Browser };
