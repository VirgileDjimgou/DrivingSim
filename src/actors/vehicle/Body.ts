/**
 * Body class - Vehicle body with headlights
 * Main chassis of the vehicle with physics and lighting
 */
import { GObject } from '../GObject';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import type { IPhysicsWorld, Dimensions } from '../../types';

export class Body extends GObject {
  private initPos: CANNON.Vec3;
  private bodyMass: number;
  public headLights: {
    LF: THREE.SpotLight;
    RF: THREE.SpotLight;
  } | null = null;
  private headLightsFlare: {
    material: THREE.PointsMaterial;
    geometryLF: THREE.BufferGeometry;
    geometryRF: THREE.BufferGeometry;
    LF: THREE.Points;
    RF: THREE.Points;
  } | null = null;

  constructor(physWorld: IPhysicsWorld, dim: Dimensions, mass: number, initPos: CANNON.Vec3) {
    super(physWorld);
    this.dim = dim;
    this.initPos = initPos;
    this.bodyMass = mass;
    this.physicMeshMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
      side: THREE.DoubleSide
    });
    this.init();
  }

  /**
   * Initialize the body
   */
  public init(): void {
    this.createBody();
    this.graphic.physicMesh = this.createPhysicMesh();
    this.graphic.physicMesh.visible = false;
    (this.graphic.physicMesh as any).name = 'vehicleBody';
    this.add(this.graphic.physicMesh);
  }

  /**
   * Create the physics body
   */
  protected createBody(): void {
    const chassisShape = new CANNON.Box(
      new CANNON.Vec3(this.dim!.x / 2, this.dim!.y / 2, this.dim!.z / 2)
    );

    this.physicBody = new CANNON.Body({ mass: this.bodyMass });
    (this.physicBody as any).name = 'vehicle body';
    this.physicBody.addShape(chassisShape);
    this.physicBody.position.copy(this.initPos);
    
    // No initial rotation - vehicle starts upright
    // this.physicBody.quaternion is identity by default
    
    // No initial angular velocity
    this.physicBody.angularVelocity.set(0, 0, 0);
    
    console.log('Vehicle body created at position:', this.initPos);
  }

  /**
   * Create headlights
   */
  public createHeadlights(): void {
    this.headLights = {
      LF: new THREE.SpotLight(),
      RF: new THREE.SpotLight()
    };

    this.headLights.LF.name = 'lf';
    this.headLights.LF.target.name = 'lf_t';
    this.headLights.LF.intensity = 2;
    this.headLights.LF.penumbra = 0.24;
    this.headLights.LF.distance = 100;
    this.headLights.LF.angle = 1.1;
    this.headLights.LF.target.position.x = 100;
    this.headLights.LF.target.position.z = -21;

    this.headLights.RF.name = 'rf';
    this.headLights.RF.target.name = 'rf_t';
    this.headLights.RF.intensity = 2;
    this.headLights.RF.penumbra = 0.24;
    this.headLights.RF.distance = 100;
    this.headLights.RF.angle = 1.1;
    this.headLights.RF.target.position.x = 100;
    this.headLights.RF.target.position.z = -21;

    this.headLights.LF.visible = false;
    this.headLights.RF.visible = false;

    if (this.headLightsFlare) {
      this.headLights.LF.add(this.headLightsFlare.LF);
      this.headLights.RF.add(this.headLightsFlare.RF);
    }

    this.add(
      this.headLights.LF,
      this.headLights.LF.target,
      this.headLights.RF,
      this.headLights.RF.target
    );
  }

  /**
   * Create headlight flares
   */
  private createHeadlightsFlare(mapFlare: THREE.Texture): void {
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 50,
      blending: THREE.AdditiveBlending,
      transparent: true,
      map: mapFlare,
      fog: false
    });

    const geometryLF = new THREE.BufferGeometry();
    geometryLF.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([0.3 / 15, -0.5 / 15, -0.1 / 15], 3)
    );
    
    const geometryRF = new THREE.BufferGeometry();
    geometryRF.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([0.3 / 15, 0.5 / 15, -0.1 / 15], 3)
    );

    this.headLightsFlare = {
      material,
      geometryLF,
      geometryRF,
      LF: new THREE.Points(geometryLF, material),
      RF: new THREE.Points(geometryRF, material)
    };
  }

  /**
   * Helper for headlight steering
   */
  public headlightHelp(angle: number): void {
    if (this.headLights) {
      this.headLights.LF.target.position.y =
        this.headLights.LF.position.y + (angle > 0 ? Math.sin(angle) * 50 : 0);
      this.headLights.RF.target.position.y =
        this.headLights.RF.position.y + (angle <= 0 ? Math.sin(angle) * 50 : 0);
    }
  }

  /**
   * Add headlights flare texture
   */
  public addHeadlightsFlare(map: THREE.Texture): void {
    this.createHeadlightsFlare(map);
  }

  /**
   * Set light positions
   */
  public setLightsPositions(): void {
    const front = {
      x: 17.8 / 15,
      y: 5.53 / 15,
      z: -0.6 / 15
    };

    const rear = {
      x: -16.9 / 15,
      y: 4.3 / 15,
      z: 1 / 15
    };

    const flLight = this.foundMeshByName('f_l_light', this.children);
    const frLight = this.foundMeshByName('f_r_light', this.children);
    const rlLight = this.foundMeshByName('r_l_light', this.children);
    const rrLight = this.foundMeshByName('r_r_light', this.children);

    if (flLight) flLight.position.set(front.x, front.y, front.z);
    if (frLight) frLight.position.set(front.x, -front.y, front.z);
    if (rlLight) rlLight.position.set(rear.x, rear.y, rear.z);
    if (rrLight) rrLight.position.set(rear.x, -rear.y, rear.z);

    const lfSpotLight = this.foundMeshByName('lf', this.children);
    const rfSpotLight = this.foundMeshByName('rf', this.children);
    
    if (lfSpotLight && flLight) {
      lfSpotLight.position.set(
        flLight.position.x + 0.55 / 15,
        flLight.position.y,
        flLight.position.z
      );
    }
    if (rfSpotLight && frLight) {
      rfSpotLight.position.set(
        frLight.position.x + 0.55 / 15,
        frLight.position.y,
        frLight.position.z
      );
    }
  }
}
