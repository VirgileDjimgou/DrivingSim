import { GObject } from '../GObject';
import * as CANNON from 'cannon';
import * as THREE from 'three';

class Body extends GObject {
	constructor ( phW, dim, mass, initPos ) {
		super( phW );
		this.dim = dim;
		this.initPos = initPos;
		this.mass = mass;
		this.physicMeshMatrtial = new THREE.MeshBasicMaterial( {
			color: 'red',
			wireframe: true,
			side: THREE.DoubleSide
		} );
		this.init();

		return this;
	}

	init() {
		this.createBody();
		this.graphic.physicMesh = this.createPhysicMesh();
		this.graphic.physicMesh.visible = false;
		this.graphic.physicMesh.name = 'vehicleBody';
		this.add( this.graphic.physicMesh );
	}

	createBody() {
		const chassisShape = new CANNON.Box( new CANNON.Vec3( this.dim.x / 2.1, this.dim.y / 2.3, this.dim.z / 2.25 ) );

		this.physicBody = new CANNON.Body( { mass: this.mass } );

		this.physicBody.name = 'vehicle body';
		this.physicBody.addShape( chassisShape );
		this.physicBody.position.copy( this.initPos );
		let qR = new CANNON.Quaternion();
		qR.setFromAxisAngle( new CANNON.Vec3( 1, 0, 0 ), -Math.PI / 2 );
		this.physicBody.quaternion = qR;
		this.physicBody.angularVelocity.set( 0, 0, 0.1 );
	}

	createHeadlights() {

		this.headLights = {
			LF: new THREE.SpotLight(),
			RF: new THREE.SpotLight()
		};

		// const lightBias = 5;
		// this.headLights.LF.position.x = lightBias;
		// this.headLights.RF.position.x = lightBias;

		this.headLights.LF.name = 'lf';
		this.headLights.LF.target.name = 'lf_t';

		this.headLights.LF.intensity = 2;
		this.headLights.LF.penumbra = 0.24;
		this.headLights.LF.distance = 100;
		this.headLights.LF.angle = 1.1;
		this.headLights.LF.target.position.x = 100;
		this.headLights.LF.target.position.z = -21;

		this.headLights.RF.name = 'rf';
		this.headLights.RF.target.name = 'rf_t';

		this.headLights.RF.intensity = 2;
		this.headLights.RF.penumbra = 0.24;
		this.headLights.RF.distance = 100;
		this.headLights.RF.angle = 1.1;
		this.headLights.RF.target.position.x = 100;
		this.headLights.RF.target.position.z = -21;

		this.headLights.LF.visible = false;
		this.headLights.RF.visible = false;

		this.headLights.LF.add( this.headLightsFlare.LF );
		this.headLights.RF.add( this.headLightsFlare.RF );

		this.add( this.headLights.LF, this.headLights.LF.target,
			this.headLights.RF, this.headLights.RF.target );
	}

	createHeadlitsFlare( mapFlare ) {
		this.headLightsFlare = {
			material: new THREE.PointsMaterial( {
				color: 0xffffff,
				size: 50,
				blending: THREE.AdditiveBlending,
				transparent: true,
				map: mapFlare,
				fog: false
			} ),
			geometryLF: new THREE.BufferGeometry(),
			geometryRF: new THREE.BufferGeometry(),
			LF: {},
			RF: {}
		};

		this.headLightsFlare.geometryLF.setAttribute( 'position', new THREE.Float32BufferAttribute( [
			0.3 / 15,
			-0.5 / 15,
			-0.1 / 15
		], 3 ) );
		this.headLightsFlare.LF = new THREE.Points( this.headLightsFlare.geometryLF, this.headLightsFlare.material );
		this.headLightsFlare.geometryRF.setAttribute( 'position', new THREE.Float32BufferAttribute( [
			0.3 / 15,
			0.5 / 15,
			-0.1 / 15
		], 3 ) );
		this.headLightsFlare.RF = new THREE.Points( this.headLightsFlare.geometryRF, this.headLightsFlare.material );
	}

	headlightHelp( angle ) {
		if ( this.headLights ) {
			this.headLights.LF.target.position.y = this.headLights.LF.position.y +
			( ( angle > 0 ) ? Math.sin( angle ) * 50 : 0 );
			this.headLights.RF.target.position.y = this.headLights.RF.position.y +
			( ( angle <= 0 ) ? Math.sin( angle ) * 50 : 0 );
		}
	}

	addHeadlightsFlare( map ) {
		this.createHeadlitsFlare( map );
	}

	setLightsPositions() {

		const front = {
			x: 17.8 / 15,
			y: 5.53 / 15,
			z: -0.6 / 15
		};

		const rear = {
			x: -16.9 / 15,
			y: 4.3 / 15,
			z: 1 / 15
		};

		const flLight = this.foundMeshByName( 'f_l_light', this.children );
		const frLight = this.foundMeshByName( 'f_r_light', this.children );
		const rlLight = this.foundMeshByName( 'r_l_light', this.children );
		const rrLight = this.foundMeshByName( 'r_r_light', this.children );

		flLight.position.set( front.x, front.y, front.z );
		frLight.position.set( front.x, -front.y, front.z );
		rlLight.position.set( rear.x, rear.y, rear.z );
		rrLight.position.set( rear.x, -rear.y, rear.z );

		this.foundMeshByName( 'lf', this.children )
			.position.set( flLight.position.x + 0.55 / 15, flLight.position.y, flLight.position.z );
		this.foundMeshByName( 'rf', this.children )
			.position.set( frLight.position.x + 0.55 / 15, frLight.position.y, frLight.position.z );
	}

}

export { Body };
