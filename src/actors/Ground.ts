/**
 * Ground class - Terrain with heightfield physics
 * Creates uneven terrain using Cannon-ES heightfield and Three.js mesh
 */
import { GObject } from './GObject';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import type { IPhysicsWorld, GroundConfig } from '../types';

export class Ground extends GObject {
  private dim: GroundConfig;
  private initPos: THREE.Vector3;

  constructor(physWorld: IPhysicsWorld, dim: GroundConfig, initialPos: THREE.Vector3) {
    super(physWorld);
    this.dim = dim;
    this.initPos = initialPos;
    this.physicMeshMaterial = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide });
    this.init();
  }

  /**
   * Initialize the ground object
   */
  public init(): void {
    this.createBody();
    this.graphic.physicMesh = this.createPhysicMesh();
    this.addToPhysicWorld(this.physicBody!);
    this.add(this.graphic.physicMesh);
    this.update();
  }

  /**
   * Create the physics body with heightfield shape
   */
  protected createBody(): void {
    const hfShape = this.createHeightFieldShape(this.dim);
    hfShape.material = this.physicWorld.groundMaterial;
    
    const quat = new CANNON.Quaternion();
    quat.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

    this.physicBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(this.initPos.x, this.initPos.y, this.initPos.z),
      quaternion: quat,
      shape: hfShape,
      material: this.physicWorld.groundMaterial
    });
    
    (this.physicBody as any).name = 'ground';
  }

  /**
   * Create heightfield shape from configuration
   */
  private createHeightFieldShape(dim: GroundConfig): CANNON.Heightfield {
    const matrix: number[][] = [];
    const defHeight = 0;
    const heightPlane = dim.heightPlane;

    for (let i = 0; i < dim.sizeX; i++) {
      matrix.push([]);
      for (let j = 0; j < dim.sizeY; j++) {
        let height =
          Math.sin((i / dim.sizeX) * Math.PI * 8) *
          Math.sin((j / dim.sizeY) * Math.PI * 8) *
          dim.amplitude +
          heightPlane;

        // Flatten edges
        if (i === 0 || i === dim.sizeX - 1 || j === 0 || j === dim.sizeY - 1) {
          height = defHeight;
        }

        matrix[i]!.push(height);
      }
    }

    return new CANNON.Heightfield(matrix, { elementSize: dim.elementSize });
  }

  /**
   * Override createPhysicMesh to use ground dimensions
   */
  protected createPhysicMesh(): THREE.Object3D {
    const obj = new THREE.Object3D();
    
    if (!this.physicBody) return obj;

    for (let l = 0; l < this.physicBody.shapes.length; l++) {
      const shape = this.physicBody.shapes[l]!;
      
      if (shape.type === CANNON.SHAPE_TYPES.HEIGHTFIELD) {
        const hfShape = shape as CANNON.Heightfield;
        const geometry = new THREE.BufferGeometry();
        const vertices: number[] = [];
        
        const v0 = new CANNON.Vec3();
        const v1 = new CANNON.Vec3();
        const v2 = new CANNON.Vec3();

        for (let xi = 0; xi < hfShape.data.length - 1; xi++) {
          for (let yi = 0; yi < hfShape.data[xi]!.length - 1; yi++) {
            for (let k = 0; k < 2; k++) {
              hfShape.getConvexTrianglePillar(xi, yi, k === 0);
              v0.copy((hfShape as any).pillarConvex.vertices[0]);
              v1.copy((hfShape as any).pillarConvex.vertices[1]);
              v2.copy((hfShape as any).pillarConvex.vertices[2]);
              v0.vadd((hfShape as any).pillarOffset, v0);
              v1.vadd((hfShape as any).pillarOffset, v1);
              v2.vadd((hfShape as any).pillarOffset, v2);

              vertices.push(v0.x, v0.y, v0.z, v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
            }
          }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        geometry.computeBoundingBox();
        geometry.computeVertexNormals();

        // Create UVs
        const uv: number[] = [];
        const bbox = geometry.boundingBox!;
        const size = new THREE.Vector3();
        bbox.getSize(size);

        for (let i = 0; i < vertices.length; i += 3) {
          uv.push(((vertices[i]! - bbox.min.x) / size.x) * this.dim.sizeX);
          uv.push(((vertices[i + 1]! - bbox.min.y) / size.y) * this.dim.sizeY);
        }

        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uv), 2));

        const mesh = new THREE.Mesh(geometry, this.physicMeshMaterial);
        mesh.receiveShadow = true;
        mesh.castShadow = true;

        const offset = this.physicBody.shapeOffsets[l]!;
        const orientation = this.physicBody.shapeOrientations[l]!;
        mesh.position.set(offset.x, offset.y, offset.z);
        mesh.quaternion.set(orientation.x, orientation.y, orientation.z, orientation.w);

        obj.add(mesh);
      }
    }

    return obj;
  }
}
