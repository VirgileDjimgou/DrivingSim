import { EventEmitter } from 'events';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


class GraphicLoader extends EventEmitter {
	constructor( assets ) {
		super();
		this.name = 'loader';
		this.assets = assets;
	}

	load() {
		if ( this.assets === undefined || this.assets.length === 0 ) {
			console.warn( 'Loader. No any assets!' );

			return;
		}

		this.emit( 'start' );
		this.loaded = 0;
		this.assetsSize = this.assets.length;
		this.res = new Map();

		for ( let i = 0; i < this.assets.length; i++ ) {
			this.doLoad( this.chooseLoader( this.assets[ i ] ), this.assets[ i ] );
		}
	}

	getLoaderTypeFromUrl( url ) {
		return url.split( '.' ).pop();
	}

	chooseLoader( asset ) {
		switch ( asset.type ) {
		case 'texture':
			return new THREE.TextureLoader();
		case 'env':
		case 'scene':
			return new THREE.CubeTextureLoader();
		case '3dModel':

			switch ( this.getLoaderTypeFromUrl( asset.url ) ) {

			case 'gltf':
			case 'glb':
				return new GLTFLoader();

			default:
				console.warn( `Dismatch type 3d loader:${ asset.name } !` );
				break;
			}

			break;
		default:
			console.warn( `Dismatch type of asset:${ asset.name } !` );

			return null;
		}
	}

	doLoad( loader, asset ) {
		if ( !loader ) {
			return;
		}

		loader
			.setPath( asset.path )
			.load( asset.url, ( model ) => {
				this.res.set( asset.name, model );
				this.loaded++;
				this.emit( 'progress', {
					value: this.loaded / this.assetsSize,
					name: asset.name,
					map: model,
					asset
				} );
				if ( this.loaded >= this.assetsSize ) {
					this.emit( 'load', this.res );
				}
			} );
	}
}

export { GraphicLoader };
