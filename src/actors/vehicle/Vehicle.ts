/**
 * Vehicle Class
 * Complete vehicle implementation with RaycastVehicle physics, keyboard controls,
 * turn signals, brake lights, and all vehicle dynamics
 */
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { Body } from './Body';
import { Wheel } from './Wheel';
import type { IPhysicsWorld, Dimensions, VehicleSettings, VehicleMaterials, TimerPulse } from '../../types';

export class Vehicle {
  public physicWorld: IPhysicsWorld;
  public timer: any;
  public raycastVehicle!: CANNON.RaycastVehicle;
  public body!: Body;
  public wheels!: {
    LF: Wheel;
    RF: Wheel;
    LR: Wheel;
    RR: Wheel;
  };
  public materials: VehicleMaterials;
  public settings: VehicleSettings;
  public supports: {
    LF: THREE.Mesh | null;
    RF: THREE.Mesh | null;
    LR: THREE.Mesh | null;
    RR: THREE.Mesh | null;
  };

  private initPosition: CANNON.Vec3;
  private bodyMass: number;
  private wheelMass: number;
  private mainDim: {
    body: Dimensions;
    wheel: Dimensions;
    scaleOriginal: number;
  };
  private connectionPointsWheels: {
    LF: CANNON.Vec3;
    RF: CANNON.Vec3;
    LR: CANNON.Vec3;
    RR: CANNON.Vec3;
  };
  private wheelOptions: CANNON.IWheelInfoOptions;
  private dim!: { body: Dimensions; wheel: Dimensions };

  constructor(physicWorld: IPhysicsWorld, timer?: any) {
    this.physicWorld = physicWorld;
    this.timer = timer;
    // Position vehicle at origin, 2 units above ground (ground is at Y=-2)
    this.initPosition = new CANNON.Vec3(0, 2, 0);
    this.bodyMass = 2000;
    this.wheelMass = 20;

    this.mainDim = {
      body: { x: 2.69, y: 1.1, z: 0.71 },
      wheel: { x: 0.366, y: 0.157, z: 0.366 },
      scaleOriginal: 1
    };

    this.materials = {
      body: null,
      rim: { LF: null, RF: null, LR: null, RR: null },
      lights: {
        LF: null,
        RF: null,
        LR: null,
        RR: null,
        rearTurns: { L: null, R: null }
      },
      supports: { LF: null, RF: null, LR: null, RR: null }
    };

    this.settings = {
      maxEngineForce: 500,
      maxBrakeForce: 50,
      speedControll: {
        active: false,
        refSpeed: 0,
        force: 0
      },
      steering: {
        angle: 0,
        stw: 0,
        fix: false
      },
      typeDrive: {
        front: false,
        rear: false,
        full: true
      },
      turnLightsHelper: {
        operation: 0,
        mainOperation: 0,
        turnColor: new THREE.Color(0xFF6C00),
        turnEmmisive: new THREE.Color(0xFF0000),
        defColor: new THREE.Color(0x000000),
        defEmissive: new THREE.Color(0x000000),
        defColorRear: new THREE.Color(0x000000),
        defEmissiveRear: new THREE.Color(0x000000)
      }
    };

    this.connectionPointsWheels = {
      LF: new CANNON.Vec3(0.9066, 0.46, -0.20),
      RF: new CANNON.Vec3(0.9066, -0.46, -0.20),
      LR: new CANNON.Vec3(-0.667, 0.4466, -0.22),
      RR: new CANNON.Vec3(-0.667, -0.4466, -0.22)
    };

    this.supports = {
      LF: null,
      RF: null,
      LR: null,
      RR: null
    };

    this.wheelOptions = {
      radius: 0,
      directionLocal: new CANNON.Vec3(0, 0, -1),
      suspensionStiffness: 30,
      suspensionRestLength: 0.1,
      frictionSlip: 7,
      dampingRelaxation: 5,
      dampingCompression: 5,
      maxSuspensionForce: 100000,
      rollInfluence: 0.01,
      axleLocal: new CANNON.Vec3(0, 1, 0),
      chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
      maxSuspensionTravel: 0.12,
      customSlidingRotationalSpeed: -40,
      useCustomSlidingRotationalSpeed: true
    };

    this.init();
  }

