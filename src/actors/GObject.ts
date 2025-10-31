/**
 * GObject - Base class for all game objects
 * Combines Three.js graphics with Cannon-ES physics
 */
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import type { IPhysicsWorld, Dimensions } from '../types';

export abstract class GObject extends THREE.Group {
  protected physicWorld: IPhysicsWorld;
  protected mass: number = 0;
  protected physicBody: CANNON.Body | null = null;
  protected dim: Dimensions | null = null;
  protected graphic: {
    physicMesh: THREE.Object3D | null;
    model: THREE.Object3D | null;
  };
  protected physicMeshMaterial: THREE.MeshBasicMaterial;

  constructor(physicWorld: IPhysicsWorld) {
    super();
    this.physicWorld = physicWorld;
    this.graphic = {
      physicMesh: null,
      model: null
    };
    this.physicMeshMaterial = new THREE.MeshBasicMaterial({
      color: 0xb3b6b7,
      wireframe: false,
      side: THREE.DoubleSide
    });
  }

  /**
   * Initialize the object (must be implemented by subclass)
   */
  public abstract init(): void;

  /**
   * Create the physics body (must be implemented by subclass)
   */
  protected abstract createBody(): void;

  /**
   * Add texture map to material
   */
  public addMapToMaterial(map: THREE.Texture): void {
    this.children.forEach((child) => {
      if (child.type === 'Mesh') {
        const mesh = child as THREE.Mesh;
        if (mesh.material instanceof THREE.Material) {
          (mesh.material as any).map = map;
          mesh.material.needsUpdate = true;
        }
      } else if (child.children.length > 0) {
        child.children.forEach((subChild) => {
          if (subChild.type === 'Mesh') {
            const mesh = subChild as THREE.Mesh;
            if (mesh.material instanceof THREE.Material) {
              (mesh.material as any).map = map;
              (mesh.material as any).map.wrapS = THREE.RepeatWrapping;
              (mesh.material as any).map.wrapT = THREE.RepeatWrapping;
              (mesh.material as any).map.repeat.set(5, 5);
              (mesh.material as any).map.generateMipmaps = true;
              mesh.material.needsUpdate = true;
            }
          }
        });
      }
    });
  }

  /**
   * Add ambient occlusion map to material
   */
  public addAOMapToMaterial(map: THREE.Texture): void {
    this.applyTextureToMaterial(map, 'aoMap');
  }

  /**
   * Add normal map to material
   */
  public addNormalMapToMaterial(map: THREE.Texture): void {
    this.applyTextureToMaterial(map, 'normalMap');
  }

  /**
   * Add displacement map to material
   */
  public addDisplMapToMaterial(map: THREE.Texture): void {
    this.applyTextureToMaterial(map, 'displacementMap');
  }

  /**
   * Add roughness map to material
   */
  public addRoughnessMapToMaterial(map: THREE.Texture): void {
    this.applyTextureToMaterial(map, 'roughnessMap');
  }

  /**
   * Helper method to apply texture to material property
   */
  private applyTextureToMaterial(map: THREE.Texture, propertyName: string): void {
    this.children.forEach((child) => {
      if (child.type === 'Mesh') {
        const mesh = child as THREE.Mesh;
        if (mesh.material instanceof THREE.Material) {
          (mesh.material as any)[propertyName] = map;
          mesh.material.needsUpdate = true;
        }
      } else if (child.children.length > 0) {
        child.children.forEach((subChild) => {
          if (subChild.type === 'Mesh') {
            const mesh = subChild as THREE.Mesh;
            if (mesh.material instanceof THREE.Material) {
              (mesh.material as any)[propertyName] = map;
              (mesh.material as any)[propertyName].wrapS = THREE.RepeatWrapping;
              (mesh.material as any)[propertyName].wrapT = THREE.RepeatWrapping;
              mesh.material.needsUpdate = true;
            }
          }
        });
      }
    });
  }

  /**
   * Add physics body to the world
   */
  protected addToPhysicWorld(body: CANNON.Body): void {
    this.physicWorld.world.addBody(body);
  }

  /**
   * Create visual mesh from physics body
   */
  protected createPhysicMesh(): THREE.Object3D {
    return this.body2mesh(this.dim!);
  }

