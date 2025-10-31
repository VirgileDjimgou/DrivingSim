/* eslint-disable no-empty-function */


class Core {
	constructor( name = '' ) {
		this.name = name;
		this.processId = null;
	}

	greeting() {
		console.log( `Hi! I am ${ this.name } =)))` );
	}

	init() {}

	preStart() {}

	run() {
		this.preStart();
		this.cycle();
	}

	cycle() {

		this.update();

		this.processId = requestAnimationFrame( () => {
			this.cycle();
		} );

	}

	update() {}

	postStart() {}

	stop() {
		this.postStart();
		cancelAnimationFrame( this.processId );
	}

}
export { Core };