  /**
   * Initialize vehicle components
   */
  private init(): void {
    this.dim = this.calculateRealDim();
    this.body = new Body(this.physicWorld, this.dim.body, this.bodyMass, this.initPosition);
    
    this.wheels = {
      LF: new Wheel(this.physicWorld, this.dim.wheel, this.wheelMass, 'LF'),
      RF: new Wheel(this.physicWorld, this.dim.wheel, this.wheelMass, 'RF'),
      LR: new Wheel(this.physicWorld, this.dim.wheel, this.wheelMass, 'LR'),
      RR: new Wheel(this.physicWorld, this.dim.wheel, this.wheelMass, 'RR')
    };

    this.wheelOptions.radius = this.dim.wheel.x / 2;
    this.createRaycastVehicle();
  }

  /**
   * Create RaycastVehicle and attach wheels
   */
  private createRaycastVehicle(): void {
    this.raycastVehicle = new CANNON.RaycastVehicle({
      chassisBody: this.body.physicBody
    });

    // Add all four wheels
    this.wheelOptions.chassisConnectionPointLocal.copy(this.connectionPointsWheels.LF);
    this.raycastVehicle.addWheel(this.wheelOptions);

    this.wheelOptions.chassisConnectionPointLocal.copy(this.connectionPointsWheels.RF);
    this.raycastVehicle.addWheel(this.wheelOptions);

    this.wheelOptions.chassisConnectionPointLocal.copy(this.connectionPointsWheels.LR);
    this.raycastVehicle.addWheel(this.wheelOptions);

    this.wheelOptions.chassisConnectionPointLocal.copy(this.connectionPointsWheels.RR);
    this.raycastVehicle.addWheel(this.wheelOptions);

    // Link wheels to raycast vehicle
    this.wheels.LF.raycastVehicleWheel = this.raycastVehicle.wheelInfos[0];
    this.wheels.RF.raycastVehicleWheel = this.raycastVehicle.wheelInfos[1];
    this.wheels.LR.raycastVehicleWheel = this.raycastVehicle.wheelInfos[2];
    this.wheels.RR.raycastVehicleWheel = this.raycastVehicle.wheelInfos[3];

    this.raycastVehicle.addToWorld(this.physicWorld.world);
  }

