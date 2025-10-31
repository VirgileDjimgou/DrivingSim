/**
 * GraphicsLoader - Asset loader for Three.js resources
 * Handles loading of textures, 3D models, and cube environments
 * Extends EventEmitter for progress tracking
 */
import { EventEmitter } from 'events';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { AssetConfig, LoaderProgressData } from '../types';

export class GraphicsLoader extends EventEmitter {
  private name: string = 'loader';
  private assets: AssetConfig[];
  private loaded: number = 0;
  private assetsSize: number = 0;
  private res: Map<string, any>;

  constructor(assets: AssetConfig[]) {
    super();
    this.assets = assets;
    this.res = new Map();
  }

  /**
   * Start loading all assets
   */
  public load(): void {
    if (!this.assets || this.assets.length === 0) {
      console.warn('Loader: No assets to load!');
      return;
    }

    this.emit('start');
    this.loaded = 0;
    this.assetsSize = this.assets.length;
    this.res = new Map();

    for (let i = 0; i < this.assets.length; i++) {
      this.doLoad(this.chooseLoader(this.assets[i]), this.assets[i]);
    }
  }

  /**
   * Get loader type from URL extension
   * @param url - Asset URL
   * @returns File extension
   */
  private getLoaderTypeFromUrl(url: string): string {
    return url.split('.').pop() || '';
  }

  /**
   * Choose appropriate loader based on asset type
   * @param asset - Asset configuration
   * @returns Three.js loader instance
   */
  private chooseLoader(
    asset: AssetConfig
  ): THREE.TextureLoader | THREE.CubeTextureLoader | GLTFLoader | null {
    switch (asset.type) {
      case 'texture':
        return new THREE.TextureLoader();
      
      case 'env':
      case 'scene':
        return new THREE.CubeTextureLoader();
      
      case '3dModel': {
        const extension = this.getLoaderTypeFromUrl(
          typeof asset.url === 'string' ? asset.url : asset.url[0]
        );
        switch (extension) {
          case 'gltf':
          case 'glb':
            return new GLTFLoader();
          default:
            console.warn(`Unsupported 3D model format: ${asset.name}`);
            return null;
        }
      }
      
      default:
        console.warn(`Unknown asset type: ${asset.name}`);
        return null;
    }
  }

  /**
   * Execute asset loading
   * @param loader - Loader instance
   * @param asset - Asset configuration
   */
  private doLoad(
    loader: THREE.TextureLoader | THREE.CubeTextureLoader | GLTFLoader | null,
    asset: AssetConfig
  ): void {
    if (!loader) {
      return;
    }

    loader.setPath(asset.path).load(
      asset.url as any,
      (model: any) => {
        this.res.set(asset.name, model);
        this.loaded++;
        
        const progressData: LoaderProgressData = {
          value: this.loaded / this.assetsSize,
          name: asset.name,
          map: model,
          asset
        };
        
        this.emit('progress', progressData);
        
        if (this.loaded >= this.assetsSize) {
          this.emit('load', this.res);
        }
      },
      undefined,
      (error: any) => {
        console.error(`Error loading asset: ${asset.name}`, error);
      }
    );
  }

  /**
   * Get loaded assets map
   */
  public getAssets(): Map<string, any> {
    return this.res;
  }
}
