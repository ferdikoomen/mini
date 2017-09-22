import * as THREE from "three";


import {ThreeAssets} from "./ThreeAssets";
import {ThreeMaterialsWheels} from "./ThreeMaterialsWheels";
import {Settings} from "./Settings";


export class CarWheels {


	public static frontLeft: THREE.LOD;
	public static frontRight: THREE.LOD;
	public static rearLeft: THREE.LOD;
	public static rearRight: THREE.LOD;


	public static load(manager: THREE.LoadingManager): Promise<void> {
		return new Promise<void>(
			(resolve: () => void): void => {

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

				ThreeAssets.load(manager, [
					require("../../models/tire-low.json"),
					require("../../models/wheel-low.json"),
					require("../../models/wheel-cap-low.json"),
					require("../../models/brake-disc-low.json")
				]).then((geometry: THREE.BufferGeometry): void => {
					this.updateLOD(this.frontLeft, geometry, ThreeMaterialsWheels.materials, 8);
					this.updateLOD(this.frontRight, geometry, ThreeMaterialsWheels.materials, 8);
					this.updateLOD(this.rearLeft, geometry, ThreeMaterialsWheels.materials, 8);
					this.updateLOD(this.rearRight, geometry, ThreeMaterialsWheels.materials, 8);
					if (!Settings.highQuality) {
						resolve();
					}
				});

				if (Settings.highQuality) {
					ThreeAssets.load(manager, [
						require("../../models/tire-high.json"),
						require("../../models/wheel-high.json"),
						require("../../models/wheel-cap-high.json"),
						require("../../models/brake-disc-high.json")
					]).then((geometry: THREE.BufferGeometry): void => {
						this.updateLOD(this.frontLeft, geometry, ThreeMaterialsWheels.materials, 0);
						this.updateLOD(this.frontRight, geometry, ThreeMaterialsWheels.materials, 0);
						this.updateLOD(this.rearLeft, geometry, ThreeMaterialsWheels.materials, 0);
						this.updateLOD(this.rearRight, geometry, ThreeMaterialsWheels.materials, 0);
						resolve();
					});
				}
			}
		);
	}


	private static updateLOD(lod: THREE.LOD, geometry: THREE.BufferGeometry, materials: THREE.Material[], distance: number): void {
		const mesh: THREE.Mesh = new THREE.Mesh(geometry, <any> materials);
		mesh.castShadow = true;
		mesh.matrixAutoUpdate = false;
		lod.addLevel(mesh, distance);
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
}
