/**
 * VehicleScene Class
 * Main 3D scene with camera, lights, ground, vehicle, and skybox
 */
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Vehicle } from '../../actors/vehicle/Vehicle';
import type { IPhysicsWorld } from '../../types';

export class VehicleScene {
  public name: string;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public controls: OrbitControls;
  public vehicle!: Vehicle;
  public assets: Map<string, any> | null;
  public fog!: THREE.Fog;
  
  private canvas: HTMLCanvasElement;
  private physicWorld: IPhysicsWorld;
  private timer: any;
  private sceneLight!: THREE.DirectionalLight;
  private hemiLight!: THREE.HemisphereLight;
  private settings: {
    sceneLightBias: number;
    controlsMaxDist: number;
    controlsMaxAngle: number;
  };
  private defBackground: THREE.Color;

  constructor(canvas: HTMLCanvasElement, physicWorld: IPhysicsWorld, timer?: any) {
    this.name = 'vehicle scene';
    this.canvas = canvas;
    this.physicWorld = physicWorld;
    this.timer = timer;
    this.assets = null;
    
    this.settings = {
      sceneLightBias: 0,
      controlsMaxDist: 25,
      controlsMaxAngle: Math.PI / 2
    };

    this.defBackground = new THREE.Color(0x87ceeb);
    
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = this.defBackground;

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );

    // Create controls
    this.controls = new OrbitControls(this.camera, this.canvas);
    
