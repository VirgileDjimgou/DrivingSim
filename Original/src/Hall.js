import { App } from './App';

class Hall {
	constructor() {
		this.films = [];
		this.player = new App();
	}

	play() {
		this.player.run();
	}

	stop() {
		this.player.stop();
	}
}

export { Hall };
