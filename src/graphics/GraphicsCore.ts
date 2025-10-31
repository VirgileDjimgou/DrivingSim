/**
 * GraphicsCore Class
 * Main graphics engine managing Three.js renderer, scene, and asset loading
 */
import * as THREE from 'three';
import { GraphicsLoader } from '../utils/GraphicsLoader';
import { Timer } from '../utils/Timer';
import type { AssetConfig } from '../types';

export class GraphicsCore {
  public name: string;
  public domElement: HTMLElement;
  public loader: GraphicsLoader;
  public currentScene: any;
  public renderer!: THREE.WebGLRenderer;
  public canvas!: HTMLCanvasElement;
  public timer!: Timer;
  
  private pixelRatio: number;
  private appConfig: {
    fps: number;
    dT: number;
    tPrev: number;
    speed: number;
    fi: number;
  };

  constructor(element: HTMLElement, resources: AssetConfig[]) {
    this.name = 'three.js app';
    this.domElement = element;
    this.loader = new GraphicsLoader(resources);
    this.currentScene = null;
    this.pixelRatio = window.devicePixelRatio;
    
    this.appConfig = {
      fps: 60,
      dT: 0,
      tPrev: window.performance.now(),
      speed: 0.001,
      fi: 0
    };
  }

  /**
   * Initialize graphics system
   */
  public init(): void {
    this.timer = new Timer();
    this.prepareCanvas(this.domElement);

    // Append canvas to DOM
    if (this.domElement) {
      this.domElement.appendChild(this.canvas);
    } else {
      document.body.appendChild(this.canvas);
    }

    // Create WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.autoClear = true;
    this.renderer.setPixelRatio(this.pixelRatio);

    // Handle window resize
    window.addEventListener('resize', () => {
      this.resize();
    });

    console.log('GraphicsCore initialized');
  }

  /**
   * Pre-start initialization
   */
  public preStart(): void {
    this.startLoadAssets();
    
    if (this.timer) {
      this.timer.preStart();
    }

    this.renderer.clear();
    console.log('GraphicsCore pre-start complete');
  }

  /**
   * Update graphics each frame
   */
  public update(dt: number): void {
    if (this.timer) {
      this.timer.update();
    }
    this.animate(dt);
  }

  /**
   * Post-start cleanup
   */
  public postStart(): void {
    if (this.timer) {
      this.timer.postStart();
    }
    this.renderer.dispose();
  }

  /**
   * Animation loop
   */
  private animate(dt: number): void {
    this.appConfig.fi += this.appConfig.speed * dt * this.appConfig.fps;
    
    if (this.currentScene) {
      this.currentScene.update(this.appConfig.fi);

      // Render based on pixel ratio and performance
      if (this.pixelRatio === 1) {
        this.renderer.render(this.currentScene.scene, this.currentScene.camera);
      } else if (this.pixelRatio > 1) {
        if ((dt * this.appConfig.fps) < 1.2) {
          this.renderer.render(this.currentScene.scene, this.currentScene.camera);
        }
      }
    }
  }

  /**
   * Handle window resize
   */
  private resize(): void {
    if (this.domElement) {
      this.renderer.setSize(
        this.domElement.clientWidth,
        this.domElement.clientHeight
      );
    } else {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    this.pixelRatio = window.devicePixelRatio;
    this.renderer.setPixelRatio(this.pixelRatio);

    if (this.currentScene?.resizeAction) {
      this.currentScene.resizeAction();
    }
  }

  /**
   * Start loading assets
   */
  private startLoadAssets(): void {
    if (!this.currentScene?.assets) {
      this.loader.on('start', () => {
        console.log('Asset loading started');
      });

      this.loader.on('progress', (data: { value: number }) => {
        if (this.currentScene?.addAssets) {
          this.currentScene.addAssets(data);
        }
        console.log(`Loading: ${Math.round(data.value * 100)}%`);
      });

      this.loader.on('load', (result: Map<string, any>) => {
        console.log('All assets loaded');
        
        if (this.currentScene) {
          this.currentScene.assets = result;
          if (this.currentScene.loadAllAssets) {
            this.currentScene.loadAllAssets();
          }
        }

        this.resize();
        
        // Initialize UI after assets are loaded
        const uiController = (this as any).uiController;
        const vehicleSceneRef = (this as any).vehicleSceneRef;
        if (uiController && vehicleSceneRef) {
          setTimeout(() => {
            uiController.init(vehicleSceneRef);
          }, 100);
        }
      });

      this.loader.load();
    }
  }

  /**
   * Prepare canvas element
   */
  private prepareCanvas(element: HTMLElement): void {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'canvas';

    if (element) {
      this.canvas.width = element.clientWidth;
      this.canvas.height = element.clientHeight;
    } else {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  /**
   * Set physics world reference (used by Film)
   */
  public setPhysicsWorld(physicsCore: any): void {
    // Store reference if needed
  }

  /**
   * Get physics world reference
   */
  public getPhysicWorld(world: any): void {
    // Store reference to physics world if needed by scene
    if (this.currentScene) {
      this.currentScene.physicWorld = world;
    }
  }
}
