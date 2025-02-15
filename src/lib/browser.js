const path = require('path');
const puppeteer = require('puppeteer');

class Browser {

	constructor(socket) {
		this.socket = socket;
		this.puppet = null;
		this.page = null;

		this.title = null;
		this.view = null;

		this.viewport = null;
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
		// await this.navigate(`file://${__dirname}/../pages/page1.html`);
		await this.navigate('https://google.com');

		this.socket.on('viewport dimensions', dimensions => this.setViewport(dimensions));
		this.socket.on('mouse position', position => this.setMousePosition(position));
		this.socket.on('mouse down', mouseEvent => this.mouseDown(mouseEvent));
		this.socket.on('mouse up', mouseEvent => this.mouseUp(mouseEvent));

		this.socket.emit('ready');

		this.socket.once('viewport dimensions', async () => {
			while (this.renderCycle) {
				await this.render();
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		});
	}

	async kill() {
		await this.puppet.close();
	}

	async navigate(url) {
		await this.page.goto(url);
	}

	async render() {
		this.pauseBrowserUpdates = true;
		this.view = await this.page.screenshot({ encoding: 'base64' });
		this.title = await this.page.title();
		this.pauseBrowserUpdates = false;
		this.setViewport();
		this.setMousePosition();
		this.socket.emit('render', {
			title: this.title,
			view: this.view
		});
	}

	/**
	 * Configure settings
	 */

	/**
	 * viewport - { width, height, devicePixelRatio }
	 */

	setViewport(viewport) {
		if (viewport) {
			this.viewport = {
				width: viewport.width,
				height: viewport.height,
				deviceScaleFactor: viewport.devicePixelRatio
			};
		}
		if (!this.pauseBrowserUpdates && this.viewport !== null) {
			this.page.setViewport({
				width: this.viewport.width,
				height: this.viewport.height,
				deviceScaleFactor: this.viewport.devicePixelRatio
			});
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
		}
	}

	/**
	 * I/O Events
	 */

	mouseDown({ button, x, y }) {
		this.page.mouse.move(x, y)
		this.page.mouse.down({ button });
	}

	mouseUp({ button, x, y }) {
		this.page.mouse.move(x, y)
		this.page.mouse.up({ button });
	}
}

module.exports = { Browser };
