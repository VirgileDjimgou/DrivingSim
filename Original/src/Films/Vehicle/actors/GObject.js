/* eslint-disable camelcase */
/* eslint-disable no-empty-function */
import * as THREE from 'three';
import * as CANNON from 'cannon';

class GObject extends THREE.Group {
	constructor( physicWorld ) {
		super();
		this.physicWorld = physicWorld;
		this.mass = 0;
		this.physicBody = null;
		this.dim = null;
		this.graphic = {
			physicMesh: {},
			model: {}
		};
		this.attributes = {
			visuPhysic: true,
			visuModel: false
		};
		this.physicMeshMatrtial = new THREE.MeshBasicMaterial( {
			color: 0xB3B6B7,
			wireframe: false,
			side: THREE.DoubleSide
		} );

		return this;
	}

	init() {}

	createBody() {}

	addMapToMatarial( map ) {
		for ( let i = 0; i < this.children.length; i++ ) {
			if ( this.children[ i ].type === 'Mesh' ) {
				this.children[ i ].material.map = map;
				this.children[ i ].material.needsUpdate = true;
			} else {
				for ( let k = 0; k < this.children[ i ].children.length; k++ ) {
					this.children[ i ].children[ k ].material.map = map;
					this.children[ i ].children[ k ].material.map.wrapS = THREE.RepeatWrapping;
					this.children[ i ].children[ k ].material.map.wrapT = THREE.RepeatWrapping;
					this.children[ i ].children[ k ].material.map.repeat.set( 5, 5 );
					this.children[ i ].children[ k ].material.map.generateMipmaps = true;
					this.children[ i ].children[ k ].material.needsUpdate = true;
				}
			}
		}
	}

	addAOMapToMatarial( map ) {
		for ( let i = 0; i < this.children.length; i++ ) {
			if ( this.children[ i ].type === 'Mesh' ) {
				this.children[ i ].material.aoMap = map;
				this.children[ i ].material.needsUpdate = true;
			} else {
				for ( let k = 0; k < this.children[ i ].children.length; k++ ) {
					this.children[ i ].children[ k ].material.aoMap = map;
					this.children[ i ].children[ k ].material.aoMap.wrapS = THREE.RepeatWrapping;
					this.children[ i ].children[ k ].material.aoMap.wrapT = THREE.RepeatWrapping;
					this.children[ i ].children[ k ].material.needsUpdate = true;
				}
			}
		}
	}

	addNormalMapToMatarial( map ) {
		for ( let i = 0; i < this.children.length; i++ ) {
			if ( this.children[ i ].type === 'Mesh' ) {
				this.children[ i ].material.normalMap = map;
				this.children[ i ].material.needsUpdate = true;
			} else {
				for ( let k = 0; k < this.children[ i ].children.length; k++ ) {
					this.children[ i ].children[ k ].material.normalMap = map;
					this.children[ i ].children[ k ].material.normalMap.wrapS = THREE.RepeatWrapping;
					this.children[ i ].children[ k ].material.normalMap.wrapT = THREE.RepeatWrapping;
					this.children[ i ].children[ k ].material.map.repeat.set( 5, 5 );
					this.children[ i ].children[ k ].material.map.generateMipmaps = true;
					this.children[ i ].children[ k ].material.needsUpdate = true;
				}
			}
		}
	}

	addDisplMapToMatarial( map ) {
		for ( let i = 0; i < this.children.length; i++ ) {
			if ( this.children[ i ].type === 'Mesh' ) {
				this.children[ i ].material.displacementMap = map;
				this.children[ i ].material.needsUpdate = true;
			} else {
				for ( let k = 0; k < this.children[ i ].children.length; k++ ) {
					this.children[ i ].children[ k ].material.displacementMap = map;
					this.children[ i ].children[ k ].material.displacementMap.wrapS = THREE.RepeatWrapping;
					this.children[ i ].children[ k ].material.displacementMap.wrapT = THREE.RepeatWrapping;
					this.children[ i ].children[ k ].material.needsUpdate = true;
				}
			}
		}
	}

