/**
 * Film class - Coordinates graphics and physics cores
 * Manages the synchronization between rendering and physics simulation
 */
import { Core } from './Core';
import type { GraphicsCore } from '../graphics/GraphicsCore';
import type { PhysicsCore } from '../physics/PhysicsCore';
import * as THREE from 'three';

export abstract class Film extends Core {
  protected cores: {
    graphics: GraphicsCore | null;
    physics: PhysicsCore | null;
  };
  protected threeClock: THREE.Clock;
  protected dt: number = 0;

  constructor(name: string) {
    super(name);
    this.cores = {
      graphics: null,
      physics: null
    };
    this.threeClock = new THREE.Clock();
  }

  /**
   * Initialize both graphics and physics cores
   */
  public init(): void {
    if (this.cores.physics) {
      this.cores.physics.init();
    }
    if (this.cores.graphics) {
      this.cores.graphics.setPhysicsWorld(this.cores.physics);
      this.cores.graphics.init();
    }
  }

  /**
   * Pre-start both cores and start the clock
   */
  public preStart(): void {
    this.threeClock.start();
    if (this.cores.physics) {
      this.cores.physics.preStart();
    }
    if (this.cores.graphics) {
      this.cores.graphics.preStart();
    }
    console.log('Film: done prestart');
  }

  /**
   * Update both cores with delta time
   */
  public update(): void {
    this.dt = this.threeClock.getDelta();

    if (this.cores.physics) {
      this.cores.physics.update(this.dt);
    }
    if (this.cores.graphics) {
      this.cores.graphics.update(this.dt);
    }
  }

  /**
   * Post-start cleanup for both cores
   */
  public postStart(): void {
    this.threeClock.stop();

    if (this.cores.physics) {
      this.cores.physics.postStart();
    }
    if (this.cores.graphics) {
      this.cores.graphics.postStart();
    }
  }

  /**
   * Get the graphics core instance
   */
  public getGraphicsCore(): GraphicsCore | null {
    return this.cores.graphics;
  }

  /**
   * Get the physics core instance
   */
  public getPhysicsCore(): PhysicsCore | null {
    return this.cores.physics;
  }
}
