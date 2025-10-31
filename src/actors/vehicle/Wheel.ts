/**
 * Wheel class - Represents a vehicle wheel with physics
 * Integrates with Cannon-ES RaycastVehicle system
 */
import { GObject } from '../GObject';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import type { IPhysicsWorld, Dimensions, WheelPosition } from '../../types';

export class Wheel extends GObject {
  public name: WheelPosition;
  private dim: Dimensions;
  private mass: number;
  public raycastVehicleWheel: any = null;

  constructor(physWorld: IPhysicsWorld, dim: Dimensions, mass: number, name: WheelPosition) {
    super(physWorld);
    this.name = name;
    this.dim = dim;
    this.mass = mass;
    this.physicMeshMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      wireframe: true,
      side: THREE.DoubleSide
    });
    this.init();
  }

  /**
   * Initialize the wheel
   */
  public init(): void {
    this.createBody();
    this.graphic.physicMesh = this.createPhysicMesh();
    this.graphic.physicMesh.visible = false;
    this.addToPhysicWorld(this.physicBody!);
    this.add(this.graphic.physicMesh);
  }

  /**
   * Update body info from raycast vehicle wheel
   */
  public updateBodyInfo(): void {
    if (this.raycastVehicleWheel && this.physicBody) {
      this.physicBody.position.copy(this.raycastVehicleWheel.worldTransform.position);
      this.physicBody.quaternion.copy(this.raycastVehicleWheel.worldTransform.quaternion);
    }
  }

  /**
   * Create the physics body (cylinder shape)
   */
  protected createBody(): void {
    const cylinderShape = new CANNON.Cylinder(
      this.dim.x / 2,
      this.dim.x / 2,
      this.dim.y,
      24
    );
    
    cylinderShape.material = this.physicWorld.wheelMaterial;
    
    // Store draw data for mesh creation
    (cylinderShape as any).drawData = {
      radius: this.dim.x / 2,
      height: this.dim.y,
      segments: 24
    };

    this.physicBody = new CANNON.Body({
      mass: this.mass,
      material: this.physicWorld.wheelMaterial,
      type: CANNON.Body.KINEMATIC,
      collisionFilterGroup: 0
    });

    (this.physicBody as any).name = `${this.name} wheel`;
    this.physicBody.renderOrder = 2;

    const q1 = new CANNON.Quaternion();
    q1.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
    this.physicBody.addShape(cylinderShape, new CANNON.Vec3(), q1);
  }
}