	addRoughnessMapToMatarial( map ) {
		for ( let i = 0; i < this.children.length; i++ ) {
			if ( this.children[ i ].type === 'Mesh' ) {
				this.children[ i ].material.roughnessMap = map;
				this.children[ i ].material.needsUpdate = true;
			} else {
				for ( let k = 0; k < this.children[ i ].children.length; k++ ) {
					this.children[ i ].children[ k ].material.roughnessMap = map;
					// this.children[i].children[k].material.roughness = 1.5;
					this.children[ i ].children[ k ].material.roughnessMap.wrapS = THREE.RepeatWrapping;
					this.children[ i ].children[ k ].material.roughnessMap.wrapT = THREE.RepeatWrapping;
					this.children[ i ].children[ k ].material.map.repeat.set( 5, 5 );
					this.children[ i ].children[ k ].material.map.generateMipmaps = true;
					this.children[ i ].children[ k ].material.needsUpdate = true;
				}
			}
		}
	}

	addToPhysicWorld( body ) {
		this.physicWorld.world.addBody( body );
	}

	createPhysicMesh() {
		let mesh = this.body2mesh( this.dim );

		return mesh;
	}

	update() {
		if ( !this.physicWorld.isPaused ) {
			this.position.copy( this.physicBody.position );
			this.quaternion.copy( this.physicBody.quaternion );
		}
	}

	changeVisuPhysicMesh( staus ) {
		if ( this.graphic.physicMesh && staus ) {
			this.graphic.physicMesh.visible = true;
		} else {
			this.graphic.physicMesh.visible = false;
		}
	}

