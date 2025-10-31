
import { VehicleFilm } from './Films/Vehicle/VehicleFilm';

// Player


class App {
	constructor( display, res ) {
		this.name = 'Top Manager';
		this.currentFilm = new VehicleFilm( display, res );
		this.init();

		return this;
	}

	init() {
		this.currentFilm.init();
	}

	action() {
		this.currentFilm.run();
	}

	stop() {
		this.currentFilm.stop();
	}

	setInputData( input ) {

		if ( input === undefined ) {
			return;
		}

		for ( const key in input ) {

			const newValue = input[ key ];

			if ( newValue === undefined ) {
				console.warn( `App: '${ key }' parameter is undefined.` );
			}

			const currentValue = this[ key ];

			if ( currentValue === undefined ) {
				console.warn( `App.${ this.type }: '${ key }' is not a property of this material.` );
			}

			this[ key ] = newValue;

		}

	}

	greeting() {
		console.log( `Hi! I am ${ this.name }. Welcome to App.js =)` );
		for ( const core of Object.values( this.cores ) ) {
			core.greeting();
		}
	}

}

export { App };