    this.init();
  }

  /**
   * Initialize scene
   */
  private init(): void {
    // Camera setup - positioned to look at vehicle from behind and above
    // Vehicle spawns at (0, 5, 0) - center of ground, well above surface
    this.camera.position.set(-8, 8, 8); // Behind and to the side, elevated more
    
    // Set camera to look at vehicle spawn position
    this.camera.lookAt(new THREE.Vector3(0, 5, 0));

    // OrbitControls setup
    this.controls.target.set(0, 5, 0); // Look at vehicle at new higher position
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1.7;
    this.controls.maxDistance = this.settings.controlsMaxDist;
    this.controls.maxPolarAngle = this.settings.controlsMaxAngle;

    // Fog
    const near = 0.5;
    const far = 150;
    const fogColor = 0x87ceeb; // Sky blue color
    this.fog = new THREE.Fog(fogColor, near, far);
    this.scene.fog = this.fog;

    // Lighting
    this.addSceneLight();

    // Create vehicle
    this.vehicle = new Vehicle(this.physicWorld, this.timer);

    // Create a simple flat ground instead of heightfield for now
    // This will be more reliable for physics
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x808080,
      roughness: 0.8,
      metalness: 0.2,
      side: THREE.DoubleSide
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    groundMesh.position.set(0, 0, 0);
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);
    
    // Create physics ground plane
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({
      mass: 0, // Static
      shape: groundShape,
      material: this.physicWorld.groundMaterial
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Rotate to be horizontal
    groundBody.position.set(0, 0, 0);
    this.physicWorld.world.addBody(groundBody);
    
    console.log('Simple flat ground created at Y=0');
    console.log('Ground body position:', groundBody.position);
    console.log('Ground body quaternion:', groundBody.quaternion);

    // Add vehicle components to scene
    this.scene.add(this.vehicle.body);
    this.scene.add(this.vehicle.wheels.LF);
    this.scene.add(this.vehicle.wheels.RF);
    this.scene.add(this.vehicle.wheels.LR);
    this.scene.add(this.vehicle.wheels.RR);

    console.log('VehicleScene initialized');
  }

  /**
   * Add scene lighting
   */
  private addSceneLight(): void {
    // Hemisphere light for ambient lighting
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    this.hemiLight.position.set(0, 20, 0);
    this.scene.add(this.hemiLight);

    // Directional light for shadows
    this.sceneLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.sceneLight.position.set(10, 20, 10);
    this.sceneLight.castShadow = true;
    
    // Shadow camera setup
    this.sceneLight.shadow.camera.top = 50;
    this.sceneLight.shadow.camera.bottom = -50;
    this.sceneLight.shadow.camera.left = -50;
    this.sceneLight.shadow.camera.right = 50;
    this.sceneLight.shadow.camera.near = 0.1;
    this.sceneLight.shadow.camera.far = 100;
    this.sceneLight.shadow.mapSize.width = 2048;
    this.sceneLight.shadow.mapSize.height = 2048;

    this.scene.add(this.sceneLight);
  }

  /**
   * Load all assets (called after asset loading complete)
   */
  public loadAllAssets(): void {
    if (!this.assets) return;

    // Load environment map (skybox)
    const envMap = this.assets.get('v1');
    if (envMap) {
      this.scene.background = envMap;
      this.scene.environment = envMap;
    }

    // Load vehicle GLTF model
    const vehicleGltf = this.assets.get('vehicleModel');
    if (vehicleGltf) {
      this.loadVehicleModel(vehicleGltf);
    }

    // Load ground texture
    // NOTE: In this scene we use a simple plane mesh created in init().
    // If you later switch to Ground actor(s), adapt this to apply maps to them.

    // Load vehicle texture map
    const vehicleMap = this.assets.get('vehicleMap');
    if (vehicleMap && this.vehicle) {
      this.vehicle.addMap(vehicleMap);
    }

    // Load headlight flare texture
    const headlightFlare = this.assets.get('headlightsFlare');
    if (headlightFlare) {
      // Provide the flare texture to the body so created SpotLights get flares
      this.vehicle.body.addHeadlightsFlare(headlightFlare);
    }

    console.log('All assets loaded to scene');
  }

  /**
   * Load vehicle 3D model from GLTF
   */
  private loadVehicleModel(gltf: any): void {
    const model = gltf.scene || gltf;

    const foundMeshByName = (name: string, source: THREE.Object3D[]): THREE.Object3D | undefined => {
      return source.find((obj) => obj.name === name);
    };

    const foundMaterialInGroupByName = (name: string, grp?: THREE.Object3D | null): THREE.Material | null => {
      if (!grp) return null;
      for (let i = 0; i < grp.children.length; i++) {
        const child: any = grp.children[i];
        if (child.isMesh && child.material && child.material.name === name) {
          return child.material as THREE.Material;
        }
      }
      return null;
    };

    console.log('Loading vehicle model... children:', model.children.map((c: any) => c.name));

    // Body and paint material
    const body = foundMeshByName('body', model.children);
    if (body) {
      const bodyMat = foundMaterialInGroupByName('testCarPaint', body);
      if (bodyMat && (bodyMat as any).isMaterial) {
        this.vehicle.materials.body = bodyMat as THREE.MeshStandardMaterial;
        // Align look closer to original defaults
        this.vehicle.materials.body.emissiveIntensity = 0;
        (this.vehicle.materials.body as any).envMapIntensity = 1.8;
        this.vehicle.materials.body.metalness = 0.9;
        this.vehicle.materials.body.roughness = 0.02;
        this.vehicle.materials.body.color.setHex(0x37af05);
      }
    }

    // Suspension/supports
    const suppRF = foundMeshByName('frSup', model.children) as THREE.Mesh;
    const suppLF = foundMeshByName('lfSup', model.children) as THREE.Mesh;
    const suppRR = foundMeshByName('rrSup', model.children) as THREE.Mesh;
    const suppLR = foundMeshByName('rlSup', model.children) as THREE.Mesh;

    const suppMatRF = foundMaterialInGroupByName('Material.001', suppRF) as THREE.MeshStandardMaterial | null;
    const suppMatLF = foundMaterialInGroupByName('Material.001', suppLF) as THREE.MeshStandardMaterial | null;
    const suppMatRR = foundMaterialInGroupByName('Material.001', suppRR) as THREE.MeshStandardMaterial | null;
    const suppMatLR = foundMaterialInGroupByName('Material.001', suppLR) as THREE.MeshStandardMaterial | null;

    if (suppMatRF && suppMatLF && suppMatRR && suppMatLR) {
      this.vehicle.materials.supports.RF = suppMatRF;
      this.vehicle.materials.supports.LF = suppMatLF;
      this.vehicle.materials.supports.RR = suppMatRR;
      this.vehicle.materials.supports.LR = suppMatLR;
      (suppMatRF as any).envMapIntensity = 1.4;
      (suppMatLF as any).envMapIntensity = 1.4;
      (suppMatRR as any).envMapIntensity = 1.4;
      (suppMatLR as any).envMapIntensity = 1.4;
    }

    // Lights groups and materials
    const lightLF = foundMeshByName('f_l_light', model.children);
    const lightRF = foundMeshByName('f_r_light', model.children);
    const lightRR = foundMeshByName('r_r_light', model.children);
    const lightLR = foundMeshByName('r_l_light', model.children);

    const matLightRF = foundMaterialInGroupByName('righTurnLight', lightRF) as THREE.MeshStandardMaterial | null;
    const matLightLF = foundMaterialInGroupByName('leftTurnLight', lightLF) as THREE.MeshStandardMaterial | null;
    if (matLightLF && matLightRF) {
      matLightLF.emissive.setHex(0x000000);
      matLightRF.emissive.setHex(0x000000);
      this.vehicle.materials.lights.LF = matLightLF;
      this.vehicle.materials.lights.RF = matLightRF;
    }

    const matLightRR = foundMaterialInGroupByName('REAR TAIL LIGHT.002', lightRR) as THREE.MeshStandardMaterial | null;
    const matLightLR = foundMaterialInGroupByName('REAR TAIL LIGHT.002', lightLR) as THREE.MeshStandardMaterial | null;
    const turnLeftRear = foundMaterialInGroupByName('leftReverseLight', lightLR) as THREE.MeshStandardMaterial | null;
    const turnRightRear = foundMaterialInGroupByName('rightReverseLight', lightRR) as THREE.MeshStandardMaterial | null;
    if (turnLeftRear && turnRightRear) {
      this.vehicle.materials.lights.rearTurns.L = turnLeftRear;
      this.vehicle.materials.lights.rearTurns.R = turnRightRear;
    }
    if (matLightLR && matLightRR) {
      matLightLR.emissive.r = 0.35;
      matLightRR.emissive.r = 0.35;
      this.vehicle.materials.lights.LR = matLightLR;
      this.vehicle.materials.lights.RR = matLightRR;
    }

    // Mount body parts and supports on the chassis group
    const partsToAdd: THREE.Object3D[] = [];
    if (body) partsToAdd.push(body);
    if (lightLF) partsToAdd.push(lightLF);
    if (lightLR) partsToAdd.push(lightLR);
    if (lightRR) partsToAdd.push(lightRR);
    if (lightRF) partsToAdd.push(lightRF);
    if (suppRF) partsToAdd.push(suppRF);
    if (suppLF) partsToAdd.push(suppLF);
    if (suppRR) partsToAdd.push(suppRR);
    if (suppLR) partsToAdd.push(suppLR);
    if (partsToAdd.length) {
      (this.vehicle.body as any).add(...partsToAdd);
    }

    // Create headlights and set positions relative to light meshes
    this.vehicle.body.createHeadlights();
    this.vehicle.body.setLightsPositions();

    // Attach wheels visuals to the corresponding wheel objects
    const wRR = foundMeshByName('r_r_wheel', model.children);
    const wRF = foundMeshByName('f_r_wheel', model.children);
    const wLR = foundMeshByName('r_l_wheel', model.children);
    const wLF = foundMeshByName('f_l_wheel', model.children);
  if (wRR) (this.vehicle.wheels.RR as any).add(wRR);
  if (wRF) (this.vehicle.wheels.RF as any).add(wRF);
  if (wLR) (this.vehicle.wheels.LR as any).add(wLR);
  if (wLF) (this.vehicle.wheels.LF as any).add(wLF);

    // Extract materials from wheel groups
  const wheel_RR = wRR ? foundMeshByName('r_r_wheel', (this.vehicle.wheels.RR as any).children) : undefined;
  const wheel_RF = wRF ? foundMeshByName('f_r_wheel', (this.vehicle.wheels.RF as any).children) : undefined;
  const wheel_LR = wLR ? foundMeshByName('r_l_wheel', (this.vehicle.wheels.LR as any).children) : undefined;
  const wheel_LF = wLF ? foundMeshByName('f_l_wheel', (this.vehicle.wheels.LF as any).children) : undefined;

    const carbonDiskLF = foundMaterialInGroupByName('carbon disk brake', wheel_LF) as THREE.MeshStandardMaterial | null;
    const carbonDiskRF = foundMaterialInGroupByName('carbon disk brake', wheel_RF) as THREE.MeshStandardMaterial | null;
    const carbonDiskLR = foundMaterialInGroupByName('carbon disk brake', wheel_LR) as THREE.MeshStandardMaterial | null;
    const carbonDiskRR = foundMaterialInGroupByName('carbon disk brake', wheel_RR) as THREE.MeshStandardMaterial | null;
    if (carbonDiskLF) (carbonDiskLF as any).envMapIntensity = 0.5;
    if (carbonDiskRF) (carbonDiskRF as any).envMapIntensity = 0.5;
    if (carbonDiskLR) (carbonDiskLR as any).envMapIntensity = 0.5;
    if (carbonDiskRR) (carbonDiskRR as any).envMapIntensity = 0.5;

    this.vehicle.materials.rim.LF = foundMaterialInGroupByName('frontDisk', wheel_LF) as THREE.MeshStandardMaterial | null;
    this.vehicle.materials.rim.RF = foundMaterialInGroupByName('frontDisk', wheel_RF) as THREE.MeshStandardMaterial | null;
    this.vehicle.materials.rim.LR = foundMaterialInGroupByName('frontDisk', wheel_LR) as THREE.MeshStandardMaterial | null;
    this.vehicle.materials.rim.RR = foundMaterialInGroupByName('frontDisk', wheel_RR) as THREE.MeshStandardMaterial | null;

    const rims = [this.vehicle.materials.rim.LF, this.vehicle.materials.rim.RF, this.vehicle.materials.rim.LR, this.vehicle.materials.rim.RR];
    rims.forEach((r) => {
      if (r) {
        (r as any).emissiveIntensity = 0;
        r.metalness = 0.8;
        r.roughness = 0.45;
        (r as any).envMapIntensity = 1.1;
      }
    });

    const tireLF = foundMaterialInGroupByName('tire', wheel_LF) as THREE.MeshStandardMaterial | null;
    const tireRF = foundMaterialInGroupByName('tire', wheel_RF) as THREE.MeshStandardMaterial | null;
    const tireLR = foundMaterialInGroupByName('tire', wheel_LR) as THREE.MeshStandardMaterial | null;
    const tireRR = foundMaterialInGroupByName('tire', wheel_RR) as THREE.MeshStandardMaterial | null;
    const tireColor = 0x181818;
    [tireLF, tireRF, tireLR, tireRR].forEach((t) => {
      if (t) {
        t.color.setHex(tireColor);
        t.metalness = 1;
        t.roughness = 0.65;
      }
    });

    // Hide physics wireframe, now that visuals are attached
  const physicMesh = (this.vehicle.body as any).children.find((child: any) => child.name === 'vehicleBody');
    if (physicMesh) {
      physicMesh.visible = false;
      console.log('Physics wireframe mesh hidden');
    }
  }

  /**
   * Add assets during loading (progress callback)
   */
  public addAssets(data: { value: number }): void {
    // Handle loading progress
    console.log(`Scene loading: ${Math.round(data.value * 100)}%`);
  }

  /**
   * Update scene each frame
   */
  public update(_fi: number): void {
    // Update controls (important for mouse interaction)
    this.controls.update();

    // Update vehicle physics and graphics
    if (this.vehicle) {
      this.vehicle.update();
    }

    // Only update camera target and light if vehicle is stable (not falling)
    // This allows free camera movement initially
    if (this.vehicle && (this.vehicle.body as any).position.y > -10) {
      const vehiclePos = (this.vehicle.body as any).position as THREE.Vector3;
      
      // Update scene light to follow vehicle
      if (this.sceneLight) {
        this.sceneLight.position.set(
          vehiclePos.x + 10,
          vehiclePos.y + 20,
          vehiclePos.z + 10
        );
        this.sceneLight.target.position.copy(vehiclePos);
        this.sceneLight.target.updateMatrixWorld();
      }
      
      // Optionally follow vehicle with camera (commented out for free camera control)
      // Uncomment the lines below to make camera follow the vehicle
      // if (this.controls) {
      //   this.controls.target.set(vehiclePos.x, vehiclePos.y, vehiclePos.z);
      // }
    }
  }

  /**
   * Handle window resize
   */
  public resizeAction(): void {
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  /**
   * Change scene background color
   */
  public changeSceneBackground(colorHex: number): void {
    this.scene.background = new THREE.Color(colorHex);
    if (this.fog) {
      this.fog.color.setHex(colorHex);
    }
  }

  /**
   * Change scene light intensity
   */
  public changeSceneLightIntensity(intensity: number): void {
    this.sceneLight.intensity = intensity;
  }

  /**
   * Change scene light color
   */
  public changeSceneLightColor(colorHex: number): void {
    this.sceneLight.color.setHex(colorHex);
  }
}