	body2mesh ( dim ) {
		let obj = new THREE.Object3D();
		for ( let l = 0; l < this.physicBody.shapes.length; l++ ) {

			let shape = this.physicBody.shapes[ l ];
			let mesh;

			switch( shape.type ) {

			case CANNON.Shape.types.BOX:
				let box_geometry = new THREE.BoxGeometry( shape.halfExtents.x * 2,
					shape.halfExtents.y * 2,
					shape.halfExtents.z * 2 );
				mesh = new THREE.Mesh( box_geometry, this.physicMeshMatrtial );
				break;

			case ( 16 ):
				let sphere_geometry = new THREE.CylinderGeometry( shape.drawData.radius,
					shape.drawData.radius,
					shape.drawData.height,
					shape.drawData.segments,
					shape.drawData.segments );
				sphere_geometry.rotateX( Math.PI / 2 );
				mesh = new THREE.Mesh( sphere_geometry, this.physicMeshMatrtial );

				break;

			case CANNON.Shape.types.HEIGHTFIELD:
				let geometry = new THREE.BufferGeometry();

				let vertex = [];

				let v0 = new CANNON.Vec3();
				let v1 = new CANNON.Vec3();
				let v2 = new CANNON.Vec3();

				for ( let xi = 0; xi < shape.data.length - 1; xi++ ) {
					for ( let yi = 0; yi < shape.data[ xi ].length - 1; yi++ ) {
						for ( let k = 0; k < 2; k++ ) {
							shape.getConvexTrianglePillar( xi, yi, k === 0 );
							v0.copy( shape.pillarConvex.vertices[ 0 ] );
							v1.copy( shape.pillarConvex.vertices[ 1 ] );
							v2.copy( shape.pillarConvex.vertices[ 2 ] );
							v0.vadd( shape.pillarOffset, v0 );
							v1.vadd( shape.pillarOffset, v1 );
							v2.vadd( shape.pillarOffset, v2 );

							vertex.push(
								v0.x, v0.y, v0.z,
								v1.x, v1.y, v1.z,
								v2.x, v2.y, v2.z );
						}
					}
				}

				geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( vertex ), 3 ) );

				geometry.computeBoundingBox();
				geometry.computeVertexNormals();

				let v = new THREE.Vector3();
				geometry.boundingBox.getSize( v );

				const uv = [];

				for ( let ki = 0; ki < vertex.length; ki += 3 ) {
					uv.push( ( ( vertex[ ki ] - geometry.boundingBox.min.x ) / v.x ) * dim.sizeX );
					uv.push( ( ( vertex[ ki + 1 ] - geometry.boundingBox.min.y ) / v.y ) * dim.sizeY );
				}

				geometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uv ), 2 ) );

				mesh = new THREE.Mesh( geometry, this.physicMeshMatrtial );


				break;

			case CANNON.Shape.types.SPHERE:
				let sph_geom = new THREE.SphereGeometry( shape.radius, 10, 10 );
				mesh = new THREE.Mesh( sph_geom, this.physicMeshMatrtial );
				break;

			case CANNON.Shape.types.CONVEXPOLYHEDRON:
				let geo = new THREE.BufferGeometry();

				let vert = [];
				let ind = [];

				// Add vertices
				for ( let i = 0; i < shape.vertices.length; i++ ) {
					// for(let ii=0; ii < shape.faces.length; ii++){
					//   let v = shape.vertices[i];
					//   vert.push(v.x, v.y, v.z);
					// }
					let v = shape.vertices[ i ];
					vert.push( v.x, v.y, v.z );

					// vert.push(v.x, v.y, v.z);
					// geo.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
				}

				for( let i = 0; i < shape.faces.length; i++ ) {
				//     var face = shape.faces[i];
					ind[ i ] = shape.faces[ i ];
				//     // add triangles
				//     var a = face[0];
				//     for (var j = 1; j < face.length - 1; j++) {
				//         var b = face[j];
				//         var c = face[j + 1];
				//         geo.faces.push(new THREE.Face3(a, b, c));
				//     }
				}

				geo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( vert ), 3 ) );
				geo.setIndex( ind );
				geo.computeBoundingSphere();
				geo.computeVertexNormals();
				mesh = new THREE.Mesh( geo, this.physicMeshMatrtial );
				break;

			case CANNON.Shape.types.PARTICLE:
				mesh = new THREE.Mesh( this.particleGeo, this.particleMaterial );
				const s = this.settings;
				mesh.scale.set( s.particleSize, s.particleSize, s.particleSize );
				break;

			case CANNON.Shape.types.PLANE:
				// var geometry = new THREE.PlaneGeometry(10, 10, 4, 4);

				// mesh = new THREE.Object3D();
				// var submesh = new THREE.Object3D();
				// var ground = new THREE.Mesh( geometry, this.currentMaterial );
				// ground.scale.set(100, 100, 100);
				// submesh.add(ground);

				// ground.castShadow = true;
				// ground.receiveShadow = true;

				// mesh.add(submesh);
				break;

			case CANNON.Shape.types.TRIMESH:
				// let geometry = new THREE.BufferGeometry();

				// let v0 = new CANNON.Vec3();
				// let v1 = new CANNON.Vec3();
				// let v2 = new CANNON.Vec3();
				// for (var i = 0; i < shape.indices.length / 3; i++) {
				//     shape.getTriangleVertices(i, v0, v1, v2);
				//     geometry.vertices.push(
				//         new THREE.Vector3(v0.x, v0.y, v0.z),
				//         new THREE.Vector3(v1.x, v1.y, v1.z),
				//         new THREE.Vector3(v2.x, v2.y, v2.z)
				//     );
				//     var j = geometry.vertices.length - 3;
				//     geometry.faces.push(new THREE.Face3(j, j+1, j+2));
				// }
				// geometry.computeBoundingSphere();
				// geometry.computeFaceNormals();
				// mesh = new THREE.Mesh(geometry, this.currentMaterial);
				break;

			default:
				console.warn( `Visual type not recognized: ${ shape.type }` );
			}

			mesh.receiveShadow = true;
			mesh.castShadow = true;

			if( mesh.children ) {
				for( let i = 0; i < mesh.children.length; i++ ) {
					mesh.children[ i ].castShadow = true;
					mesh.children[ i ].receiveShadow = true;
					if( mesh.children[ i ] ) {
						for( let j = 0; j < mesh.children[ i ].length; j++ ) {
							mesh.children[ i ].children[ j ].castShadow = true;
							mesh.children[ i ].children[ j ].receiveShadow = true;
						}
					}
				}
			}

			let o = this.physicBody.shapeOffsets[ l ];
			let q = this.physicBody.shapeOrientations[ l ];

			mesh.position.set( o.x, o.y, o.z );
			mesh.quaternion.set( q.x, q.y, q.z, q.w );

			obj.add( mesh );
		}

		return obj;
	}

	foundMeshByName( name = '', source ) {
		for ( let i = 0; i < source.length; i++ ) {
			if ( source[ i ].name === name ) {
				return source[ i ];
			}
		}
	}
}

export { GObject };

