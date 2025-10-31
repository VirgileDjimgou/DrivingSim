/**
 * VehicleFilm Class
 * Main coordinator for the vehicle simulation, extending Film base class
 * Manages graphics core, physics core, and keyboard event handling
 */
import { Film } from '../core/Film';
import { GraphicsCore } from './GraphicsCore';
import { PhysicsCore } from '../physics/PhysicsCore';
import { VehicleScene } from './scenes/VehicleScene';
import { UIController } from './scenes/UIController';
import type { AssetConfig } from '../types';

export class VehicleFilm extends Film {
  private ui: UIController;

  constructor(display: HTMLElement, resources: AssetConfig[]) {
    super('VehicleFilm');
    
    // Initialize UI controller
    this.ui = new UIController();
    
    // Initialize cores
    this.cores.physics = new PhysicsCore();
    this.cores.graphics = new GraphicsCore(display, resources);
    
    // Setup keyboard event handlers
    window.addEventListener('keydown', (event) => {
      this.handleKeyEvent(event);
    });
    
    window.addEventListener('keyup', (event) => {
      this.handleKeyEvent(event);
    });
  }

  /**
   * Initialize film (called by App)
   */
  public init(): void {
    // Initialize physics first
    if (this.cores.physics) {
      this.cores.physics.init();
    }
    
    // Initialize graphics
    if (this.cores.graphics) {
      this.cores.graphics.init();
    }
    
    // Create vehicle scene
    if (this.cores.graphics && this.cores.physics) {
      const canvas = this.cores.graphics.canvas;
      const vehicleWorld = this.cores.physics.getCurrentWorld();
      
      if (!vehicleWorld) {
        console.error('VehicleWorld not initialized!');
        return;
      }
      
      const vehicleScene = new VehicleScene(
        canvas,
        vehicleWorld,
        this.cores.graphics.timer
      );
      
      this.cores.graphics.currentScene = vehicleScene;
      this.cores.graphics.getPhysicWorld(this.cores.physics.getWorld());
      
      // Store reference to UI and scene for later initialization
      (this.cores.graphics as any).uiController = this.ui;
      (this.cores.graphics as any).vehicleSceneRef = vehicleScene;
    }
    
    console.log('VehicleFilm initialized');
  }

  /**
   * Stop the simulation
   */
  public stop(): void {
    super.stop();
  }

  /**
   * Handle keyboard events
   */
  private handleKeyEvent(event: KeyboardEvent): void {
    const keyUp = event.type === 'keyup';
    const graphicsCore = this.getGraphicsCore();
    const scene = graphicsCore?.currentScene as VehicleScene;

    switch (event.code) {
      case 'KeyV': // Toggle UI visibility
        if (keyUp) {
          this.ui.changeVisibleGUI();
        }
        break;

      case 'KeyL': // Toggle headlights
        if (keyUp && scene?.vehicle) {
          scene.vehicle.changeBodyHeadlightsVisible();
        }
        break;

      case 'KeyP': // Print camera position (debug)
        if (keyUp && scene?.camera) {
          console.log('Camera position:', scene.camera.position);
        }
        break;

      default:
        // Pass all other keys to vehicle handler
        if (scene?.vehicle) {
          scene.vehicle.handler(event);
        }
        break;
    }
  }
}
