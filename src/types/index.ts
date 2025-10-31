/**
 * Type definitions for the DrivingSim project
 * Provides interfaces and types for the vehicle simulation system
 */

import type * as CANNON from 'cannon-es';
import type * as THREE from 'three';

/**
 * Dimensions for 3D objects
 */
export interface Dimensions {
  x: number;
  y: number;
  z: number;
}

/**
 * Asset configuration for loading resources
 */
export interface AssetConfig {
  type: 'texture' | 'env' | 'scene' | '3dModel';
  name: string;
  path: string;
  url: string | string[];
}

/**
 * Vehicle wheel position identifiers
 */
export type WheelPosition = 'LF' | 'RF' | 'LR' | 'RR';

/**
 * Drive type configuration
 */
export type DriveType = 'Front' | 'Rear' | 'Full';

/**
 * Vehicle settings interface
 */
export interface VehicleSettings {
  maxEngineForce: number;
  maxBrakeForce: number;
  speedControl: {
    active: boolean;
    refSpeed: number;
    force: number;
  };
  steering: {
    angle: number;
    stw: number;
    fix: boolean;
  };
  typeDrive: {
    front: boolean;
    rear: boolean;
    full: boolean;
  };
}

/**
 * Vehicle materials interface
 */
export interface VehicleMaterials {
  body: THREE.MeshStandardMaterial | null;
  rim: Record<WheelPosition, THREE.MeshStandardMaterial | null>;
  lights: {
    LF: THREE.MeshStandardMaterial | null;
    RF: THREE.MeshStandardMaterial | null;
    LR: THREE.MeshStandardMaterial | null;
    RR: THREE.MeshStandardMaterial | null;
    rearTurns: {
      L: THREE.MeshStandardMaterial | null;
      R: THREE.MeshStandardMaterial | null;
    };
  };
  supports: Record<WheelPosition, THREE.MeshStandardMaterial | null>;
}

/**
 * Ground configuration interface
 */
export interface GroundConfig {
  sizeX: number;
  sizeY: number;
  heightPlane: number;
  amplitude: number;
  elementSize: number;
}

/**
 * Physics world interface
 */
export interface IPhysicsWorld {
  world: CANNON.World;
  groundMaterial: CANNON.Material;
  wheelMaterial: CANNON.Material;
  isPaused: boolean;
}

/**
 * Loader progress data
 */
export interface LoaderProgressData {
  value: number;
  name: string;
  map: any;
  asset: AssetConfig;
}

/**
 * Scene settings interface
 */
export interface SceneSettings {
  sceneLightBias: number;
  controlsMaxDist: number;
  controlsMaxAngle: number;
}

/**
 * Application configuration
 */
export interface AppConfig {
  fps: number;
  dT: number;
  tPrev: number;
  speed: number;
  fi: number;
}

/**
 * Wheel options for raycast vehicle
 */
export interface WheelOptions {
  radius: number;
  directionLocal: CANNON.Vec3;
  suspensionStiffness: number;
  suspensionRestLength: number;
  frictionSlip: number;
  dampingRelaxation: number;
  dampingCompression: number;
  maxSuspensionForce: number;
  rollInfluence: number;
  axleLocal: CANNON.Vec3;
  chassisConnectionPointLocal: CANNON.Vec3;
  maxSuspensionTravel: number;
  customSlidingRotationalSpeed: number;
  useCustomSlidingRotationalSpeed: boolean;
}

/**
 * Timer pulse interface
 */
export interface TimerPulse {
  pulse: boolean;
  prev: number;
}

/**
 * GUI controls interface
 */
export interface GUIControls {
  changeSceneBackground: (colorHex: number) => void;
  changeSceneLightIntensity: (v: number) => void;
  changeSceneLightColor: (colorHex: number) => void;
  changeVehicleMaxEngine: (e: number) => void;
  changeVehicleMaxBrake: (b: number) => void;
  changeVehicleFriction: (f: number) => void;
  changeVehicleTypeDrive: (type: DriveType) => void;
  // Add more as needed
}
