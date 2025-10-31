/**
 * App Class
 * Top-level application manager for DrivingSim
 * Initializes and controls the VehicleFilm simulation
 */
import { VehicleFilm } from './graphics/VehicleFilm';
import type { AssetConfig } from './types';

export class App {
  public name: string;
  private currentFilm: VehicleFilm;

  constructor(display: HTMLElement, resources: AssetConfig[]) {
    this.name = 'DrivingSim Manager';
    this.currentFilm = new VehicleFilm(display, resources);
    this.init();
  }

  /**
   * Initialize the application
   */
  private init(): void {
    console.log(`${this.name}: Initializing...`);
    this.currentFilm.init();
  }

  /**
   * Start the simulation
   */
  public action(): void {
    console.log(`${this.name}: Starting simulation...`);
    this.currentFilm.run();
  }

  /**
   * Stop the simulation
   */
  public stop(): void {
    console.log(`${this.name}: Stopping simulation...`);
    this.currentFilm.stop();
  }

  /**
   * Greeting message
   */
  public greeting(): void {
    console.log(`Hi! I am ${this.name}. Welcome to DrivingSim!`);
  }
}