  /**
   * Handle keyboard events
   */
  public handler(event: KeyboardEvent): void {
    const keyUp = event.type === 'keyup';

    switch (event.code) {
      case 'KeyW': // Accelerate forward
        if (this.settings.speedControll.active) {
          this.settings.speedControll.refSpeed += 1;
        } else {
          this.setEngineForce(keyUp ? 0 : -this.settings.maxEngineForce);
        }
        break;

      case 'KeyS': // Brake / Reverse
        if (this.settings.speedControll.active) {
          this.settings.speedControll.refSpeed -= 1;
        } else if (keyUp) {
          this.relaxBrake();
          this.setEngineForce(0);
        } else if (this.raycastVehicle.currentVehicleSpeedKmHour > 1) {
          this.setBrakeForce(this.settings.maxBrakeForce);
        } else {
          if (this.raycastVehicle.wheelInfos[0].brake > 0) {
            this.relaxBrake();
          }
          this.setEngineForce(this.settings.maxEngineForce / 1.3);
        }
        break;

      case 'KeyA': // Steer left
        if (keyUp) {
          this.settings.steering.angle = 0;
        } else if (this.settings.steering.angle < 0.55) {
          if (this.settings.steering.fix) {
            this.settings.steering.fix = false;
          }
          this.setSteeringAngle(0.1);
        } else {
          this.setSteeringAngle();
        }
        break;

      case 'KeyD': // Steer right
        if (keyUp) {
          this.settings.steering.angle = 0;
        } else if (this.settings.steering.angle > -0.55) {
          if (this.settings.steering.fix) {
            this.settings.steering.fix = false;
          }
          this.setSteeringAngle(-0.1);
        } else {
          this.setSteeringAngle();
        }
        break;

      case 'Space': // Handbrake
        if (keyUp) {
          this.relaxBrake();
          this.setEngineForce(0);
        } else {
          if (this.settings.speedControll.active) {
            this.settings.speedControll.active = false;
          }
          this.raycastVehicle.setBrake(this.settings.maxBrakeForce, 2);
          this.raycastVehicle.setBrake(this.settings.maxBrakeForce, 3);
          
          if (this.materials.lights.LR && this.materials.lights.LR.emissive.r !== 0.7) {
            this.materials.lights.LR.emissive.r = 0.7;
            this.materials.lights.RR!.emissive.r = 0.7;
          }
        }
        break;

      case 'KeyR': // Reset vehicle
        this.resetVehicle();
        this.settings.steering.fix = false;
        this.settings.speedControll.active = false;
        this.settings.speedControll.refSpeed = 0;
        this.settings.speedControll.force = 0;
        this.relaxBrake();
        this.setEngineForce(0);
        break;

      case 'KeyB': // Toggle brake
        if (!keyUp) {
          if (this.raycastVehicle.wheelInfos[2].brake === 0) {
            this.raycastVehicle.setBrake(this.settings.maxBrakeForce, 2);
            this.raycastVehicle.setBrake(this.settings.maxBrakeForce, 3);
            
            if (this.materials.lights.LR && this.materials.lights.LR.emissive.r !== 0.7) {
              this.materials.lights.LR.emissive.r = 0.7;
              this.materials.lights.RR!.emissive.r = 0.7;
            }
          } else {
            this.relaxBrake();
          }
        }
        break;

      case 'KeyE': // Toggle speed control
        if (!keyUp) {
          this.settings.speedControll.active = !this.settings.speedControll.active;
          if (this.settings.speedControll.active) {
            this.settings.speedControll.refSpeed = Math.round(this.raycastVehicle.currentVehicleSpeedKmHour);
          } else {
            this.settings.speedControll.refSpeed = 0;
            this.settings.speedControll.force = 0;
          }
        }
        break;

      case 'KeyF': // Fix steering
        if (!keyUp) {
          this.settings.steering.fix = !this.settings.steering.fix;
        }
        break;
    }
  }

  /**
   * Set steering angle
   */
  private setSteeringAngle(value: number = 0): void {
    this.settings.steering.angle += value;
  }

  /**
   * Apply steering control with smooth interpolation
   */
  private steeringControl(angle: number): void {
    if (!this.settings.steering.fix) {
      this.settings.steering.stw += (angle - this.settings.steering.stw) / 7;
    }

    this.raycastVehicle.setSteeringValue(this.settings.steering.stw, 0);
    this.raycastVehicle.setSteeringValue(this.settings.steering.stw, 1);
  }

  /**
   * Release all brakes
   */
  private relaxBrake(): void {
    this.raycastVehicle.setBrake(0, 0);
    this.raycastVehicle.setBrake(0, 1);
    this.raycastVehicle.setBrake(0, 2);
    this.raycastVehicle.setBrake(0, 3);

    if (this.materials.lights.LR && this.materials.lights.LR.emissive.r !== 0.25) {
      this.materials.lights.LR.emissive.r = 0.25;
      this.materials.lights.RR!.emissive.r = 0.25;
    }
  }

  /**
   * Set brake force on all wheels
   */
  private setBrakeForce(brakeForce: number): void {
    if (this.raycastVehicle.currentVehicleSpeedKmHour > 0) {
      this.raycastVehicle.setBrake(brakeForce / 3, 0);
      this.raycastVehicle.setBrake(brakeForce / 3, 1);
      this.raycastVehicle.setBrake(brakeForce, 2);
      this.raycastVehicle.setBrake(brakeForce, 3);
    } else {
      this.raycastVehicle.setBrake(brakeForce, 0);
      this.raycastVehicle.setBrake(brakeForce, 1);
      this.raycastVehicle.setBrake(brakeForce / 2, 2);
      this.raycastVehicle.setBrake(brakeForce / 2, 3);
    }

    if (this.materials.lights.LR && this.materials.lights.LR.emissive.r !== 0.7) {
      this.materials.lights.LR.emissive.r = 0.7;
      this.materials.lights.RR!.emissive.r = 0.7;
    }
  }

