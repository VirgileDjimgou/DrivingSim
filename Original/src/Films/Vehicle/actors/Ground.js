import { GObject } from './GObject';
import * as CANNON from 'cannon';
import * as THREE from 'three';

class Ground extends GObject {
	constructor( phWorld, dim, initialPos ) {
		super( phWorld );
		this.dim = dim;
		this.initPos = initialPos;
		this.physicMeshMatrtial = new THREE.MeshStandardMaterial( { side: THREE.DoubleSide } );
		this.init();

		return this;
	}

	init() {
		this.createBody();
		this.graphic.physicMesh = this.createPhysicMesh();

		this.addToPhysicWorld( this.physicBody );
		this.add( this.graphic.physicMesh );
		this.update();
	}

	createBody() {
		const hfShape = this.createHeightFieldShape( this.dim );
		hfShape.material = this.physicWorld.groundMaterial;
		const quat = new CANNON.Quaternion();
		quat.setFromAxisAngle( new CANNON.Vec3( 1, 0, 0 ), -Math.PI / 2 );

		this.physicBody = new CANNON.Body( {
			name: 'ground',
			mass: 0,
			position: this.initPos,
			quaternion: quat,
			shape: hfShape,
			material: this.physicWorld.groundMaterial
		} );
	}

	createHeightFieldShape( dim ) {

		let shape = {};
		let matrix = [];
		let defHeight = 0;
		let heightPlane = dim.heightPlane;

		for ( let i = 0; i < dim.sizeX; i++ ) {
			matrix.push( [] );
			for ( let j = 0; j < dim.sizeY; j++ ) {
				let height = Math.sin( i / dim.sizeX * Math.PI * 8 ) *
				Math.sin( j / dim.sizeY * Math.PI * 8 ) *
				dim.amplitude + heightPlane;

				if( i === 0 || i === dim.sizeX - 1 || j === 0 || j === dim.sizeY - 1 ) {
					height = defHeight;
				}

				matrix[ i ].push( height );
			}
		}

		shape = new CANNON.Heightfield( matrix, { elementSize: dim.elementSize } );

		return shape;
	}
}

export { Ground };
