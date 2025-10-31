import { Core } from './Core';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import * as THREE from 'three';

class Film extends Core {
	constructor() {
		super( 'cf' );
		this.cores = {
			graphic: null,
			physic: null
		};
		this.ui = null;
		this.stats = new Stats();
		this.threeClock = new THREE.Clock();
		this.dt = 0;
	}

	init() {
		if ( this.cores.physic ) {
			this.cores.physic.init();
		}
		if ( this.cores.graphic ) {
			this.cores.graphic.getPhysicWorld( this.cores.physic.currentWorld );
			this.cores.graphic.init();
		}
	}

	preStart() {
		this.threeClock.start();
		if ( this.cores.physic ) {
			this.cores.physic.preStart();
		}
		if ( this.cores.graphic ) {
			this.cores.graphic.preStart();
		}

		console.log( 'done prestart' );
	}

	update() {

		this.stats.begin();

		this.dt = this.threeClock.getDelta();

		if ( this.cores.physic ) {
			this.cores.physic.update( this.dt );
		}
		if ( this.cores.graphic ) {
			this.cores.graphic.update( this.dt );
		}

		this.stats.end();
	}

	postStart() {

		this.threeClock.stop();

		if ( this.cores.physic ) {
			this.cores.physic.postStart();
		}
		if ( this.cores.graphic ) {
			this.cores.graphic.postStart();
		}
	}
}

export { Film };
