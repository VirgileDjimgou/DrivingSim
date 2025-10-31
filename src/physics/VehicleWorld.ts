/**
 * VehicleWorld - Physics world configuration for vehicle simulation
 * Sets up materials, contact properties, and gravity
 */
import * as CANNON from 'cannon-es';
import type { IPhysicsWorld } from '../types';

export class VehicleWorld implements IPhysicsWorld {
  public world: CANNON.World;
  public groundMaterial: CANNON.Material;
  public wheelMaterial: CANNON.Material;
  public isPaused: boolean = false;
  private groundWheelContactMaterial: CANNON.ContactMaterial;

  constructor(world: CANNON.World) {
    this.world = world;
    
    // Initialize materials
    this.groundMaterial = new CANNON.Material('groundMaterial');
    this.wheelMaterial = new CANNON.Material('wheelMaterial');
    
    // Create contact material (will be initialized in init)
    this.groundWheelContactMaterial = new CANNON.ContactMaterial(
      this.wheelMaterial,
      this.groundMaterial,
      {
        friction: 10,
        restitution: 0.3,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
        frictionEquationStiffness: 1e8
      }
    );
    
    this.init();
  }

  /**
   * Initialize the physics world settings
   */
  private init(): void {
    // Set gravity
    this.world.gravity.set(0, -9.81, 0);
    
    // Set broadphase algorithm
    this.world.broadphase = new CANNON.NaiveBroadphase();
    
    // Set solver iterations
    this.world.solver.iterations = 10;
    
    // Add contact materials
    this.addContactMaterials();
  }

  /**
   * Add contact materials for wheel-ground interaction
   */
  private addContactMaterials(): void {
    // Set default friction to 0
    this.world.defaultContactMaterial.friction = 0;
    
    // Set material properties
    this.groundMaterial.friction = 10;
    this.wheelMaterial.friction = 10;
    
    // Add the contact material to the world
    this.world.addContactMaterial(this.groundWheelContactMaterial);
  }

  /**
   * Update method (can be used for custom physics updates)
   */
  public update(): void {
    // Custom physics world updates can be added here
  }

  /**
   * Get the ground material
   */
  public getGroundMaterial(): CANNON.Material {
    return this.groundMaterial;
  }

  /**
   * Get the wheel material
   */
  public getWheelMaterial(): CANNON.Material {
    return this.wheelMaterial;
  }
}