  /**
   * Apply engine force based on drive type
   */
  private setEngineForce(force: number): void {
    const boost = 1.7;

    if (this.settings.typeDrive.full) {
      this.raycastVehicle.applyEngineForce(this.raycastVehicle.wheelInfos[0].brake > 0 ? 0 : force, 0);
      this.raycastVehicle.applyEngineForce(this.raycastVehicle.wheelInfos[1].brake > 0 ? 0 : force, 1);
      this.raycastVehicle.applyEngineForce(this.raycastVehicle.wheelInfos[2].brake > 0 ? 0 : force, 2);
      this.raycastVehicle.applyEngineForce(this.raycastVehicle.wheelInfos[3].brake > 0 ? 0 : force, 3);
    } else if (this.settings.typeDrive.front) {
      this.raycastVehicle.applyEngineForce(force * boost, 0);
      this.raycastVehicle.applyEngineForce(force * boost, 1);
    } else if (this.settings.typeDrive.rear) {
      this.raycastVehicle.applyEngineForce(force * boost, 2);
      this.raycastVehicle.applyEngineForce(force * boost, 3);
    }
  }

  /**
   * Speed control system (cruise control)
   */
  private speedControl(): void {
    if (this.settings.speedControll.active) {
      this.settings.speedControll.force = 
        200 * (this.settings.speedControll.refSpeed - this.raycastVehicle.currentVehicleSpeedKmHour);
      this.setEngineForce(-this.settings.speedControll.force);
    }
  }

  /**
   * Reset vehicle to initial position and state
   */
  public resetVehicle(): void {
    // Position
    this.raycastVehicle.chassisBody.position.copy(this.initPosition);
    this.raycastVehicle.chassisBody.previousPosition.setZero();
    this.raycastVehicle.chassisBody.interpolatedPosition.setZero();
    this.raycastVehicle.chassisBody.initPosition.setZero();

    // Orientation
    this.raycastVehicle.chassisBody.quaternion.set(-1, 0, 0, 1);
    this.raycastVehicle.chassisBody.initQuaternion.set(0, 0, 0, 1);
    this.raycastVehicle.chassisBody.interpolatedQuaternion.set(0, 0, 0, 1);

    // Velocity
    this.raycastVehicle.chassisBody.velocity.setZero();
    this.raycastVehicle.chassisBody.initVelocity.setZero();
    this.raycastVehicle.chassisBody.angularVelocity.setZero();
    this.raycastVehicle.chassisBody.initAngularVelocity.setZero();

    // Force
    this.raycastVehicle.chassisBody.force.setZero();
    this.raycastVehicle.chassisBody.torque.setZero();

    // Sleep state
    this.raycastVehicle.chassisBody.sleepState = 0;
    this.raycastVehicle.chassisBody.timeLastSleepy = 0;
    this.raycastVehicle.chassisBody.wakeUp();
  }

  /**
   * Update turn signals
   */
  private updateTurnLights(): void {
    switch (this.settings.turnLightsHelper.mainOperation) {
      case 0:
        if (this.settings.steering.angle !== 0 && this.materials.lights.LF) {
          this.settings.turnLightsHelper.defColor.setHex(this.materials.lights.LF.color.getHex());
          this.settings.turnLightsHelper.defEmissive.setHex(this.materials.lights.LF.emissive.getHex());

          if (this.settings.steering.angle > 0) {
            this.settings.turnLightsHelper.mainOperation = 1;
          } else if (this.settings.steering.angle < 0) {
            this.settings.turnLightsHelper.mainOperation = 2;
          }
        }
        break;

      case 1:
        if (this.settings.steering.angle === 0 && !this.settings.steering.fix) {
          this.settings.turnLightsHelper.mainOperation = 3;
        }
        this.turnLightControl(this.materials.lights.LF!, this.materials.lights.rearTurns.L!);
        break;

      case 2:
        if (this.settings.steering.angle === 0 && !this.settings.steering.fix) {
          this.settings.turnLightsHelper.mainOperation = 3;
        }
        this.turnLightControl(this.materials.lights.RF!, this.materials.lights.rearTurns.R!);
        break;

      case 3:
        // Reset all lights
        if (this.materials.lights.LF) {
          this.materials.lights.LF.color.setHex(this.settings.turnLightsHelper.defColor.getHex());
          this.materials.lights.RF!.color.setHex(this.settings.turnLightsHelper.defColor.getHex());
          this.materials.lights.LF.emissive.setHex(this.settings.turnLightsHelper.defEmissive.getHex());
          this.materials.lights.RF!.emissive.setHex(this.settings.turnLightsHelper.defEmissive.getHex());
        }
        
        this.settings.turnLightsHelper.mainOperation = 0;
        this.settings.turnLightsHelper.operation = 0;
        break;
    }
  }

