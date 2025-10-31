/**
 * UIController Class
 * dat.GUI interface for real-time control of simulation parameters
 */
import * as dat from 'dat.gui';
import type { VehicleScene } from './VehicleScene';

export class UIController {
  private gui: dat.GUI;
  private scene: VehicleScene | null;
  private visible: boolean;

  constructor() {
    this.gui = new dat.GUI();
    this.scene = null;
    this.visible = true;
    
    // Hide GUI initially
    this.gui.domElement.style.display = 'none';
  }

  /**
   * Initialize GUI with scene reference
   */
  public init(scene: VehicleScene): void {
    this.scene = scene;
    this.setupGUI();
    // Show GUI after initialization
    this.gui.domElement.style.display = 'block';
  }

  /**
   * Setup all GUI folders and controls
   */
  private setupGUI(): void {
    if (!this.scene) return;

    // Scene folder
    const sceneFolder = this.gui.addFolder('Scene');
    const sceneSettings = {
      backgroundColor: '#87ceeb',
      lightIntensity: 0.8,
      lightColor: '#ffffff',
      fogNear: 0.5,
      fogFar: 150
    };
    
    sceneFolder.addColor(sceneSettings, 'backgroundColor').onChange((value: string) => {
      this.scene?.changeSceneBackground(parseInt(value.replace('#', ''), 16));
    });
    
    sceneFolder.add(sceneSettings, 'lightIntensity', 0, 2).onChange((value: number) => {
      this.scene?.changeSceneLightIntensity(value);
    });
    
    sceneFolder.addColor(sceneSettings, 'lightColor').onChange((value: string) => {
      this.scene?.changeSceneLightColor(parseInt(value.replace('#', ''), 16));
    });

    // Vehicle folder
    if (this.scene.vehicle) {
      const vehicleFolder = this.gui.addFolder('Vehicle');
      const vehicle = this.scene.vehicle;
      
      const vehicleSettings = {
        maxEngineForce: vehicle.settings.maxEngineForce,
        maxBrakeForce: vehicle.settings.maxBrakeForce,
        frictionSlip: 7,
        driveType: 'Full',
        headlights: false
      };

      vehicleFolder.add(vehicleSettings, 'maxEngineForce', 100, 1000).onChange((value: number) => {
        vehicle.changeMaxEngineForce(value);
      });

      vehicleFolder.add(vehicleSettings, 'maxBrakeForce', 10, 200).onChange((value: number) => {
        vehicle.changeMaxBrakeForce(value);
      });

      vehicleFolder.add(vehicleSettings, 'frictionSlip', 0, 20).onChange((value: number) => {
        vehicle.changeFrictionSlip(value);
      });

      vehicleFolder.add(vehicleSettings, 'driveType', ['Front', 'Rear', 'Full']).onChange((value: string) => {
        vehicle.changeTypeDrive(value);
      });

      vehicleFolder.add(vehicleSettings, 'headlights').onChange((value: boolean) => {
        vehicle.changeBodyHeadlightsVisible(value);
      });

      // Suspension folder
      const suspensionFolder = vehicleFolder.addFolder('Suspension');
      const suspensionSettings = {
        clearance: 0,
        compression: 5,
        relaxation: 5
      };

      suspensionFolder.add(suspensionSettings, 'clearance', -0.1, 0.1, 0.01).onChange((value: number) => {
        vehicle.changeClearance(value);
      });

      suspensionFolder.add(suspensionSettings, 'compression', 1, 20).onChange((value: number) => {
        vehicle.changeCompression(value);
      });

      suspensionFolder.add(suspensionSettings, 'relaxation', 1, 20).onChange((value: number) => {
        vehicle.changeRelaxation(value);
      });
    }
  }

  /**
   * Toggle GUI visibility
   */
  public changeVisibleGUI(): void {
    this.visible = !this.visible;
    this.gui.domElement.style.display = this.visible ? 'block' : 'none';
  }

  /**
   * Show GUI
   */
  public show(): void {
    this.visible = true;
    this.gui.domElement.style.display = 'block';
  }

  /**
   * Hide GUI
   */
  public hide(): void {
    this.visible = false;
    this.gui.domElement.style.display = 'none';
  }
}
