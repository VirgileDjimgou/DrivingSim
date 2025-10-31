/* eslint-disable camelcase */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class TestCarStyle {
	constructor( canvas ) {
		this.name = 'test scene';
		this.assetes = null;
		this.canvas = canvas;
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000 );
		this.init();

		return this;
	}

	init() {
		const initFcn = {
			do () {
				this.prepare();
				this.sceneSettings();
			},
			prepare () {
				this.createActors();
				this.light();
				this.cameraAndControlls();
			},
			createActors () {
				this.addGround();
				this.addBody();
			},
			light: () => {

				const skyColor = 0xB1E1FF;
				const groundColor = 0xB97A20;

				this.dirLight = new THREE.DirectionalLight( 'white', 1 );
				this.hemLight = new THREE.HemisphereLight( skyColor, groundColor, 1 );

				this.dirLight.target.position.copy( this.body.position );

				this.dirLight.position.x = 50;
				this.dirLight.position.y = 100;
				this.dirLight.position.z = 0;

				this.scene.add( this.dirLight );
				this.scene.add( this.hemLight );
				this.scene.add( this.dirLight.target );
			},
			addGround: () => {

				const groundGeom = new THREE.PlaneGeometry( 300, 300 );
				const groundMaterial = new THREE.MeshStandardMaterial( {
					color: new THREE.Color( 0xC5C4C4 ),
					metalness: 0.5,
					roughness: 0.1
				} );

				this.ground = new THREE.Mesh( groundGeom, groundMaterial );
				this.ground.rotation.x = -Math.PI / 2;
			},
			addBody: () => {
				const bodyGeom = new THREE.BoxGeometry( 10, 10, 10 );
				const bodyMaterial = new THREE.MeshStandardMaterial( {
					color: new THREE.Color( 0x3158CB ),
					metalness: 0.5,
					roughness: 0.1
				} );

				this.body = new THREE.Mesh( bodyGeom, bodyMaterial );
				this.body.position.y = 10;
			},
			cameraAndControlls: () => {
				this.camera.position.set( 29, 33, 18 );
				this.controls = new OrbitControls( this.camera, this.canvas );
				this.controls.target.copy( this.body.position );
			},
			sceneSettings: () => {
				this.scene.background = new THREE.Color( 0xeeeeee );
				this.scene.add( this.ground );
				this.scene.add( this.body );
			}
		};

		initFcn.do();

		console.log( this );
	}

	loadAllAssets() {
		console.log( this.assetes );
	}

	// addFog() {
	// 	if ( this.scene.background.isTexture ) {
	// 		this.scene.background = this.defBackground;
	// 	}

	// 	this.fog.color = this.scene.background;
	// 	this.scene.fog = this.fog;
	// }

	// removeFog() {
	// 	if ( this.scene.background.isColor ) {
	// 		this.scene.background = this.assetes.get( 'envBox' );
	// 	}

	// 	this.scene.fog = null;
	// }

	addAssets( data ) {

		// const foundMeshByName = ( name = '', source ) => {
		// 	for ( let i = 0; i < source.length; i++ ) {
		// 		if ( source[ i ].name === name ) {
		// 			return source[ i ];
		// 		}
		// 	}
		// };

		// const foundMaterialInGroupByName = ( name = '', grp ) => {
		// 	let material = null;
		// 	for ( let i = 0; i < grp.children.length; i++ ) {
		// 		if ( grp.children[ i ].isMesh ) {
		// 			if ( grp.children[ i ].material.name === name ) {
		// 				return grp.children[ i ].material;
		// 			}
		// 		}
		// 	}


		// 	return material;
		// };

		switch ( data.name ) {
		case 'vehicleModel':
			data.map.scene.traverse( ( child ) => {
				if ( !child.isMesh ) {
					return undefined;
				}

				// const mat = new THREE.MeshPhysicalMaterial( { color: 'white', metalness: 0.96, roughness: 0.1 } );

				// child.castShadow = true;

				// let prevMaterial = child.material;
				// child.material = new THREE.MeshPhysicalMaterial();
				// THREE.MeshStandardMaterial.prototype.copy.call( child.material, prevMaterial );
				// const name = child.material.name;
				// child.material = mat;
				// child.material.name = name;
			} );
			// this.vehicle = new THREE.Group();

			// const body = foundMeshByName( 'body', data.map.scene.children );

			// // this.testConvPol( body.children[ 0 ] );

			// this.vehicle.materials.body = foundMaterialInGroupByName( 'testCarPaint', body );
			// // this.vehicle.materials.body.wireframe = true;
			// this.vehicle.materials.body.emissive.setHex( 0x193e14 );


			// const suppRF = foundMeshByName( 'frSup', data.map.scene.children );
			// const suppLF = foundMeshByName( 'lfSup', data.map.scene.children );
			// const suppRR = foundMeshByName( 'rrSup', data.map.scene.children );
			// const suppLR = foundMeshByName( 'rlSup', data.map.scene.children );

			// this.vehicle.materials.supports.RF = foundMaterialInGroupByName( 'Material.001', suppRF );
			// this.vehicle.materials.supports.LF = foundMaterialInGroupByName( 'Material.001', suppLF );
			// this.vehicle.materials.supports.RR = foundMaterialInGroupByName( 'Material.001', suppRR );
			// this.vehicle.materials.supports.LR = foundMaterialInGroupByName( 'Material.001', suppLR );

			// this.vehicle.materials.supports.RF.envMapIntensity = 1.4;
			// this.vehicle.materials.supports.LF.envMapIntensity = 1.4;
			// this.vehicle.materials.supports.RR.envMapIntensity = 1.4;
			// this.vehicle.materials.supports.LR.envMapIntensity = 1.4;

			// this.vehicle.supports.RF = suppRF;
			// this.vehicle.supports.LF = suppLF;
			// this.vehicle.supports.RR = suppRR;
			// this.vehicle.supports.LR = suppLR;

			// const lightLF = foundMeshByName( 'f_l_light', data.map.scene.children );
			// const lightRF = foundMeshByName( 'f_r_light', data.map.scene.children );
			// const lightRR = foundMeshByName( 'r_r_light', data.map.scene.children );
			// const lightLR = foundMeshByName( 'r_l_light', data.map.scene.children );

			// const matLightRF = foundMaterialInGroupByName( 'righTurnLight', lightRF );
			// const matLightLF = foundMaterialInGroupByName( 'leftTurnLight', lightLF );

			// matLightLF.emissive.setHex( 0x000000 );
			// matLightRF.emissive.setHex( 0x000000 );

			// this.vehicle.materials.lights.LF = matLightLF;
			// this.vehicle.materials.lights.RF = matLightRF;

			// const matLightRR = foundMaterialInGroupByName( 'REAR TAIL LIGHT.002', lightRR );
			// const matLightLR = foundMaterialInGroupByName( 'REAR TAIL LIGHT.002', lightLR );
			// const turnLeftRear = foundMaterialInGroupByName( 'leftReverseLight', lightLR );
			// const turnRightRear = foundMaterialInGroupByName( 'rightReverseLight', lightRR );

			// this.vehicle.materials.lights.rearTurns.L = turnLeftRear;
			// this.vehicle.materials.lights.rearTurns.R = turnRightRear;

			// matLightLR.emissive.r = 0.35;
			// matLightRR.emissive.r = 0.35;

			// this.vehicle.materials.lights.LR = matLightLR;
			// this.vehicle.materials.lights.RR = matLightRR;

			// this.vehicle.body.add(
			// 	body,
			// 	lightLF,
			// 	lightLR,
			// 	lightRR,
			// 	lightRF,
			// 	this.vehicle.supports.RF,
			// 	this.vehicle.supports.LF,
			// 	this.vehicle.supports.RR,
			// 	this.vehicle.supports.LR );


			// this.vehicle.body.createHeadlights();
			// this.vehicle.body.setLightsPositions();

			// this.vehicle.wheels.RR.add( foundMeshByName( 'r_r_wheel', data.map.scene.children ) );
			// this.vehicle.wheels.RF.add( foundMeshByName( 'f_r_wheel', data.map.scene.children ) );
			// this.vehicle.wheels.LR.add( foundMeshByName( 'r_l_wheel', data.map.scene.children ) );
			// this.vehicle.wheels.LF.add( foundMeshByName( 'f_l_wheel', data.map.scene.children ) );

			// const wheel_RR = foundMeshByName( 'r_r_wheel', this.vehicle.wheels.RR.children );
			// const wheel_RF = foundMeshByName( 'f_r_wheel', this.vehicle.wheels.RF.children );
			// const wheel_LR = foundMeshByName( 'r_l_wheel', this.vehicle.wheels.LR.children );
			// const wheel_LF = foundMeshByName( 'f_l_wheel', this.vehicle.wheels.LF.children );

			// const carbonDiskLF = foundMaterialInGroupByName( 'carbon disk brake', wheel_LF );
			// const carbonDiskRF = foundMaterialInGroupByName( 'carbon disk brake', wheel_RF );
			// const carbonDiskLR = foundMaterialInGroupByName( 'carbon disk brake', wheel_LR );
			// const carbonDiskRR = foundMaterialInGroupByName( 'carbon disk brake', wheel_RR );

			// carbonDiskLF.envMapIntensity = 0.5;
			// carbonDiskRF.envMapIntensity = 0.5;
			// carbonDiskLR.envMapIntensity = 0.5;
			// carbonDiskRR.envMapIntensity = 0.5;

			// this.vehicle.materials.rim.LF = foundMaterialInGroupByName( 'frontDisk', wheel_LF );
			// this.vehicle.materials.rim.RF = foundMaterialInGroupByName( 'frontDisk', wheel_RF );
			// this.vehicle.materials.rim.LR = foundMaterialInGroupByName( 'frontDisk', wheel_LR );
			// this.vehicle.materials.rim.RR = foundMaterialInGroupByName( 'frontDisk', wheel_RR );

			// this.vehicle.materials.rim.LF.emissive.setHex( 0x8c8c8c );
			// this.vehicle.materials.rim.RF.emissive.setHex( 0x8c8c8c );
			// this.vehicle.materials.rim.LR.emissive.setHex( 0x8c8c8c );
			// this.vehicle.materials.rim.RR.emissive.setHex( 0x8c8c8c );

			// const tireLF = foundMaterialInGroupByName( 'tire', wheel_LF );
			// const tireRF = foundMaterialInGroupByName( 'tire', wheel_RF );
			// const tireLR = foundMaterialInGroupByName( 'tire', wheel_LR );
			// const tireRR = foundMaterialInGroupByName( 'tire', wheel_RR );

			// const color = 0x181818;

			// tireLF.color.setHex( color );
			// tireRF.color.setHex( color );
			// tireLR.color.setHex( color );
			// tireRR.color.setHex( color );

			// tireLF.metalness = 1;
			// tireRF.metalness = 1;
			// tireLR.metalness = 1;
			// tireRR.metalness = 1;

			// tireLF.roughness = 0.65;
			// tireRF.roughness = 0.65;
			// tireLR.roughness = 0.65;
			// tireRR.roughness = 0.65;


			// this.vehicle.body.name = 'body';
			// this.vehicle.wheels.LF.name = 'LF';
			// this.vehicle.wheels.RF.name = 'RF';
			// this.vehicle.wheels.RR.name = 'RR';
			// this.vehicle.wheels.LR.name = 'LR';

			// data.map = null;

			// console.log( this.vehicle );
			break;
		default:
			break;
		}
	}

	resizeAction() {
		this.camera.aspect = this.canvas.width / this.canvas.height;
		this.camera.updateProjectionMatrix();
	}

	update( fi ) {
		this.body.rotation.x = fi;
		this.body.rotation.y = fi;
		this.controls.update();
		this.dirLight.target.updateMatrixWorld();
	}
}

export { TestCarStyle };