  /**
   * Control individual turn light blinking
   */
  private turnLightControl(headlight: THREE.MeshStandardMaterial, rear: THREE.MeshStandardMaterial): void {
    switch (this.settings.turnLightsHelper.operation) {
      case 0:
        headlight.color.setHex(this.settings.turnLightsHelper.defColor.getHex());
        headlight.emissive.setHex(this.settings.turnLightsHelper.defEmissive.getHex());
        this.settings.turnLightsHelper.operation = 1;
        break;

      case 1:
        if (this.timer?.pulseHerz?._2_?.pulse) {
          headlight.color.setHex(this.settings.turnLightsHelper.turnColor.getHex());
          headlight.emissive.setHex(this.settings.turnLightsHelper.turnEmmisive.getHex());
          rear.color.setHex(this.settings.turnLightsHelper.turnColor.getHex());
          rear.emissive.setHex(this.settings.turnLightsHelper.turnEmmisive.getHex());
          this.settings.turnLightsHelper.operation = 2;
        }
        break;

      case 2:
        if (this.timer?.pulseHerz?._2_?.pulse) {
          headlight.color.setHex(this.settings.turnLightsHelper.defColor.getHex());
          headlight.emissive.setHex(this.settings.turnLightsHelper.defEmissive.getHex());
          rear.color.setHex(this.settings.turnLightsHelper.defColorRear.getHex());
          rear.emissive.setHex(this.settings.turnLightsHelper.defEmissiveRear.getHex());
          this.settings.turnLightsHelper.operation = 1;
        }
        break;
    }
  }

  /**
   * Update headlights direction based on steering
   */
  private updateLightHelper(): void {
    this.body.headlightHelp(this.settings.steering.stw);
  }

  /**
   * Update suspension supports rotation
   */
  private updateSupports(): void {
    if (this.supports.LF && this.supports.RF && this.supports.LR && this.supports.RR &&
        (this.settings.steering.stw > 0.01 || this.settings.steering.stw < -0.01)) {
      this.supports.LF.rotation.y = -this.settings.steering.stw - Math.PI / 2;
      this.supports.RF.rotation.y = -this.settings.steering.stw - Math.PI / 2;
    }
  }

  /**
   * Update raycast vehicle wheel transforms
   */
  private updateRaycastVehicle(): void {
    this.raycastVehicle.updateWheelTransform(0);
    this.raycastVehicle.updateWheelTransform(1);
    this.raycastVehicle.updateWheelTransform(2);
    this.raycastVehicle.updateWheelTransform(3);
  }

  /**
   * Main update loop
   */
  private frameCount = 0;
  public update(): void {
    if (!this.physicWorld.isPaused) {
      this.body.update();
      this.updateRaycastVehicle();
      this.steeringControl(this.settings.steering.angle);
      this.speedControl();
      this.updateSupports();

      if (this.timer) {
        this.updateTurnLights();
      }

      if (this.body.headLights?.LF?.visible && this.body.headLights?.RF?.visible) {
        this.updateLightHelper();
      }

      // Update all wheels
      this.wheels.LF.updateBodyInfo();
      this.wheels.LF.update();
      this.wheels.RF.updateBodyInfo();
      this.wheels.RF.update();
      this.wheels.LR.updateBodyInfo();
      this.wheels.LR.update();
      this.wheels.RR.updateBodyInfo();
      this.wheels.RR.update();
      
      // Log position every 60 frames (about once per second)
      this.frameCount++;
      if (this.frameCount % 60 === 0) {
        console.log('Vehicle position:', this.body.physicBody.position);
        console.log('Vehicle velocity:', this.body.physicBody.velocity);
        console.log('Vehicle on ground:', this.raycastVehicle.numWheelsOnGround);
      }
    }
  }

