/* eslint-disable no-empty-function */


import * as THREE from 'three';
import { GraphicLoader } from './GraphicLoader';
import { VehicleScene } from './scenes/VehicleScene';
import { LoaderIndicator } from './LoaderIndicator';
import { Timer } from './Timer';


class GraphicCore {
	constructor( element = null, resources = null, ui = null, stats = null ) {
		this.name = 'three.js app';
		this.domElement = element;
		this.useCssLoader = true;
		this.cssLoaderBar = null;
		this.loader = new GraphicLoader( resources );
		this.currentScene = null;
		this.appConfig = {
			fps: 60,
			dT: 0,
			tPrev: window.performance.now(),
			speed: 0.001,
			fi: 0
		};
		this.timer = null;
		this.guideMenu = null;
		this.currentPhysicWorld = null;
		this.ui = ui;
		this.stats = stats;

		return this;
	}

	getPhysicWorld( world ) {
		this.currentPhysicWorld = world;
	}

	init() {
		this.timer = new Timer();

		this.prepareCanvas( this.domElement );

		if ( this.useCssLoader ) {
			this.cssLoaderBar = new LoaderIndicator( this.domElement );
		} else if ( this.domElement ) {
			this.domElement.appendChild( this.canvas );
		} else {
			document.body.appendChild( this.canvas );
		}

		this.renderer = new THREE.WebGLRenderer( {
			canvas: this.canvas,
			antialias: true
		} );
		this.renderer.autoClear = true;

		this.pixelRatio = window.devicePixelRatio;
		this.renderer.setPixelRatio( this.pixelRatio );

		window.addEventListener( 'resize', () => {
			this.resize();
		} );
		this.currentScene = new VehicleScene( this.canvas, this.currentPhysicWorld, this.timer );

		console.log( 'THREE done init' );
	}

	preStart() {
		this.startLoadAssets();
		if ( this.timer ) {
			this.timer.preStart();
		}

		this.renderer.clear();

		console.log( 'THREE done prestart' );
	}

	update( dt ) {
		if ( this.timer ) {
			this.timer.update();
		}

		this.animate( dt );
	}

	postStart() {
		if ( this.timer ) {
			this.timer.postStart();
		}

		this.renderer.dispose();
	}


	animate( dt ) {
		this.appConfig.fi += this.appConfig.speed * dt * this.appConfig.fps;
		this.currentScene.update( this.appConfig.fi );

		if ( this.pixelRatio === 1 ) {
			this.renderer.render( this.currentScene.scene, this.currentScene.camera );
		} else if ( ( this.pixelRatio > 1 ) ) {
			if ( ( dt * this.appConfig.fps ) < 1.2 ) {
				this.renderer.render( this.currentScene.scene, this.currentScene.camera );
			}
		}
	}

	resize() {
		if ( this.domElement ) {

			if ( this.cssLoaderBar ) {
				this.cssLoaderBar.resize();
			}

			this.renderer.setSize( this.domElement.clientWidth, this.domElement.clientHeight );

		} else {

			this.renderer.setSize( window.innerWidth, window.innerHeight );
		}

		this.pixelRatio = window.devicePixelRatio;
		this.renderer.setPixelRatio( this.pixelRatio );
		this.currentScene.resizeAction();
	}

	startLoadAssets() {
		if ( !this.currentScene.assetes ) {

			this.loader.on( 'start', () => {

			} );

			this.loader.on( 'progress', ( d ) => {
				this.currentScene.addAssets( d );
				console.log( `${ Math.round( d.value * 100 ) }%` );
			} );

			this.loader.on( 'load', ( result ) => {

				if ( this.useCssLoader ) {

					this.useCssLoader = false;

					if ( this.domElement ) {
						this.domElement.removeChild( this.cssLoaderBar.holder );
						this.domElement.appendChild( this.canvas );
					} else {
						document.body.removeChild( this.cssLoaderBar.holder );
						document.body.appendChild( this.canvas );
					}

					this.cssLoaderBar = null;

					this.resize();
				}

				this.createGuideMenu();
				this.ui.init();

				this.currentScene.assetes = result;
				this.currentScene.loadAllAssets();

			} );

			this.loader.load();

		}
	}

