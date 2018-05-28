const path = require('path');
const puppeteer = require('puppeteer');

class Browser {

	constructor(socket) {
		console.log('Create browser');
		this.socket = socket;
		this.puppet = null;
		this.page = null;
		this.view = null;

		this.viewportDimensions = null;
		this.mousePosition = null;

		// Whether or not to update headless Chromium with mouse events, viewport, etc.
		this.pauseBrowserUpdates = false;
		// Whether or not to render screenshots and send to client
		this.renderCycle = true;
	}

	async initialize() {
		console.log('Initialize');
		this.puppet = await puppeteer.launch();
		// this.puppet = await puppeteer.launch({ headless: false, slowMo: 250 });
		this.page = await this.puppet.newPage();
		await this.navigate(`file://${__dirname}/../pages/page1.html`);

		this.socket.on('viewport dimensions', dimensions => this.setViewportDimensions(dimensions));
		this.socket.on('mouse position', position => this.setMousePosition(position));

		this.socket.emit('ready');

		while (this.renderCycle) {
			await this.render();
			await new Promise(resolve => setTimeout(resolve, 1000));
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
		this.pauseBrowserUpdates = true;
		this.view = await this.page.screenshot({ encoding: 'base64' });
		this.pauseBrowserUpdates = false;
		this.setViewportDimensions();
		this.setMousePosition();
		this.socket.emit('render', this.view);
	}

	/**
	 * Configure settings
	 */

	/**
	 * Size - { width, height }
	 */

	setViewportDimensions(size) {
		if (size) {
			this.viewportDimensions = {
				width: size.width,
				height: size.height
			};
		}
		if (!this.pauseBrowserUpdates && this.viewportDimensions !== null) {
			this.page.setViewport({
				width: this.viewportDimensions.width,
				height: this.viewportDimensions.height
			});
			console.log('set viewport');
		}
	}

	/**
	 * Position - { x, y }
	 */

	setMousePosition(position) {
		if (position) {
			this.mousePosition = {
				x: position.x,
				y: position.y
			};
		}
		if (!this.pauseBrowserUpdates && this.mousePosition !== null) {
			this.page.mouse.move(this.mousePosition.x, this.mousePosition.y);
			console.log('mouse position', this.mousePosition);
		}
	}
}

module.exports = { Browser };
