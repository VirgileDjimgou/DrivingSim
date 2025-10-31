/* eslint-disable no-empty-function */
import * as CANNON from 'cannon';

class VehicleWorld {
	constructor( world ) {
		this.world = world;
		this.isPaused = false;
		this.init();
	}

	init() {
		this.world.gravity.set( 0, -9.81, 0 );
		this.world.broadphase = new CANNON.NaiveBroadphase( this.world );
		this.world.solver.iterations = 10;
		this.addContactMaterials( this.world );
	}

	addContactMaterials( world ) {
		world.defaultContactMaterial.friction = 0;

		this.groundMaterial = new CANNON.Material( 'groundMaterial' );
		this.groundMaterial.friction = 10;

		this.wheelMaterial = new CANNON.Material( 'wheelMaterial' );
		this.wheelMaterial.friction = 10;
		this.groundWheelContactMaterial = new CANNON.ContactMaterial( this.wheelMaterial, this.groundMaterial, {
			friction: 10,
			restitution: 0.3,
			contactEquationStiffness: 1e8,
			contactEquationRelaxation: 3,
			frictionEquationStiffness: 1e8,
			frictionEquationRegularizationTime: 10
		} );
		world.addContactMaterial( this.groundWheelContactMaterial );
	}

	update() {}

}

export { VehicleWorld };