	chageStatusGuideMenu( status = '' ) {
		document.querySelector( '.guide' ).style.visibility = status;
	}

	createGuideMenu() {

		if ( this.currentScene.name === 'vehicle scene' ) {

			const guideMenu = document.createElement( 'div' );
			guideMenu.className = 'guide';

			guideMenu.style.position = 'fixed';
			guideMenu.style.zIndex = '999';
			guideMenu.style.top = '0';
			guideMenu.style.left = '0';
			guideMenu.style.margin = '5px';


			const text = {
				wasd: {
					element: document.createElement( 'p' ),
					textContent: 'W, A, S, D - Movement controls'
				},
				w: {
					element: document.createElement( 'p' ),
					textContent: 'W - Forward'
				},
				a: {
					element: document.createElement( 'p' ),
					textContent: 'A - Turn Left'
				},
				s: {
					element: document.createElement( 'p' ),
					textContent: 'S - Stop/Backward'
				},
				d: {
					element: document.createElement( 'p' ),
					textContent: 'D - Turn Right'
				},
				l: {
					element: document.createElement( 'p' ),
					textContent: 'L - On/Off Headlights'
				},
				v: {
					element: document.createElement( 'p' ),
					textContent: 'V - On/Off Controls'
				},
				space: {
					element: document.createElement( 'p' ),
					textContent: 'Space - Handbreake'
				},
				r: {
					element: document.createElement( 'p' ),
					textContent: 'R - Reset vehicle'
				},
				b: {
					element: document.createElement( 'p' ),
					textContent: 'B - Set/Reset Handbreake'
				},
				e: {
					element: document.createElement( 'p' ),
					textContent: 'E - On/Off cruise controll (W - "add"; S - "sub")'
				},
				f: {
					element: document.createElement( 'p' ),
					textContent: 'F - Set/Reset Steering angle'
				}

			};

			text.wasd.element.textContent = text.wasd.textContent;
			guideMenu.appendChild( text.wasd.element );

			text.r.element.textContent = text.r.textContent;
			guideMenu.appendChild( text.r.element );

			text.l.element.textContent = text.l.textContent;
			guideMenu.appendChild( text.l.element );

			text.v.element.textContent = text.v.textContent;
			guideMenu.appendChild( text.v.element );

			text.b.element.textContent = text.b.textContent;
			guideMenu.appendChild( text.b.element );

			text.e.element.textContent = text.e.textContent;
			guideMenu.appendChild( text.e.element );

			text.f.element.textContent = text.f.textContent;
			guideMenu.appendChild( text.f.element );

			text.space.element.textContent = text.space.textContent;
			guideMenu.appendChild( text.space.element );

			this.stats.dom.style.position = 'relative';
			this.stats.dom.style.float = 'left';
			guideMenu.appendChild( this.stats.dom );

			this.guide = {
				element: guideMenu,
				guideText: text
			};
			this.currentScene.addGuideText( this.guide );

			// console.log( this.currentScene );

			if ( this.domElement ) {
				this.domElement.appendChild( guideMenu );
			} else {
				document.body.appendChild( guideMenu );
			}
		} else if ( this.currentScene.name === 'test scene' ) {

			this.stats.dom.style.position = 'fixed';
			this.stats.dom.style.zIndex = '999';
			this.stats.dom.style.top = '0';
			this.stats.dom.style.left = '0';
			this.stats.dom.style.margin = '5px';


			if ( this.domElement ) {
				this.domElement.appendChild( this.stats.dom );
			} else {
				document.body.appendChild( this.stats.dom );
			}
		}


	}

	prepareCanvas( inpElement ) {
		this.canvas = document.createElement( 'canvas' );
		this.canvas.id = 'canvas';

		if ( inpElement ) {
			this.canvas.width = inpElement.clientWidth;
			this.canvas.height = inpElement.clientHeight;
		} else {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		}
	}
}

export { GraphicCore };
