import * as THREE from "three";


import ThreeMaterialsScene from "./ThreeMaterialsScene";
import ThreeStage from "./ThreeStage";
import Physics from "./Physics";
import { MeshMaterialType } from "three/three-core";


export default class SceneObjects {


	private static enabled: boolean = false;
	private static bodies: Ammo.btRigidBody[] = [];
	private static meshes: THREE.Mesh[] = [];
	private static count: number = 0;


	public static init(): void {

		this.enabled = true;

		const quaternion: THREE.Quaternion = new THREE.Quaternion(0, 0, 0, 1);
		quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(-10));

		this.createBox(new THREE.Vector3(0, -0.5, 40), quaternion, 2, 2, 8, 0, 1, ThreeMaterialsScene.road);
		this.createBox(new THREE.Vector3(2, -0.5, 40), quaternion, 2, 2, 8, 0, 1, ThreeMaterialsScene.ramp);
		this.createBox(new THREE.Vector3(-2, -0.5, 40), quaternion, 2, 2, 8, 0, 1, ThreeMaterialsScene.ramp);

		const size: number = 1;
		const w: number = 8;
		const h: number = 6;
		for (let j = 0; j < w; j++) {
			for (let i = 0; i < h; i++) {
				this.createBox(
					new THREE.Vector3(size * j - (size * (w - 1)) / 2, size * i + (size / 2), 50),
					new THREE.Quaternion(0, 0, 0, 1),
					size, size, size, 10, 1,
					ThreeMaterialsScene.road
				);
			}
		}
	}

	public static update(): void {
		if (this.enabled) {

			const transform: Ammo.btTransform = new Ammo.btTransform();

			for (let i: number = 0; i < this.count; i++) {

				const mesh: THREE.Mesh = this.meshes[i];
				const body: Ammo.btRigidBody = this.bodies[i];
				const ms: Ammo.btMotionState = body.getMotionState();

				if (ms) {
					ms.getWorldTransform(transform);
					const position: Ammo.btVector3 = transform.getOrigin();
					const quaternion: Ammo.btQuaternion = transform.getRotation();
					mesh.position.set(position.x(), position.y(), position.z());
					mesh.quaternion.set(quaternion.x(), quaternion.y(), quaternion.z(), quaternion.w());
					mesh.updateMatrix();
				}
			}
		}
	}

	private static createBox(position: THREE.Vector3, quaternion: THREE.Quaternion, w: number, l: number, h: number, mass: number, friction: number, material: THREE.MeshMaterialType): void {
		const mesh: THREE.Mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(w, l, h, 1, 1, 1), material);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.matrixAutoUpdate = false;
		mesh.position.copy(position);
		mesh.quaternion.copy(quaternion);
		mesh.updateMatrix();
		ThreeStage.scene.add(mesh);

		const transform: Ammo.btTransform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
		transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));

		const motion: Ammo.btDefaultMotionState = new Ammo.btDefaultMotionState(transform);
		const inertia: Ammo.btVector3 = new Ammo.btVector3(0, 0, 0);
		const shape: Ammo.btBoxShape = new Ammo.btBoxShape(new Ammo.btVector3(w * 0.5, l * 0.5, h * 0.5));
		shape.calculateLocalInertia(mass, inertia);

		const info: Ammo.btRigidBodyConstructionInfo = new Ammo.btRigidBodyConstructionInfo(mass, motion, shape, inertia);
		const body: Ammo.btRigidBody = new Ammo.btRigidBody(info);
		body.setFriction(friction);
		Physics.world.addRigidBody(body);

		if (mass > 0) {
			body.setActivationState(4);
			this.bodies.push(body);
			this.meshes.push(mesh);
			this.count++;
		}
	}
}
