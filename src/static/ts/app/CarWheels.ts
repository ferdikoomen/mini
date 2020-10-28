import * as THREE from "three";
import ThreeAssets from "./ThreeAssets";
import ThreeMaterialsWheels from "./ThreeMaterialsWheels";
import Settings from "./Settings";


export default class CarWheels {


	public static frontLeft: THREE.LOD;
	public static frontRight: THREE.LOD;
	public static rearLeft: THREE.LOD;
	public static rearRight: THREE.LOD;


	public static async load(manager: THREE.LoadingManager): Promise<void> {

		this.frontLeft = new THREE.LOD();
		this.frontRight = new THREE.LOD();
		this.rearLeft = new THREE.LOD();
		this.rearRight = new THREE.LOD();

		this.frontLeft.matrixAutoUpdate = false;
		this.frontRight.matrixAutoUpdate = false;
		this.rearLeft.matrixAutoUpdate = false;
		this.rearRight.matrixAutoUpdate = false;

		this.frontRight.rotateY(Math.PI);
		this.rearRight.rotateY(Math.PI);

		const geometryLQ: THREE.BufferGeometry = await ThreeAssets.load(manager, [
			"/static/models/tire-low.json",
			"/static/models/wheel-low.json",
			"/static/models/wheel-cap-low.json",
			"/static/models/brake-disc-low.json"
		]);

		this.updateLOD(this.frontLeft, geometryLQ, ThreeMaterialsWheels.materials, 8);
		this.updateLOD(this.frontRight, geometryLQ, ThreeMaterialsWheels.materials, 8);
		this.updateLOD(this.rearLeft, geometryLQ, ThreeMaterialsWheels.materials, 8);
		this.updateLOD(this.rearRight, geometryLQ, ThreeMaterialsWheels.materials, 8);
		if (!Settings.highQuality) {
			return;
		}

		if (Settings.highQuality) {
			const geometryHQ: THREE.BufferGeometry = await ThreeAssets.load(manager, [
				"/static/models/tire-high.json",
				"/static/models/wheel-high.json",
				"/static/models/wheel-cap-high.json",
				"/static/models/brake-disc-high.json"
			]);
			this.updateLOD(this.frontLeft, geometryHQ, ThreeMaterialsWheels.materials, 0);
			this.updateLOD(this.frontRight, geometryHQ, ThreeMaterialsWheels.materials, 0);
			this.updateLOD(this.rearLeft, geometryHQ, ThreeMaterialsWheels.materials, 0);
			this.updateLOD(this.rearRight, geometryHQ, ThreeMaterialsWheels.materials, 0);
			return;
		}
	}

	public static setPosition(x: number, y: number, z: number): void {
		this.frontLeft.position.set(x + 0.75, y + 0.314, z + 1.15);
		this.frontRight.position.set(x - 0.75, y + 0.314, z + 1.15);
		this.rearLeft.position.set(x + 0.75, y + 0.314, z - 1.35);
		this.rearRight.position.set(x - 0.75, y + 0.314, z - 1.35);
		this.frontLeft.updateMatrix();
		this.frontRight.updateMatrix();
		this.rearLeft.updateMatrix();
		this.rearRight.updateMatrix();
	}

	public static update(camera: THREE.Camera): void {
		if (Settings.highQuality) {
			this.frontLeft.update(camera);
			this.frontRight.update(camera);
			this.rearLeft.update(camera);
			this.rearRight.update(camera);
		}
	}

	private static updateLOD(lod: THREE.LOD, geometry: THREE.BufferGeometry, materials: THREE.Material[], distance: number): void {
		const mesh: THREE.Mesh = new THREE.Mesh(geometry, materials);
		mesh.castShadow = true;
		mesh.matrixAutoUpdate = false;
		lod.addLevel(mesh, distance);
	}
}
