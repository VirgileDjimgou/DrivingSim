import { Film } from '../../cores/Film';
import { GraphicCore } from './graphic/GraphicCore';
import { UIController } from './graphic/scenes/UIController';
import { PhysicCore } from './physic/PhysicCore';


class VehicleFilm extends Film {
	constructor( display, resources ) {
		super( 'cf' );
		this.ui = new UIController( this );
		this.cores.graphic = new GraphicCore( display, resources, this.ui, this.stats );
		this.cores.physic = new PhysicCore();
		window.addEventListener( 'keydown', ( event ) => {
			this.handler( event );
		} );
		window.addEventListener( 'keyup', ( event ) => {
			this.handler( event );
		} );
	}

	handler( event ) {

		let keyUp = ( event.type === 'keyup' );


		switch( event.code ) {
		case 'KeyV':
			if ( keyUp ) {
				this.ui.changeVisibleGUI();
			}

			break;
		case 'KeyL':
			if ( keyUp ) {
				this.cores.graphic.currentScene.vehicle.changeBodyHeadlightsVisible();
			}

			break;
		case 'KeyP':
			if ( keyUp ) {
				console.log( this.cores.graphic.currentScene.camera.position );
			}

			break;
		default:
		}

		this.cores.graphic.currentScene.vehicle.handler( event );

	}
}
export { VehicleFilm };
