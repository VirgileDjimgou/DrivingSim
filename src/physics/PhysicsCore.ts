/**
 * PhysicsCore - Manages the Cannon-ES physics simulation
 * Handles physics world initialization, updates, and configuration
 */
import * as CANNON from 'cannon-es';
import { VehicleWorld } from './VehicleWorld';

export class PhysicsCore {
  private worldFrequency: number = 60;
  private isPaused: boolean = false;
  private dT: number = 1 / 60;
  private maxSubSteps: number = 2;
  private world: CANNON.World;
  private currentWorld: VehicleWorld | null = null;
  private name: string = 'cannon-es app';

  constructor() {
    this.world = new CANNON.World();
  }

  /**
   * Initialize the physics world
   */
  public init(): void {
    this.currentWorld = new VehicleWorld(this.world);
    console.log('CANNON-ES: done init');
  }

  /**
   * Pre-start the physics simulation
   */
  public preStart(): void {
    console.log('CANNON-ES: done prestart');
    this.isPaused = false;
    if (this.currentWorld) {
      this.currentWorld.isPaused = false;
    }
    this.resetWorld();
    this.calculateDt();
    this.world.time = 0;
  }

  /**
   * Post-start cleanup
   */
  public postStart(): void {
    this.resetWorld();
    this.isPaused = true;
    if (this.currentWorld) {
      this.currentWorld.isPaused = true;
    }
    this.dT = 0;
  }

  /**
   * Set the physics world frequency (Hz)
   */
  public setWorldFreq(value: number): void {
    this.worldFrequency = value;
    this.calculateDt();
  }

  /**
   * Calculate delta time based on frequency
   */
  private calculateDt(): void {
    this.dT = 1 / this.worldFrequency;
  }

  /**
   * Reset world forces
   */
  private resetWorld(): void {
    this.world.clearForces();
  }

  /**
   * Start the physics simulation
   */
  public run(): void {
    this.preStart();
  }

  /**
   * Stop the physics simulation
   */
  public stop(): void {
    this.postStart();
  }

  /**
   * Update the physics simulation
   * @param timeSinceLastCall - Time since last update in seconds
   */
  public update(timeSinceLastCall: number): void {
    if (this.currentWorld) {
      this.currentWorld.update();
    }
    this.world.step(this.dT, timeSinceLastCall, this.maxSubSteps);
  }

  /**
   * Get the Cannon world instance
   */
  public getWorld(): CANNON.World {
    return this.world;
  }

  /**
   * Get the current vehicle world
   */
  public getCurrentWorld(): VehicleWorld | null {
    return this.currentWorld;
  }

  /**
   * Get the world frequency
   */
  public getWorldFrequency(): number {
    return this.worldFrequency;
  }

  /**
   * Check if physics is paused
   */
  public getIsPaused(): boolean {
    return this.isPaused;
  }
}