  /**
   * Update object position and rotation from physics
   */
  public update(): void {
    if (!this.physicWorld.isPaused && this.physicBody) {
      this.position.copy(this.physicBody.position as any);
      this.quaternion.copy(this.physicBody.quaternion as any);
    }
  }

  /**
   * Toggle physics mesh visibility
   */
  public changeVisuPhysicMesh(status: boolean): void {
    if (this.graphic.physicMesh) {
      this.graphic.physicMesh.visible = status;
    }
  }

  /**
   * Convert Cannon.js body to Three.js mesh for visualization
   */
  protected body2mesh(dim: Dimensions): THREE.Object3D {
    const obj = new THREE.Object3D();
    
    if (!this.physicBody) return obj;

    for (let l = 0; l < this.physicBody.shapes.length; l++) {
      const shape = this.physicBody.shapes[l];
      let mesh: THREE.Mesh | null = null;

      if (shape.type === CANNON.SHAPE_TYPES.BOX) {
        const boxShape = shape as CANNON.Box;
        const geometry = new THREE.BoxGeometry(
          boxShape.halfExtents.x * 2,
          boxShape.halfExtents.y * 2,
          boxShape.halfExtents.z * 2
        );
        mesh = new THREE.Mesh(geometry, this.physicMeshMaterial);
      } else if (shape.type === CANNON.SHAPE_TYPES.CYLINDER) {
        // Custom cylinder handling
        const drawData = (shape as any).drawData;
        if (drawData) {
          const geometry = new THREE.CylinderGeometry(
            drawData.radius,
            drawData.radius,
            drawData.height,
            drawData.segments,
            drawData.segments
          );
          geometry.rotateX(Math.PI / 2);
          mesh = new THREE.Mesh(geometry, this.physicMeshMaterial);
        }
      } else if (shape.type === CANNON.SHAPE_TYPES.HEIGHTFIELD) {
        mesh = this.createHeightfieldMesh(shape as CANNON.Heightfield, dim);
      } else if (shape.type === CANNON.SHAPE_TYPES.SPHERE) {
        const sphereShape = shape as CANNON.Sphere;
        const geometry = new THREE.SphereGeometry(sphereShape.radius, 10, 10);
        mesh = new THREE.Mesh(geometry, this.physicMeshMaterial);
      }

      if (mesh) {
        mesh.receiveShadow = true;
        mesh.castShadow = true;

        const offset = this.physicBody.shapeOffsets[l];
        const orientation = this.physicBody.shapeOrientations[l];
        mesh.position.set(offset.x, offset.y, offset.z);
        mesh.quaternion.set(orientation.x, orientation.y, orientation.z, orientation.w);

        obj.add(mesh);
      }
    }

    return obj;
  }

  /**
   * Create mesh for heightfield shape
   */
  private createHeightfieldMesh(shape: CANNON.Heightfield, dim: Dimensions): THREE.Mesh {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    
    const v0 = new CANNON.Vec3();
    const v1 = new CANNON.Vec3();
    const v2 = new CANNON.Vec3();

    for (let xi = 0; xi < shape.data.length - 1; xi++) {
      for (let yi = 0; yi < shape.data[xi]!.length - 1; yi++) {
        for (let k = 0; k < 2; k++) {
          shape.getConvexTrianglePillar(xi, yi, k === 0);
          v0.copy((shape as any).pillarConvex.vertices[0]);
          v1.copy((shape as any).pillarConvex.vertices[1]);
          v2.copy((shape as any).pillarConvex.vertices[2]);
          v0.vadd((shape as any).pillarOffset, v0);
          v1.vadd((shape as any).pillarOffset, v1);
          v2.vadd((shape as any).pillarOffset, v2);

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
      uv.push((vertices[i]! - bbox.min.x) / size.x * dim.sizeX);
      uv.push((vertices[i + 1]! - bbox.min.y) / size.y * dim.sizeY);
    }

    geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uv), 2));

    return new THREE.Mesh(geometry, this.physicMeshMaterial);
  }

  /**
   * Find mesh by name in children array
   */
  protected foundMeshByName(name: string, source: THREE.Object3D[]): THREE.Object3D | undefined {
    return source.find((obj) => obj.name === name);
  }

  /**
   * Get the physics body
   */
  public getPhysicBody(): CANNON.Body | null {
    return this.physicBody;
  }
}