  /**
   * Toggle headlights visibility
   */
  public changeBodyHeadlightsVisible(v?: boolean): void {
    if (v === undefined) {
      this.body.headLights.LF.visible = !this.body.headLights.LF.visible;
      this.body.headLights.RF.visible = !this.body.headLights.RF.visible;

      if (this.body.headLights.LF.visible) {
        this.materials.lights.LF!.emissive.setHex(0xffffff);
        this.materials.lights.RF!.emissive.setHex(0xffffff);
        this.settings.turnLightsHelper.defColor.setHex(0xffffff);
      } else {
        this.materials.lights.LF!.emissive.setHex(0x000000);
        this.materials.lights.RF!.emissive.setHex(0x000000);
        this.settings.turnLightsHelper.defColor.setHex(0x000000);
      }
    } else {
      this.body.headLights.LF.visible = v;
      this.body.headLights.RF.visible = v;
      
      if (v) {
        this.materials.lights.LF!.emissive.setHex(0xffffff);
        this.materials.lights.RF!.emissive.setHex(0xffffff);
      } else {
        this.materials.lights.LF!.emissive.setHex(0x000000);
        this.materials.lights.RF!.emissive.setHex(0x000000);
      }
    }
  }

  /**
   * Add texture map to vehicle body
   */
  public addMap(map: THREE.Texture): void {
    if (this.materials.body) {
      this.materials.body.map = map;
      this.materials.body.map.wrapS = THREE.RepeatWrapping;
      this.materials.body.map.wrapT = THREE.RepeatWrapping;
      this.materials.body.map.repeat.set(40, 40);
      this.materials.body.needsUpdate = true;
    }
  }

  /**
   * Change drive type (Front/Rear/Full)
   */
  public changeTypeDrive(type: string): void {
    switch (type) {
      case 'Front':
        this.settings.typeDrive.front = true;
        this.settings.typeDrive.full = false;
        this.settings.typeDrive.rear = false;
        break;
      case 'Rear':
        this.settings.typeDrive.front = false;
        this.settings.typeDrive.full = false;
        this.settings.typeDrive.rear = true;
        break;
      case 'Full':
        this.settings.typeDrive.front = false;
        this.settings.typeDrive.full = true;
        this.settings.typeDrive.rear = false;
        break;
    }
  }

  /**
   * Calculate real dimensions based on scale
   */
  private calculateRealDim(): { body: Dimensions; wheel: Dimensions } {
    return {
      body: {
        x: this.mainDim.body.x * this.mainDim.scaleOriginal,
        y: this.mainDim.body.y * this.mainDim.scaleOriginal,
        z: this.mainDim.body.z * this.mainDim.scaleOriginal
      },
      wheel: {
        x: this.mainDim.wheel.x * this.mainDim.scaleOriginal,
        y: this.mainDim.wheel.y * this.mainDim.scaleOriginal,
        z: this.mainDim.wheel.z * this.mainDim.scaleOriginal
      }
    };
  }

  // Additional setters for UI controls
  public changeFrictionSlip(f: number): void {
    this.raycastVehicle.wheelInfos.forEach(wheel => wheel.frictionSlip = f);
  }

  public changeMaxEngineForce(e: number): void {
    this.settings.maxEngineForce = e;
  }

  public changeMaxBrakeForce(b: number): void {
    this.settings.maxBrakeForce = b;
  }

  public changeClearance(c: number): void {
    this.raycastVehicle.wheelInfos[0].chassisConnectionPointLocal.z = this.connectionPointsWheels.LF.z - c;
    this.raycastVehicle.wheelInfos[1].chassisConnectionPointLocal.z = this.connectionPointsWheels.RF.z - c;
    this.raycastVehicle.wheelInfos[2].chassisConnectionPointLocal.z = this.connectionPointsWheels.LR.z - c;
    this.raycastVehicle.wheelInfos[3].chassisConnectionPointLocal.z = this.connectionPointsWheels.RR.z - c;
  }

  public changeCompression(dC: number): void {
    this.raycastVehicle.wheelInfos.forEach(wheel => wheel.dampingCompression = dC);
  }

  public changeRelaxation(dR: number): void {
    this.raycastVehicle.wheelInfos.forEach(wheel => wheel.dampingRelaxation = dR);
  }
}
