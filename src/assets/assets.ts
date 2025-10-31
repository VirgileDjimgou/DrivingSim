/**
 * Assets configuration
 * Defines all 3D models, textures, and environments to be loaded
 */
import type { AssetConfig } from '../types';

const assetsConfig: AssetConfig[] = [
  {
    type: 'env',
    name: 'v1',
    path: '/assets/env/v1/',
    url: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']
  },
  {
    type: 'texture',
    name: 'ground_color',
    path: '/assets/ground/Tiles/',
    url: 'paint-texture_21.jpg'
  },
  {
    type: 'texture',
    name: 'ground_normal',
    path: '/assets/ground/Tiles/',
    url: 'paint-texture_18_n.jpg'
  },
  {
    type: 'texture',
    name: 'ground_roughness',
    path: '/assets/ground/Tiles/',
    url: 'paint-texture_18_r.jpg'
  },
  {
    type: 'scene',
    name: 'envBox',
    path: '/assets/sceneBox/sky3/',
    url: ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']
  },
  {
    type: 'texture',
    name: 'headlightsFlare',
    path: '/assets/head/',
    url: 'flareHead.jpg'
  },
  {
    type: '3dModel',
    name: 'vehicleModel',
    path: '/assets/gltf/',
    url: 'amg_e63.glb'
  },
  {
    type: 'texture',
    name: 'vehicleMap',
    path: '/assets/texture/',
    url: 'planeBake.jpg'
  }
];

export default assetsConfig;